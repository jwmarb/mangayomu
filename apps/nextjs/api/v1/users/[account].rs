use http::{HeaderValue, Method, StatusCode};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mangayomu_rust::{connect_to_db, env_initializer, DecodedJWT, Env, User};
use mongodb::Client;
use mongodb::{bson::doc, options::FindOneOptions};
use request_handler::{Handler, JsonDataResponse, MiddlewareData, ResponseError};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::RwLock;
use url::Url;
use vercel_runtime::{run, Body, Error, Request, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|x| async {
        Handler::builder(x)
            .middleware(env_initializer)
            .middleware(connect_to_db)
            .method(Method::GET, get)
            .build()
            .await
    })
    .await
}

// async fn post(
//   request: Arc<Request>,
//   data: Arc<RwLock<MiddlewareData>>
// ) -> Result<Response<Body>, ResponseError> {

// }

async fn get(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    let parsed_url = Url::parse(&request.uri().to_string()).unwrap();
    let hash_query: HashMap<String, String> = parsed_url.query_pairs().into_owned().collect();
    let username = hash_query.get("account").ok_or(ResponseError {
        response: StatusCode::UNPROCESSABLE_ENTITY.into(),
        error: "Invalid username argument".to_owned(),
    })?;
    let map = data.read().await;
    let env: &Env = map.get("env")?;
    let mongo_cli = map.get::<Client>("mongodb")?;
    let user_collection = mongo_cli
        .database(&env.mongodb_database_name)
        .collection::<User>("User");
    if let Some(cookie) = request.headers().get("cookie") {
        let id_token = get_id_token(cookie)?;
        let is_valid = decode::<DecodedJWT>(
            id_token,
            &DecodingKey::from_secret(env.jwt_secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        );
        if let Ok(parsed) = is_valid {
            if &parsed.claims.username == username {
                let options = FindOneOptions::builder()
                    .projection(doc! { "password": 0 })
                    .build();
                let result = user_collection
                    .find_one(doc! { "username": username }, options)
                    .await
                    .map_err(|err| ResponseError {
                        response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                        error: err.to_string(),
                    })?
                    .ok_or(ResponseError {
                        response: StatusCode::NOT_FOUND.into(),
                        error: format!("The user '{}' does not exist", username),
                    })?;

                return Ok(Response::builder()
                    .body(
                        JsonDataResponse {
                            response: StatusCode::OK.into(),
                            data: result,
                        }
                        .into(),
                    )
                    .unwrap());
            }
        }
    }
    let options = FindOneOptions::builder()
        .projection(doc! { "email": 0, "password": 0 })
        .build();
    let result = user_collection
        .find_one(doc! { "username": username }, options)
        .await
        .map_err(|err| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: err.to_string(),
        })?
        .ok_or(ResponseError {
            response: StatusCode::NOT_FOUND.into(),
            error: format!("The user '{}' does not exist", username),
        })?;
    Ok(Response::builder()
        .body(
            JsonDataResponse {
                response: StatusCode::OK.into(),
                data: result,
            }
            .into(),
        )
        .unwrap())
}

fn get_id_token(cookie: &HeaderValue) -> Result<&str, ResponseError> {
    let cookie_string = cookie.to_str().map_err(|err| ResponseError {
        response: StatusCode::UNPROCESSABLE_ENTITY.into(),
        error: err.to_string(),
    })?;
    if let Some(index) = cookie_string.find("id_token=") {
        let cookie_str_n = cookie_string.len();
        let start = 9 + index;
        let mut end = start;
        let cookie_str_bytes = cookie_string.as_bytes();
        while end < cookie_str_n && cookie_str_bytes[end] != b';' {
            end += 1;
        }
        let id_token = &cookie_string[start..end];
        return Ok(id_token);
    };
    Err(ResponseError {
        response: StatusCode::UNPROCESSABLE_ENTITY.into(),
        error: "Cookie does not exist".to_owned(),
    })
}
