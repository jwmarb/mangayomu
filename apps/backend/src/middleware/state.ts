import redis from '../redis';
import { Middleware, ResponseError } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';

interface StateQuery {
  state?: string;
}

const stateMiddleware: Middleware = async (request, response, next) => {
  const query = request.query<StateQuery>();
  if (query.state == null) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ResponseError.from(
          StatusCodes.UNAUTHORIZED,
          'This is a protected route',
        ),
      );
    return;
  } else {
    const value = await redis.getdel(query.state);
    if (value == null) {
      response
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          ResponseError.from(
            StatusCodes.UNAUTHORIZED,
            'This is a protected route',
          ),
        );
      return;
    } else next();
  }
};

export default stateMiddleware;
