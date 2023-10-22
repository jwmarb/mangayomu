use std::{collections::HashMap, sync::Arc};

use http::{HeaderValue, Method, StatusCode};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mangayomu_rust::{connect_to_db, env_initializer, DecodedJWT, Env};
use request_handler::{Handler, JsonDataResponse, MiddlewareData, ResponseError};
use serde_json::json;
use tokio::sync::RwLock;
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

async fn get(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    let map = data.read().await;
    let env: &Env = map.get("env")?;
    if let Some(cookie) = request.headers().get("cookie") {
        let id_token = get_id_token(cookie)?;
        let is_valid = decode::<DecodedJWT>(
            id_token,
            &DecodingKey::from_secret(env.jwt_secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        );
        if let Ok(parsed) = is_valid {
            println!("The id_token is valid");
        } else {
            println!("The id_token is invalid");
        }
    }
    Ok(Response::builder()
        .body(
            JsonDataResponse {
                response: StatusCode::OK.into(),
                data: json!({ "message": "all good" }),
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
