use http::{Method, StatusCode};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mangayomu_rust::{env_initializer, DecodedJWT, Env};
use request_handler::{Handler, JsonDataResponse, MiddlewareData, ResponseError};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::RwLock;
use vercel_runtime::{run, Body, Error, Request, RequestExt, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|req| async {
        Handler::builder(req)
            .middleware(env_initializer)
            .method(Method::POST, post)
            .build()
            .await
    })
    .await
}

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
        Ok(Response::builder()
            .status(StatusCode::OK)
            .body(
                JsonDataResponse {
                    response: StatusCode::OK.into(),
                    data: parsed.claims,
                }
                .into(),
            )
            .unwrap())
    } else {
        Err(ResponseError {
            response: StatusCode::UNAUTHORIZED.into(),
            error: "The provided id_token is invalid".to_string(),
        })
    }
}
