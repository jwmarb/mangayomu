use chrono::Utc;
use http::{Method, StatusCode};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mangayomu_rust::{env_initializer, get_redis, DecodedJWT, Env};
use redis::AsyncCommands;
use request_handler::{Handler, JsonDataResponse, MiddlewareData, ResponseError};
use reqwest::Url;
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::RwLock;
use vercel_runtime::{run, Body, Error, Request, RequestExt, Response};

#[derive(Deserialize)]
struct SessionRequestBody {
    id_token: String,
}

async fn post(
    req: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    let map = data.read().await;
    let env = map.get::<Env>("env")?;
    let jwt_secret = env.jwt_secret.as_bytes();
    let parsed = req
        .payload::<SessionRequestBody>()
        .map_err(|x| ResponseError {
            response: StatusCode::UNPROCESSABLE_ENTITY.into(),
            error: x.to_string(),
        })?
        .ok_or(ResponseError {
            response: StatusCode::UNPROCESSABLE_ENTITY.into(),
            error: "id_token must be defined".to_string(),
        })?;
    let id_token = parsed.id_token.as_str();
    /* Verify the JWT token */
    let is_valid = decode::<DecodedJWT>(
        id_token,
        &DecodingKey::from_secret(jwt_secret),
        &Validation::new(Algorithm::HS256),
    );

    if let Ok(parsed) = is_valid {
        let mut con = get_redis(env).await?;
        con.set_ex(
            format!("invalid:{}", id_token),
            0,
            parsed.claims.exp - (Utc::now().timestamp() as usize),
        )
        .await
        .map_err(|err| ResponseError {
            response: StatusCode::INTERNAL_SERVER_ERROR.into(),
            error: err.to_string(),
        })?;
        return Ok(Response::builder()
        .status(StatusCode::OK)
        .header(
            "Set-Cookie",
            format!(
                "id_token=deleted; path=/; HttpOnly; Secure; Domain={}; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                Url::parse(env.vercel_url.as_str())
                    .unwrap()
                    .host_str()
                    .unwrap()
            ),
        ).body(JsonDataResponse {
          response: StatusCode::OK.into(),
          data: "Logout success".to_string()
        }.into()).unwrap());
    }
    Ok(Response::builder()
        .status(StatusCode::UNPROCESSABLE_ENTITY)
        .body(
            ResponseError {
                response: StatusCode::UNPROCESSABLE_ENTITY.into(),
                error: "Token already expired".to_string(),
            }
            .into(),
        )
        .unwrap())
}

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
