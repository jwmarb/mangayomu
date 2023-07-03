use std::{any::Any, collections::HashMap, fmt::Debug, future::Future, pin::Pin, sync::Arc};
use tokio::sync::RwLock;

use http::{Response, StatusCode};
use serde::{Deserialize, Serialize};
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

#[derive(Serialize, Debug, Deserialize)]
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

#[derive(Serialize, Deserialize)]
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

#[derive(Default)]
pub struct MiddlewareData(HashMap<String, Box<dyn Any + Sync + Send>>);
impl MiddlewareData {
    pub fn insert<T: Any + Sync + Send>(&mut self, key: String, value: T) {
        self.0.insert(key, Box::new(value));
    }
    pub fn get<T: Any + Sync + Send>(&self, key: &str) -> Result<&T, ResponseError> {
        self.0
            .get(key)
            .ok_or(ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: format!(
                    "Tried accessing key \"{}\" when it does not exist as a middleware data",
                    key
                ),
            })?
            .downcast_ref()
            .ok_or(ResponseError {
                response: StatusCode::INTERNAL_SERVER_ERROR.into(),
                error: format!("Mismatch type for key \"{}\"", key),
            })
    }
}
pub type MiddlewareRequest = Arc<Request>;
pub type HandlerRequest = Arc<Request>;
type PinnedFuture<Output> = Pin<Box<dyn Future<Output = Output> + Send + 'static>>;
pub type Middleware = Box<
    dyn Fn(
            MiddlewareRequest,
            Arc<RwLock<MiddlewareData>>,
        ) -> PinnedFuture<Result<(), ResponseError>>
        + Send,
>;
pub type MethodHandler = Box<
    dyn Fn(
        HandlerRequest,
        Arc<RwLock<MiddlewareData>>,
    ) -> PinnedFuture<Result<Response<Body>, ResponseError>>,
>;
