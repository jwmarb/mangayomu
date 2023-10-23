use argon2::{self, Argon2, PasswordHash, PasswordVerifier};
use chrono::Duration;
use futures::TryStreamExt;
use http::{Method, StatusCode};
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use mangayomu_rust::{
    connect_to_db, env_initializer, get_redis, map_redis_err, DecodedJWT, Env, User,
};
use mongodb::{bson::doc, options::FindOptions};
use redis::AsyncCommands;
use request_handler::{parse_payload, Handler, MiddlewareData, ResponseError};
use reqwest::Url;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;
use tokio::sync::RwLock;
use vercel_runtime::{run, Body, Error, Request, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|x| async {
        Handler::builder(x)
            .middleware(env_initializer)
            .method(Method::POST, post)
            .build()
            .await
    })
    .await
}

#[derive(Deserialize)]
struct RequestBody {
    username: String,
    password: String,
    remember_me: Option<bool>,
}

async fn post(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    connect_to_db(Arc::clone(&request), Arc::clone(&data)).await?;
    let r = parse_payload::<RequestBody>(&request)?;
    let username_or_email = r.username.as_str();
    let password = r.password.as_str();
    let remember_me = match r.remember_me {
        Some(val) => val,
        None => false,
    };
    let map = data.read().await;

    let env = map.get::<Env>("env")?;

    /* See if username/email is cached */
    let mut con = get_redis(env).await?;
    let cached_hashed_password = con
        .get::<&str, Option<String>>(username_or_email)
        .await
        .map_err(map_redis_err)?;

    if let Some(hit) = cached_hashed_password {
        let serialized = con
            .get::<String, String>(hit)
            .await
            .map_err(map_redis_err)?;
        let user = serde_json::from_str::<User>(&serialized).map_err(|x| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: x.to_string(),
        })?;
        let hashed_user_password = match &user.password {
            Some(val) => val,
            None => "",
        };
        if verify_password(password, &hashed_user_password)? {
            /* Create JWT and send it to the user via json */
            let token = create_jwt(env, &user, remember_me)?;
            let vercel_url = env.vercel_url.as_str();

            return Ok(Response::builder()
                .header(
                    "Set-Cookie",
                    format!(
                        "id_token={}; path=/; HttpOnly; Secure; Domain={}; SameSite=Strict",
                        token,
                        Url::parse(vercel_url).unwrap().host_str().unwrap()
                    ),
                )
                .status(StatusCode::OK)
                .body(json!({ "id_token": token }).to_string().into())
                .unwrap());
        }
    } else {
        let mongodb = map.get::<mongodb::Client>("mongodb")?;
        let database = mongodb.database(env.mongodb_database_name.as_str());
        let user_collection = database.collection::<User>("User");
        let filter =
            doc! { "$or": [{ "email": username_or_email }, { "username": username_or_email }]};
        let find_options = FindOptions::builder()
            .projection(doc! { "username": 1, "email": 1, "password": 1, "_id": 1 })
            .build();

        let mut cursor = user_collection
            .find(filter, find_options)
            .await
            .map_err(|x| ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: x.to_string(),
            })?;

        while let Some(user) = cursor.try_next().await.map_err(|x| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: x.to_string(),
        })? {
            let hashed_user_password = match &user.password {
                Some(val) => val,
                None => "",
            };
            if verify_password(password, &hashed_user_password)? {
                /* Create JWT and send it to the user via json */
                let token = create_jwt(env, &user, remember_me)?;

                return Ok(Response::builder()
                    .header(
                        "Set-Cookie",
                        format!(
                            "id_token={}; path=/; HttpOnly; Secure; SameSite=Strict",
                            token,
                        ),
                    )
                    .status(StatusCode::OK)
                    .body(json!({ "id_token": token }).to_string().into())
                    .unwrap());
            }
        }
    }

    Err(ResponseError {
        response: StatusCode::FORBIDDEN.into(),
        error: "Invalid username or password".to_string(),
    })
}

fn verify_password(password: &str, hashed_password: &str) -> Result<bool, ResponseError> {
    let parsed_hash = PasswordHash::new(hashed_password).map_err(|x| ResponseError {
        response: StatusCode::UNPROCESSABLE_ENTITY.into(),
        error: x.to_string(),
    })?;

    let password_matches = Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();

    Ok(password_matches)
}

fn create_jwt(env: &Env, user: &User, remember_me: bool) -> Result<String, ResponseError> {
    let realm_app_id = env.react_app_realm_id.as_str();
    let current_time = chrono::Utc::now()
        .checked_add_signed(match remember_me {
            true => Duration::days(61),
            false => Duration::days(env.jwt_exp_days.into()),
        })
        .ok_or_else(|| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: "DateTime Overflow".to_string(),
        })?
        .timestamp() as usize;
    let my_claim = DecodedJWT {
        aud: realm_app_id.to_string(),
        exp: current_time,
        sub: user._id.to_string(),
        username: user.username.to_string(),
    };
    let jwt_secret = &env.jwt_secret;
    let token = encode(
        &Header::new(Algorithm::HS256),
        &my_claim,
        &EncodingKey::from_secret(jwt_secret.as_bytes()),
    )
    .map_err(|x| ResponseError {
        response: StatusCode::INTERNAL_SERVER_ERROR.into(),
        error: x.to_string(),
    })?;
    Ok(token)
}
