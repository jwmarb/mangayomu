use std::sync::Arc;

use http::Method;
use request_handler::{Handler, JsonDataResponse, ResponseError};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|req| async { Handler::builder(req).method(Method::GET, get).build().await }).await
}

async fn get(_: Arc<Request>) -> Result<Response<Body>, ResponseError> {
    Ok(Response::builder()
        .status(StatusCode::OK)
        .body(JsonDataResponse::data(json!({ "success": true }), None))
        .unwrap())
}
