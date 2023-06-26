use serde::Deserialize;
use serde_querystring::{from_str, ParseMode};
use vercel_runtime::{Request, RequestExt, StatusCode};

use crate::ResponseError;

pub fn query_to_results<T: for<'a> Deserialize<'a>>(req: &Request) -> Result<T, ResponseError> {
    let query: &str = req.uri().query().unwrap();
    let result: Result<T, ResponseError> =
        from_str::<T>(&query, ParseMode::Duplicate).map_err(|err| ResponseError {
            response: StatusCode::NOT_ACCEPTABLE.into(),
            error: err.message,
        });
    Ok(result?)
}

pub fn parse_payload<T: for<'a> Deserialize<'a>>(req: &Request) -> Result<T, ResponseError> {
    let payload = req.payload::<T>();
    match payload {
        Ok(parsed_success) => match parsed_success {
            Some(val) => Ok(val),
            None => Err(ResponseError {
                response: StatusCode::BAD_REQUEST.into(),
                error:
                    "Missing payload. Did you forget to set 'Content-Type' => 'application/json' ?"
                        .to_string(),
            }),
        },
        Err(error) => Err(ResponseError {
            response: StatusCode::BAD_REQUEST.into(),
            error: error.to_string(),
        }),
    }
}
