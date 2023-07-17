import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import {
  MangaRatingSchema,
  MangaReadingChapter,
  MangaSchema,
  MangaStatusSchema,
} from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
import { PageSchema } from '@database/schemas/Page';
import {
  UserHistorySchema,
  HistorySectionSchema,
  MangaHistorySchema,
  BaseMangaChapterSchema,
  BaseMangaSchema,
} from '@database/schemas/History';
export * from './providers/UserProvider';
export const { useObject, useQuery, useRealm, RealmProvider } =
  createRealmContext({
    schema: [
      MangaSchema,
      MangaRatingSchema,
      MangaStatusSchema,
      MangaReadingChapter,
      UserHistorySchema,
      HistorySectionSchema,
      MangaHistorySchema,
      BaseMangaChapterSchema,
      BaseMangaSchema,
      ChapterSchema,
    ],
    schemaVersion: 50,
  });

export const {
  RealmProvider: LocalRealmProvider,
  useObject: useLocalObject,
  useQuery: useLocalQuery,
  useRealm: useLocalRealm,
} = createRealmContext({
  schema: [PageSchema],
  schemaVersion: 10,
  path: Realm.defaultPath.replace('default.realm', 'local.realm'),
});
