import React from 'react';
import {
  redis,
  SourceChapter,
  getMongooseConnection,
} from '@mangayomu/backend';
import { ISourceChapterSchema } from '@mangayomu/schemas';
const getSourceChapter = React.cache(
  async (pathName: string): Promise<ISourceChapterSchema | null> => {
    const cached = await redis.get(pathName);
    if (cached == null) {
      const { connect, close } = getMongooseConnection();
      await connect();
      const value = await SourceChapter.findById(pathName);
      if (value == null) return null;
      await Promise.all([
        redis.setex(pathName, 300, JSON.stringify(value.toJSON())),
        close,
      ]);
      return value.toObject();
    }

    return JSON.parse(cached);
  },
);

export default getSourceChapter;
