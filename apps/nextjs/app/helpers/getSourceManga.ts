import React from 'react';
import { redis, SourceManga, getMongooseConnection } from '@mangayomu/backend';
import { ISourceMangaSchema } from '@mangayomu/schemas';
const getSourceManga = React.cache(
  (pathName: string): Promise<ISourceMangaSchema | null> => {
    return new Promise((res, rej) => {
      redis.get(pathName).then((cached) => {
        if (cached == null) {
          const { connect } = getMongooseConnection();
          connect().then(() => {
            SourceManga.findById(pathName).then((value) => {
              if (value == null) rej();
              else
                redis
                  .setex(pathName, 300, JSON.stringify(value.toJSON()))
                  .then(() => res(value.toObject()));
            });
          });
        } else res(JSON.parse(cached));
      });
    });
  },
);

export default getSourceManga;
