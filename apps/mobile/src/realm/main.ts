import { ChapterSchema } from '@database/schemas/Chapter';
import { createRealmContext } from '@realm/react';
import {
  MangaSchema,
  MangaRatingSchema,
  MangaStatusSchema,
} from './schemas/Manga';

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [MangaSchema, ChapterSchema, MangaRatingSchema, MangaStatusSchema],
    schemaVersion: 16,
  });
