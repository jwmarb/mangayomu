import React from 'react';
import { redis, SourceManga, getMongooseConnection } from '@mangayomu/backend';
import { ISourceMangaSchema } from '@mangayomu/schemas';
const getSourceManga = React.cache(
  async (pathName: string): Promise<ISourceMangaSchema | null> => {
    const cached = await redis.get(pathName);
    if (cached == null) {
      const { connect, close } = getMongooseConnection();
      await connect();
      const value = await SourceManga.findById(pathName);
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

export default getSourceManga;
