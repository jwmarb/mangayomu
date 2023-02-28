import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import {
  MangaRatingSchema,
  MangaReadingChapter,
  MangaSchema,
  MangaStatusSchema,
} from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
export * from './providers/UserProvider';
// export * from './providers/RealmProvider';
export const { RealmProvider, useObject, useQuery, useRealm } =
  createRealmContext({
    schema: [
      MangaSchema,
      MangaRatingSchema,
      MangaStatusSchema,
      MangaReadingChapter,
    ],
    schemaVersion: 36,
  });

export const {
  RealmProvider: LocalRealmProvider,
  useObject: useLocalObject,
  useQuery: useLocalQuery,
  useRealm: useLocalRealm,
} = createRealmContext({
  schema: [ChapterSchema],
  schemaVersion: 0,
  path: Realm.defaultPath.replace('default.realm', 'local.realm'),
});
