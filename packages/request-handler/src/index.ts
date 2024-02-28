/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse, IncomingMessage } from 'http';
export type VercelRequestCookies = {
  [key: string]: string;
};
export type VercelRequestQuery = {
  [key: string]: string | string[];
};
export type VercelRequestBody = any;
export type VercelRequest = IncomingMessage & {
  query: VercelRequestQuery;
  cookies: VercelRequestCookies;
  body: VercelRequestBody;
};
export type VercelResponse = ServerResponse & {
  send: (body: any) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
  redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
};

import pLimit from 'promise-limit';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

type HTTP_METHOD =
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH';

export interface EmbeddedResponseStatus {
  status_code: StatusCodes;
  message: string;
}

export class ResponseError {
  public readonly response: EmbeddedResponseStatus;
  public readonly error: string;
  public static from(
    status: StatusCodes,
    error: Error | string,
  ): ResponseError {
    return new ResponseError(status, error);
  }
  public constructor(status: StatusCodes, error: Error | string) {
    this.response = {
      message: getReasonPhrase(status),
      status_code: status,
    };
    this.error = error instanceof Error ? error.message : error;
  }
  public toObject() {
    return {
      response: this.response,
      error: this.error,
    };
  }
  public getResponse() {
    return this.response;
  }
  public getError() {
    return this.error;
  }
}

export type Route<T = NonNullable<unknown>> = (
  request: HandlerRequest<T>,
  response: HandlerResponse,
) => Promise<void | VercelResponse> | void | VercelResponse;
export type Middleware<T = NonNullable<unknown>> = (
  request: HandlerRequest<T>,
  response: HandlerResponse,
  next: () => void,
) => Promise<void | VercelResponse> | void | VercelResponse;
export type Method = HTTP_METHOD;

export class HandlerRequest<M = Record<PropertyKey, unknown>> {
  private request: VercelRequest;
  private extraData: M;

  public get _vercelRequest() {
    return this.request;
  }

  public constructor(request: VercelRequest, extraData: M) {
    this.request = request;
    this.extraData = extraData;
  }
  public headers<
    T extends Record<string, unknown>,
  >(): VercelRequest['headers'] & T {
    return this.request.headers as VercelRequest['headers'] & T;
  }
  public body<T>(): T {
    return this.request.body;
  }
  public query<T>(): T {
    return this.request.query as T;
  }
  public cookies<T>(): T {
    return this.request.cookies as T;
  }
  public get method() {
    return this.request.method as Method;
  }
  public setData<K extends keyof M, V extends M[K]>(key: K, value: V) {
    this.extraData[key] = value;
  }
  public getData<K extends keyof M, V extends M[K]>(key: K): V {
    return this.extraData[key] as V;
  }
}

export class HandlerResponse {
  private response: VercelResponse;
  private statusCode: StatusCodes;
  public constructor(response: VercelResponse) {
    this.response = response;
    this.statusCode = StatusCodes.OK;
  }

  public header(headers: Record<string, string | number | readonly string[]>) {
    for (const key in headers) {
      this.response.setHeader(key, headers[key]);
    }
    return this;
  }

  public cookie(
    record: Record<string, string | number | boolean | Date>,
    options: {
      /**
       * Forbids JavaScript from accessing the cookie, for example, through the [`Document.cookie`](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) property. Note that a cookie that has been created with `HttpOnly` will still be sent with JavaScript-initiated requests, for example, when calling [`XMLHttpRequest.send()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send) or [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch). This mitigates attacks against cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)).
       */
      httpOnly?: boolean;
      /**
       * Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately. If both `Expires` and `Max-Age` are set, `Max-Age` has precedence.
       */
      maxAge?: Date;

      /**
       * Indicates the path that *must* exist in the requested URL for the browser to send the `Cookie` header.
       *
       * The forward slash (`/`) character is interpreted as a directory separator, and subdirectories are matched as well. For example, for `Path=/docs`,
       *
       * -   the request paths `/docs`, `/docs/`, `/docs/Web/`, and `/docs/Web/HTTP` will all match.
       * -   the request paths `/`, `/docsets`, `/fr/docs` will not match.
       */
      path?: string;

      /**
       * Indicates that the cookie is sent to the server only when a request is made with the `https:` scheme (except on localhost), and therefore, is more resistant to [man-in-the-middle](https://developer.mozilla.org/en-US/docs/Glossary/MitM) attacks.
       */
      secure?: boolean;
    } = {},
  ) {
    const defaults = (
      [
        options.httpOnly != null && ['HttpOnly', options.httpOnly],
        options.maxAge != null && ['Max-Age', options.maxAge.toString()],
        options.path != null && ['Path', options.path],
        options.secure != null && ['Secure', options.secure],
      ] as [string, Date | number | boolean | string][]
    ).filter(Boolean);
    const value = Object.entries(record)
      .concat(defaults)
      .reduce((prev, curr) => {
        const [key, value] = curr;
        if (typeof value === 'boolean' && value === true) prev.push(key);
        else prev.push(`${key}=${value}`);
        return prev;
      }, [] as string[])
      .join('; ');
    this.response.setHeader('Set-Cookie', [value]);

    return this;
  }

  public status(status: StatusCodes) {
    this.statusCode = status;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public json(val: any) {
    if (val instanceof Error)
      return this.response.json(
        ResponseError.from(StatusCodes.INTERNAL_SERVER_ERROR, val.message),
      );
    if (val instanceof ResponseError) return this.response.json(val.toObject());

    return this.response.json({
      data: val,
      response: {
        status_code: this.statusCode,
        message: getReasonPhrase(this.statusCode),
      } as EmbeddedResponseStatus,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public body(val: any) {
    return this.response.status(this.statusCode).send(val);
  }
  public redirect(path: string) {
    this.response.redirect(path);
  }

  public get _vercelResponse() {
    return this.response;
  }

  public end() {
    this.response.end();
    return this;
  }
}
export class Handler {
  private routes: Map<Method, Route>;
  private extraData: Record<string, unknown>;
  private middlewares: Middleware[];
  public constructor() {
    this.routes = new Map();
    this.extraData = {};
    this.middlewares = [];
  }
  public static builder(): Handler {
    return new Handler();
  }
  public middleware(middleware: Middleware): Handler {
    this.middlewares.push(middleware);
    return this;
  }
  public route(method: Method, route: Route): Handler {
    this.routes.set(method, route);
    return this;
  }
  public build() {
    const limit = pLimit(1);
    return async (_request: VercelRequest, _response: VercelResponse) => {
      const request = new HandlerRequest(_request, this.extraData);
      const response = new HandlerResponse(_response);
      try {
        for (const middleware of this.middlewares) {
          let hasNext = false;
          const next = () => {
            hasNext = true;
          };
          await limit(async () => middleware(request, response, next));
          if (!hasNext) return;
        }
        const method = request.method as Method;
        const routeFn = this.routes.get(method);
        if (routeFn == null)
          return response
            .status(StatusCodes.NOT_IMPLEMENTED)
            .json(
              ResponseError.from(
                StatusCodes.NOT_IMPLEMENTED,
                `${method} method is not supported for this route`,
              ).toObject(),
            );

        await routeFn(request, response);
      } catch (e: unknown) {
        if (e instanceof ResponseError)
          return response
            .status(e.getResponse().status_code)
            .json(e.toObject());

        if (e instanceof Error)
          return response
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
              ResponseError.from(
                StatusCodes.INTERNAL_SERVER_ERROR,
                e.message,
              ).toObject(),
            );

        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            ResponseError.from(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'An error has occurred',
            ).toObject(),
          );
      }
    };
  }
}

export default { Handler, ResponseError };
