use std::sync::Arc;
use tokio::sync::Mutex;

use http::{Method, StatusCode};
use request_handler::{Handler, JsonDataResponse, MiddlewareData, ResponseError};
use vercel_runtime::{run, Body, Error, Request, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|req| async { Handler::builder(req).method(Method::GET, get).build().await }).await
}

async fn get(
    _: Arc<Request>,
    __: Arc<Mutex<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    Ok(Response::builder()
        .status(StatusCode::OK)
        .body(JsonDataResponse::data("Hello from Rust", None))
        .unwrap())
}
