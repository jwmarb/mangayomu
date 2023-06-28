import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import pLimit from 'promise-limit';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export interface EmbeddedResponseStatus {
  status_code: StatusCodes;
  message: string;
}

export class ResponseError {
  private response: EmbeddedResponseStatus;
  private error: string;
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
) => Promise<void> | void;
export type Middleware<T = NonNullable<unknown>> = (
  request: HandlerRequest<T>,
  response: HandlerResponse,
) => Promise<void> | void;
export type Method = HTTP_METHOD;

export class HandlerRequest<M = Record<PropertyKey, unknown>> {
  private request: NextApiRequest;
  private extraData: M;
  public constructor(request: NextApiRequest, extraData: M) {
    this.request = request;
    this.extraData = extraData;
  }
  public headers<
    T extends Record<string, unknown>,
  >(): typeof this.request.headers & T {
    return this.request.headers as typeof this.request.headers & T;
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
  private response: NextApiResponse;
  private statusCode: StatusCodes;
  public constructor(response: NextApiResponse) {
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
    record: Record<string, string | number | boolean>,
    options: {
      /**
       * Defines whether the cookie should be httpOnly.
       * By default it is `true`, but if there is a need for javascript to access the cookie, set this to `false`
       */
      httpOnly?: boolean;
      /**
       * The age of the cookie, in seconds. By default it is `86400`
       */
      maxAge?: number;

      /**
       * The path where the cookie should persist. By default it is `/`
       */
      path?: string;
    } = {},
  ) {
    const { httpOnly = true, maxAge = 86400, path = '/' } = options;
    const value = Object.entries(record)
      .concat([
        ['HttpOnly', httpOnly],
        ['Max-Age', maxAge],
        ['Path', path],
      ])
      .reduce((prev, curr) => {
        const [key, value] = curr;
        if (value && key === 'HttpOnly') prev.push('HttpOnly');
        else prev.push(`${key}=${value}`);
        return prev;
      }, [] as string[])
      .join('; ');
    this.response.setHeader('Set-Cookie', value);

    return this;
  }

  public status(status: StatusCodes) {
    this.statusCode = status;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public json(val: any) {
    if (val instanceof Error)
      return this.response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          ResponseError.from(StatusCodes.INTERNAL_SERVER_ERROR, val.message),
        );
    if (val instanceof ResponseError)
      return this.response
        .status(val.getResponse().status_code)
        .json(val.toObject());

    return this.response.status(this.statusCode).json({
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
    return async (_request: NextApiRequest, _response: NextApiResponse) => {
      const request = new HandlerRequest(_request, this.extraData);
      const response = new HandlerResponse(_response);
      try {
        for (const middleware of this.middlewares) {
          await limit(async () => middleware(request, response));
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
