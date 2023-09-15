import React from 'react';
import {
  redis,
  SourceChapter,
  getMongooseConnection,
} from '@mangayomu/backend';
import { ISourceChapterSchema } from '@mangayomu/schemas';
const getSourceChapter = React.cache(
  (pathName: string): Promise<ISourceChapterSchema | null> => {
    return new Promise((res, rej) => {
      redis.get(pathName).then((cached) => {
        if (cached == null) {
          const { connect, close } = getMongooseConnection();
          connect().then(() => {
            SourceChapter.findById(pathName).then((value) => {
              if (value == null) rej();
              else
                Promise.all([
                  redis.setex(pathName, 300, JSON.stringify(value.toJSON())),
                  close,
                ]).then(() => res(value.toObject()));
            });
          });
        } else res(JSON.parse(cached));
      });
    });
  },
);

export default getSourceChapter;
