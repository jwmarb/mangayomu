use http::StatusCode;
use mongodb::{options::ClientOptions, Client};
use redis::{aio::AsyncStream, AsyncCommands, RedisError};
use request_handler::{parse_payload, MiddlewareData, ResponseError};
use serde::{Deserialize, Serialize};
use std::{pin::Pin, sync::Arc};
use tokio::sync::RwLock;
extern crate redis;
use vercel_runtime::Request;

#[derive(Serialize)]
pub struct Env {
    pub google_oauth2_id: String,
    pub google_oauth2_secret: String,
    pub mongodb_uri: String,
    pub mongodb_database_name: String,
    pub react_app_realm_id: String,
    pub redis_url: String,
    pub vercel_url: String,
    pub vercel_env: String,
    pub jwt_secret: String,
    pub jwt_exp_days: u16,
}

impl Env {
    pub fn init() -> Self {
        let vercel_env = std::env::var("VERCEL_ENV").unwrap();
        Self {
            google_oauth2_id: std::env::var("GOOGLE_OAUTH2_ID")
                .expect("GOOGLE_OAUTH2_ID must be set"),
            google_oauth2_secret: std::env::var("GOOGLE_OAUTH2_SECRET")
                .expect("GOOGLE_OAUTH2_SECRET must be set"),
            mongodb_uri: std::env::var("MONGODB_URI").expect("MONGODB_URI must be set"),
            mongodb_database_name: std::env::var("MONGODB_DATABASE_NAME")
                .expect("MONGODB_DATABASE_NAME must be set"),
            react_app_realm_id: std::env::var("REACT_APP_REALM_ID")
                .expect("REACT_APP_REALM_ID must be set"),
            redis_url: std::env::var("REDIS_URL").expect("REDIS_URL must be set"),
            vercel_url: format!(
                "{}{}",
                match vercel_env.as_str() {
                    "production" | "preview" => "https://",
                    _ => "http://",
                },
                std::env::var("VERCEL_URL").expect("VERCEL_URL must be set")
            ),
            jwt_exp_days: std::env::var("JWT_EXP_DAYS")
                .expect("JWT_EXP_DAYS must be set")
                .parse::<u16>()
                .expect("JWT_EXP_DAYS must be an integer whose value is greater than 0"),
            jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            vercel_env,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct StateVerifier {
    state: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub _id: String,
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DecodedJWT {
    pub aud: String,
    pub exp: usize,
    pub sub: String,
    pub username: String,
}

pub async fn env_initializer(
    _: Arc<Request>,
    extra_data: Arc<RwLock<MiddlewareData>>,
) -> Result<(), ResponseError> {
    extra_data
        .write()
        .await
        .insert("env".to_owned(), Env::init());
    Ok(())
}

pub async fn connect_to_db(
    _: Arc<Request>,
    extra_data: Arc<RwLock<MiddlewareData>>,
) -> Result<(), ResponseError> {
    let mut map = extra_data.write().await;
    let env: &Env = map.get("env")?;
    let mongodb_uri = &env.mongodb_uri;
    let client_options = ClientOptions::parse(mongodb_uri)
        .await
        .map_err(|x| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: x.to_string(),
        })?;
    let client = Client::with_options(client_options).map_err(|x| ResponseError {
        response: StatusCode::INTERNAL_SERVER_ERROR.into(),
        error: x.to_string(),
    })?;
    map.insert("mongodb".to_string(), client);
    Ok(())
}

pub fn map_redis_err(x: RedisError) -> ResponseError {
    ResponseError {
        response: StatusCode::INTERNAL_SERVER_ERROR.into(),
        error: x.to_string(),
    }
}

pub async fn state_verifier(
    req: Arc<Request>,
    extra_data: Arc<RwLock<MiddlewareData>>,
) -> Result<(), ResponseError> {
    let parsed = parse_payload::<StateVerifier>(&req).map_err(|_| ResponseError {
        response: StatusCode::FORBIDDEN.into(),
        error: "This route is protected".to_string(),
    })?;
    let m = extra_data.read().await;
    let env = m.get::<Env>("env")?;
    let redis_url = env.redis_url.as_str();
    let client = redis::Client::open(redis_url).map_err(map_redis_err)?;
    let mut con = client.get_tokio_connection().await.map_err(map_redis_err)?;
    let value: Option<u8> = con
        .srem("state", parsed.state)
        .await
        .map_err(|x| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: x.to_string(),
        })?;
    match value {
        None => Err(ResponseError {
            response: StatusCode::FORBIDDEN.into(),
            error: "This route is protected".to_string(),
        }),
        Some(_) => Ok(()),
    }
}

pub async fn get_redis(
    env: &Env,
) -> Result<redis::aio::Connection<Pin<Box<dyn AsyncStream + Send + Sync>>>, ResponseError> {
    let redis_url = env.redis_url.as_str();
    let client = redis::Client::open(redis_url).map_err(map_redis_err)?;
    let con = client.get_tokio_connection().await.map_err(map_redis_err)?;
    Ok(con)
}
