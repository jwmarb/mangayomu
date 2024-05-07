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
import { UserHistorySchema } from '@database/schemas/History';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
export * from './providers/UserProvider';
export const { useObject, useQuery, useRealm, RealmProvider } =
  createRealmContext({
    schema: [
      MangaSchema,
      MangaReadingChapter,
      UserHistorySchema,
      ChapterSchema,
    ],
    schemaVersion: 0,
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
  schemaVersion: 21,
  path: Realm.defaultPath.replace('default.realm', 'local.realm'),
  onMigration: (oldRealm, newRealm) => {
    switch (oldRealm.schemaVersion) {
      case 19: {
        const newLocalChapterObjects = newRealm.objects(LocalChapterSchema);
        for (const idx in newLocalChapterObjects) {
          newLocalChapterObjects[idx].date = Date.parse(
            newLocalChapterObjects[idx].date as unknown as string,
          );
        }
        console.log('Migration complete');
        break;
      }
      case 20: {
        const newLocalChapterObjects = newRealm.objects(LocalChapterSchema);
        for (const idx in newLocalChapterObjects) {
          newLocalChapterObjects[idx].date = Number.isNaN(
            newLocalChapterObjects[idx].date,
          )
            ? Date.now()
            : newLocalChapterObjects[idx].date;
        }
        console.log('Migration complete');
        break;
      }
    }
  },
});
