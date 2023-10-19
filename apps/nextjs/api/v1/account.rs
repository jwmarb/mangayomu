use std::sync::Arc;

use http::Method;
use request_handler::{Handler, MiddlewareData, ResponseError};
use tokio::sync::RwLock;
use vercel_runtime::{run, Body, Error, Request, Response};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(|x| async { Handler::builder(x).method(Method::GET, get).build().await }).await
}

async fn get(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    todo!()
}
