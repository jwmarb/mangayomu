import { ChapterSchema } from '@database/schemas/Chapter';
import { createRealmContext } from '@realm/react';
import { MangaSchema, MangaRatingSchema } from './schemas/Manga';

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [MangaSchema, ChapterSchema, MangaRatingSchema],
    schemaVersion: 3,
  });
