import {
  HandlerRequest,
  Middleware,
  ResponseError,
} from '@mangayomu/request-handler';
import env from '@mangayomu/vercel-env';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var cached_mongoose: typeof mongoose;
}

let cached: typeof mongoose | null = global.cached_mongoose || null;

const connectMongoDB = (condition?: (request: HandlerRequest) => boolean) => {
  const m: Middleware = async (request, response, next) => {
    if ((condition && condition(request)) || condition == null) {
      if (cached != null) {
        console.log('Already found existing MongoDB connection');
        next();
      } else
        try {
          cached = await mongoose.connect(env().MONGODB_URI, {
            bufferCommands: false,
            dbName: env().MONGODB_DATABASE_NAME,
          });
          console.log('Established MongoDB connection');
        } catch (e) {
          response
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
              ResponseError.from(StatusCodes.INTERNAL_SERVER_ERROR, `${e}`),
            );
          return;
        }
    }

    next();
  };

  return m;
};

export function getMongooseConnection() {
  return {
    async connect() {
      if (cached != null) {
        console.log('Found existing MongoDB connection');
        return cached;
      }
      cached = await mongoose.connect(env().MONGODB_URI, {
        bufferCommands: false,
        dbName: env().MONGODB_DATABASE_NAME,
      });
      console.log('Established MongoDB connection');
    },
    async close() {
      if (cached != null) await cached.disconnect();
      cached = null;
    },
  };
}
export default connectMongoDB;
