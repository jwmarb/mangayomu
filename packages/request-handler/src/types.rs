use std::{
    any::Any,
    collections::HashMap,
    future::Future,
    pin::Pin,
    sync::{Arc, Mutex},
};

use http::{Response, StatusCode};
use serde::Serialize;
use serde_json::json;
use vercel_runtime::{Body, Request};

impl Into<EmbeddedResponseStatus> for StatusCode {
    fn into(self) -> EmbeddedResponseStatus {
        EmbeddedResponseStatus {
            message: self.to_string(),
            status_code: self.as_u16(),
        }
    }
}

#[derive(Serialize, Debug)]
pub struct EmbeddedResponseStatus {
    pub message: String,
    pub status_code: u16,
}

impl Into<Body> for EmbeddedResponseStatus {
    fn into(self) -> Body {
        Body::Text(json!({ "message": self.message, "status_code": self.status_code }).to_string())
    }
}

impl Default for EmbeddedResponseStatus {
    fn default() -> Self {
        Self {
            message: StatusCode::OK.to_string(),
            status_code: StatusCode::OK.as_u16(),
        }
    }
}

#[derive(Serialize, Debug)]
pub struct ResponseError {
    pub response: EmbeddedResponseStatus,
    pub error: String,
}
impl Into<Body> for ResponseError {
    fn into(self) -> Body {
        Body::Text(
            json!({ "response": self.response, "error": self.error })
                .to_string()
                .into(),
        )
    }
}
pub struct JsonDataResponse<T: Serialize> {
    pub response: EmbeddedResponseStatus,
    pub data: T,
}

impl<T> JsonDataResponse<T>
where
    T: Serialize,
{
    pub fn data(data: T, status_code: Option<StatusCode>) -> Body {
        JsonDataResponse {
            response: match status_code {
                Some(res) => res.into(),
                None => StatusCode::OK.into(),
            },
            data,
        }
        .into()
    }
}
impl<T> Into<Body> for JsonDataResponse<T>
where
    T: Serialize,
{
    fn into(self) -> Body {
        Body::Text(
            json!({ "response": self.response, "data": self.data })
                .to_string()
                .into(),
        )
    }
}

pub type MiddlewareData = Arc<Mutex<HashMap<String, Box<dyn Any + Sync + Send>>>>;
pub type MiddlewareRequest = Arc<Request>;
pub type HandlerRequest = Arc<Request>;
type PinnedFuture<Output> = Pin<Box<dyn Future<Output = Output> + Send + 'static>>;
pub type Middleware = Box<
    dyn Fn(MiddlewareRequest, MiddlewareData) -> PinnedFuture<Result<(), ResponseError>> + Send,
>;
pub type MethodHandler =
    Box<dyn Fn(HandlerRequest) -> PinnedFuture<Result<Response<Body>, ResponseError>>>;
