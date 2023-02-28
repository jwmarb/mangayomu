import Realm from 'realm';
import { REACT_APP_REALM_ID } from '@env';
import { createRealmContext } from '@realm/react';
import {
  MangaRatingSchema,
  MangaSchema,
  MangaStatusSchema,
} from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
export * from './providers/UserProvider';
// export * from './providers/RealmProvider';
export const { RealmProvider, useObject, useQuery, useRealm } =
  createRealmContext({
    schema: [MangaSchema, ChapterSchema, MangaRatingSchema, MangaStatusSchema],
    schemaVersion: 36,
  });

export const app = new Realm.App({ id: REACT_APP_REALM_ID });

export const { currentUser } = app;
