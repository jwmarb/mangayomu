use vercel_runtime::{run, Body, Error, Request, Response};

fn post(
    request: Arc<Request>,
    data: Arc<RwLock<MiddlewareData>>,
) -> Result<Response<Body>, ResponseError> {
    todo!()
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
