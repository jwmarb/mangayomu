import { Middleware } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';

const cors: Middleware = (request, response, next) => {
  console.log('CORS set');
  response.header({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  });
  if (request.method === 'OPTIONS') {
    response.status(StatusCodes.OK).end();
  }

  next();
};

export default cors;
