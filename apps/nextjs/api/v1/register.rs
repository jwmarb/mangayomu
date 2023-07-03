use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2,
};
use futures::TryStreamExt;
use http::{Method, StatusCode};
use lazy_static::lazy_static;
use mangayomu_rust::{connect_to_db, env_initializer, get_redis, map_redis_err, Env, User};
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
};

use redis::AsyncCommands;
use regex::Regex;
use request_handler::{
    EmbeddedResponseStatus, Handler, JsonDataResponse, MiddlewareData, ResponseError,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::RwLock;
use validator::{Validate, ValidationErrors};
use vercel_runtime::{run, Body, Error, Request, RequestExt, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|req| async {
        Handler::builder(req)
            .middleware(env_initializer)
            .middleware(connect_to_db)
            .method(Method::POST, post)
            .build()
            .await
    })
    .await
}

lazy_static! {
    static ref NO_SPECIAL_CHARS: Regex = Regex::new(r"[^A-Za-z0-9]").unwrap();
}

#[derive(Serialize, Deserialize)]
struct ClientCreationPayload {
    email: String,
    password: String,
    username: String,
    payload_type: String,
}

#[derive(Serialize, Deserialize, Debug, Validate)]
struct BodyData {
    #[validate(
        required(message = "A username is required"),
        length(min = 1, message = "A username is required"),
        length(max = 100, message = "Username cannot be greater than 100 characters")
    )]
    username: Option<String>,
    #[validate(
        email(message = "Invalid email"),
        required(message = "Email is required")
    )]
    email: Option<String>,
    #[validate(
        length(min = 8, message = "Password must be greater than 8 characters"),
        required(message = "Password is required")
    )]
    password: Option<String>,
    #[validate(
        required(message = "Password confirmation is required"),
        must_match(other = "password", message = "Passwords do not match")
    )]
    #[serde(rename = "confirmPassword")]
    _confirm_password: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct UserAPICheckUserBody {
    payload_type: String,
    email: String,
    username: String,
}

#[derive(Serialize, Deserialize, Debug)]

struct APIValidationError {
    code: String,
    message: String,
}

#[derive(Serialize, Deserialize)]
struct UserAPIErrorResponseJson {
    response: EmbeddedResponseStatus,
    errors: HashMap<String, Vec<APIValidationError>>,
}

impl Into<Body> for UserAPIErrorResponseJson {
    fn into(self) -> Body {
        Body::Text(
            json!({ "response": self.response, "errors": self.errors })
                .to_string()
                .into(),
        )
    }
}

async fn post(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    let parsed = request
        .payload::<BodyData>()
        .map_err(|x| ResponseError {
            response: StatusCode::BAD_REQUEST.into(),
            error: x.to_string(),
        })?
        .ok_or(
            ResponseError {
                response: StatusCode::BAD_REQUEST.into(),
                error: "Body cannot be undefined".to_string(),
            }
            .into(),
        )?;
    if let Err(schema_err) = parsed.validate() {
        let body = json!({ "response": EmbeddedResponseStatus::from(StatusCode::BAD_REQUEST.into()), "data": schema_err }).to_string();
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(body.into())
            .unwrap());
    } else {
        let map = data.read().await;

        /* Extract environment variables */
        let env: &Env = map.get::<Env>("env")?;

        /* Gets mongodb instance */
        let mongodb = map.get::<mongodb::Client>("mongodb")?;
        let database = mongodb.database(env.mongodb_database_name.as_str());
        let user_collection = database.collection::<User>("User");

        /* Extract body fields */
        let username_unwrapped: String = parsed.username.unwrap();
        let email_unwrapped: String = parsed.email.unwrap();
        let username = username_unwrapped.as_str();
        let email = email_unwrapped.as_str();

        /* Checks if user exists */
        let filter = doc! { "$or": [{ "email": &email }, { "username": &username }] };
        let find_options = FindOptions::builder()
            .projection(doc! { "username": 1, "email": 1, "password": 1 })
            .build();
        let mut cursor = user_collection
            .find(filter, find_options)
            .await
            .map_err(|x| ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: x.to_string(),
            })?;

        let mut errors: HashMap<String, Vec<APIValidationError>> = HashMap::new();

        while let Some(user) = cursor.try_next().await.map_err(|x| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: x.to_string(),
        })? {
            if user.email == email {
                errors.insert(
                    "email".to_string(),
                    vec![APIValidationError {
                        code: "already_taken".to_string(),
                        message: "Email is already in use".to_string(),
                    }],
                );
            }
            if user.username == username {
                errors.insert(
                    "username".to_string(),
                    vec![APIValidationError {
                        code: "already_taken".to_string(),
                        message: "Username is already in use".to_string(),
                    }],
                );
            }
        }

        if errors.len() > 0 {
            return Ok(Response::builder()
                .status(StatusCode::FORBIDDEN)
                .body(
                    UserAPIErrorResponseJson {
                        response: StatusCode::FORBIDDEN.into(),
                        errors,
                    }
                    .into(),
                )
                .unwrap());
        }

        /* Hashes password */
        let password: String = parsed.password.unwrap();
        let password_bytes = password.as_bytes();
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(password_bytes, &salt)
            .map_err(|x| ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: x.to_string(),
            })?
            .to_string();

        /* Create user document */
        let new_user = User {
            _id: ObjectId::new().to_string(),
            email: email.to_owned(),
            username: username.to_owned(),
            password: password_hash.to_owned(),
        };
        let insert_result = user_collection
            .insert_one(&new_user, None)
            .await
            .map_err(|x| ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: x.to_string(),
            })?;

        /* Cache the email/username which points to an _id for fast login */
        let mut con = get_redis(env).await?;
        let id_str = new_user._id.as_str();
        let serialized_user: String =
            serde_json::to_string::<User>(&new_user).map_err(|x| ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: x.to_string(),
            })?;
        con.set_ex(email, id_str, 86400)
            .await
            .map_err(map_redis_err)?;
        con.set_ex(username, id_str, 86400)
            .await
            .map_err(map_redis_err)?;
        con.set_ex(id_str, serialized_user, 86400)
            .await
            .map_err(map_redis_err)?;
        Ok(Response::builder()
            .status(StatusCode::OK)
            .body(
                JsonDataResponse {
                    response: StatusCode::OK.into(),
                    data: insert_result.inserted_id,
                }
                .into(),
            )
            .unwrap())
    }
}
