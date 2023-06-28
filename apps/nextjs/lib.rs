use request_handler::{MiddlewareData, ResponseError};
use serde::Serialize;
use std::sync::Arc;
use tokio::sync::Mutex;
use vercel_runtime::Request;

#[derive(Serialize)]
pub struct Env {
    pub google_oauth2_id: String,
    pub google_oauth2_secret: String,
    pub mongodb_url: String,
    pub jwt_secret: String,
    pub jwt_expires_in: String,
    pub jwt_max_age: i32,
    pub react_app_realm_id: String,
    pub redis_url: String,
    pub vercel_url: String,
    pub vercel_env: String,
    pub oauth2_route: String,
}

impl Env {
    pub fn init() -> Self {
        let vercel_env = std::env::var("VERCEL_ENV").unwrap();
        Self {
            google_oauth2_id: std::env::var("GOOGLE_OAUTH2_ID")
                .expect("GOOGLE_OAUTH2_ID must be set"),
            google_oauth2_secret: std::env::var("GOOGLE_OAUTH2_SECRET")
                .expect("GOOGLE_OAUTH2_SECRET must be set"),
            mongodb_url: std::env::var("MONGODB_URL").expect("MONGODB_URL must be set"),
            jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            jwt_expires_in: std::env::var("JWT_EXPIRES_IN").expect("JWT_EXPIRES_IN must be set"),
            jwt_max_age: std::env::var("JWT_MAX_AGE")
                .expect("JWT_MAX_AGE must be set")
                .parse::<i32>()
                .unwrap(),
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
            vercel_env,
            oauth2_route: std::env::var("OAUTH2_ROUTE").unwrap_or("/api/v1/oauth2".to_string()),
        }
    }
}

pub async fn env_initializer(
    _: Arc<Request>,
    extra_data: Arc<Mutex<MiddlewareData>>,
) -> Result<(), ResponseError> {
    extra_data
        .lock()
        .await
        .insert("env".to_owned(), Env::init());
    Ok(())
}
