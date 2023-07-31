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
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
export * from './providers/UserProvider';
export const { useObject, useQuery, useRealm, RealmProvider } =
  createRealmContext({
    schema: [
      MangaSchema,
      MangaReadingChapter,
      UserHistorySchema,
      HistorySectionSchema,
      MangaHistorySchema,
      BaseMangaChapterSchema,
      BaseMangaSchema,
      ChapterSchema,
    ],
    schemaVersion: 53,
  });

export const {
  RealmProvider: LocalRealmProvider,
  useObject: useLocalObject,
  useQuery: useLocalQuery,
  useRealm: useLocalRealm,
} = createRealmContext({
  schema: [
    LocalChapterSchema,
    PageSchema,
    LocalMangaSchema,
    MangaRatingSchema,
    MangaStatusSchema,
  ],
  schemaVersion: 18,
  path: Realm.defaultPath.replace('default.realm', 'local.realm'),
});
