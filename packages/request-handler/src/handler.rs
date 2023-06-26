use std::{
    collections::HashMap,
    future::Future,
    sync::{Arc, Mutex},
};

use http::Method;
use vercel_runtime::{Body, Error, Request, Response, StatusCode};

use crate::{
    types::{MethodHandler, MiddlewareRequest},
    Middleware, MiddlewareData, ResponseError,
};
pub struct Handler {
    request: Arc<Request>,
    middleware: Vec<Middleware>,
    extra_data: Arc<Mutex<MiddlewareData>>,
    available_methods: HashMap<Method, MethodHandler>,
}

impl Handler {
    pub fn new(req: Request) -> Self {
        Self {
            request: Arc::new(req),
            middleware: vec![],
            extra_data: Arc::new(Mutex::new(MiddlewareData::default())),
            available_methods: HashMap::new(),
        }
    }
    pub fn builder(req: Request) -> Self {
        Self {
            request: Arc::new(req),
            middleware: vec![],
            extra_data: Arc::new(Mutex::new(MiddlewareData::default())),
            available_methods: HashMap::new(),
        }
    }
    pub async fn build(&mut self) -> Result<Response<Body>, Error> {
        Handler::run(
            Arc::clone(&self.request),
            &self.available_methods,
            &self.middleware,
            Arc::clone(&self.extra_data),
        )
        .await
    }

    fn validate_method(
        available_methods: &HashMap<Method, MethodHandler>,
        target: &Method,
    ) -> Result<(), Response<Body>> {
        let d = available_methods.get(target);
        match d {
            Some(_) => Ok(()),
            None => Err(Response::builder()
                .status(StatusCode::NOT_IMPLEMENTED)
                .header("Content-Type", "application/json")
                .body(
                    ResponseError {
                        response: StatusCode::NOT_IMPLEMENTED.into(),
                        error: format!("{} method is not supported for this route", target),
                    }
                    .into(),
                )
                .unwrap()),
        }
    }
    pub async fn run(
        req: Arc<Request>,
        available_methods: &HashMap<Method, MethodHandler>,
        middlewares: &Vec<Middleware>,
        extra_data: Arc<Mutex<MiddlewareData>>,
    ) -> Result<Response<Body>, Error> {
        let method = req.method();
        /*
          First check if method for the route exists before executing anything else.
          This prevents unnecessary computation
        */
        let r = Handler::validate_method(available_methods, method);
        if let Err(err) = r {
            return Ok(err);
        }

        /*
          Middleware execution occurs here
        */
        for middleware in middlewares {
            let has_next = middleware(Arc::clone(&req), Arc::clone(&extra_data)).await;

            if let Err(err) = has_next {
                return Ok(Response::builder()
                    .status(err.response.status_code)
                    .body::<Body>(err.into())
                    .unwrap());
            }
        }

        /*
          Method execution occurs here
        */
        let route_executor = available_methods.get(method).unwrap();
        Ok(route_executor(Arc::clone(&req), Arc::clone(&extra_data))
            .await
            .unwrap_or_else(|err| {
                Response::builder()
                    .header("Content-Type", "application/json")
                    .status(err.response.status_code)
                    .body::<Body>(err.into())
                    .unwrap()
            }))
    }
    pub fn method<T, G>(&mut self, method: Method, f: T) -> &mut Self
    where
        T: Fn(Arc<Request>, Arc<Mutex<MiddlewareData>>) -> G + Send + 'static,
        G: Future<Output = Result<Response<Body>, ResponseError>> + Send + 'static,
    {
        self.available_methods.insert(
            method,
            Box::new(move |req, extra| Box::pin(f(Arc::clone(&req), Arc::clone(&extra)))),
        );
        self
    }

    pub fn middleware<T, G>(&mut self, f: T) -> &mut Self
    where
        T: Fn(MiddlewareRequest, Arc<Mutex<MiddlewareData>>) -> G + Send + 'static,
        G: Future<Output = Result<(), ResponseError>> + Send + 'static,
    {
        self.middleware
            .push(Box::new(move |req, extra| Box::pin(f(req, extra))));
        self
    }
}
