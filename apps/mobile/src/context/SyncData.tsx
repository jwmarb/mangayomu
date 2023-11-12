import {
  useLocalQuery,
  useLocalRealm,
  useQuery,
  useRealm,
} from '@database/main';
import { UserHistorySchema } from '@database/schemas/History';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import writeLocalChapters from '@database/schemas/Manga/writeChapters';
import writeManga from '@database/schemas/Manga/writeManga';
import { getErrorMessage } from '@helpers/getErrorMessage';
import getMangaHostFromLink from '@helpers/getMangaHostFromLink';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import React from 'react';
import { InteractionManager } from 'react-native';
import pLimit from 'p-limit';
const limit = pLimit(1);

const IsLibrarySyncedContext = React.createContext<boolean | undefined>(
  undefined,
);
const IsHistorySyncedContext = React.createContext<boolean | undefined>(
  undefined,
);
const SyncingMangaCountContext = React.createContext<number | undefined>(
  undefined,
);
const SyncingHistoryCountContext = React.createContext<number | undefined>(
  undefined,
);
const SyncingHistoryErrorContext = React.createContext<string | undefined>(
  undefined,
);
const SyncErrorContext = React.createContext<string | undefined>(undefined);

export const useIsLibrarySynced = () => {
  const isSynced = React.useContext(IsLibrarySyncedContext);
  const syncing = React.useContext(SyncingMangaCountContext);
  const error = React.useContext(SyncErrorContext);
  const mangas = useQuery(MangaSchema, (collection) =>
    collection.filtered('inLibrary == true'),
  );

  return {
    isSynced,
    syncing,
    total: mangas.length,
    error,
  };
};

export const useIsHistorySynced = () => {
  const syncing = React.useContext(SyncingHistoryCountContext);
  const isSynced = React.useContext(IsHistorySyncedContext);
  const error = React.useContext(SyncingHistoryErrorContext);

  return {
    isSynced,
    syncing,
    error,
  };
};

const SyncData: React.FC<React.PropsWithChildren> = ({ children }) => {
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const mangas = useQuery(MangaSchema, (collection) =>
    collection.filtered('inLibrary == true'),
  );
  const history = useQuery(UserHistorySchema);
  const localMangas = useLocalQuery(LocalMangaSchema);
  const user = useUser();
  const [syncedMangaCount, setSyncedMangaCount] = React.useState<number>(0);
  const [syncedHistoryCount, setSyncedHistoryCount] = React.useState<number>(0);
  const [syncHistoryError, setSyncHistoryError] = React.useState<string>('');
  const [syncError, setSyncError] = React.useState<string>('');
  const mangaDataIsStale = React.useMemo(() => {
    for (let i = 0; i < mangas.length; i++) {
      const obj = localRealm.objectForPrimaryKey(
        LocalMangaSchema,
        mangas[i].link,
      );
      if (obj == null) return true;
    }
    return false;
  }, [localMangas, mangas]);

  const mangaHistoryDataIsStale = React.useMemo(() => {
    for (let i = 0; i < history.length; i++) {
      const obj = localRealm.objectForPrimaryKey(
        LocalMangaSchema,
        history[i].manga,
      );
      if (obj == null) return true;
    }
    return false;
  }, [localMangas, history]);

  React.useEffect(() => {
    if (mangaDataIsStale) {
      console.log(
        'Library data is stale. Syncing local mangas with cloud mangas...',
      );
      const controller = new AbortController();
      InteractionManager.runAfterInteractions(() =>
        limit(async () => {
          const syncCollection = mangas.map(async (manga) => {
            const localManga = localRealm.objectForPrimaryKey(
              LocalMangaSchema,
              manga.link,
            );
            if (localManga == null) {
              const source = MangaHost.sourcesMap.get(manga.source);
              if (source == null)
                throw new Error(`${source} as a source does not exist`);
              source.signal = controller.signal;
              try {
                console.log(`Fetching data for ${manga._id}`);
                const meta = await source.getMeta({
                  link: manga.link,
                });
                const { chapters, availableLanguages } = writeLocalChapters(
                  localRealm,
                  meta,
                  user,
                );
                writeManga(
                  localRealm,
                  realm,
                  meta,
                  chapters,
                  availableLanguages,
                  user,
                );
              } catch (e) {
                console.error(e);
              }
            }
            setSyncedMangaCount((prev) => prev + 1);
          });
          try {
            await Promise.all(syncCollection);
          } catch (e) {
            console.error(e);
            setSyncError(getErrorMessage(e));
          } finally {
            console.log('Done syncing collection');
          }
        }),
      );
      return () => {
        controller.abort();
      };
    }
  }, [mangaDataIsStale]);

  React.useEffect(() => {
    if (mangaHistoryDataIsStale) {
      const controller = new AbortController();
      console.log(
        'User history is stale. Syncing local mangas with user history...',
      );
      InteractionManager.runAfterInteractions(() =>
        limit(async () => {
          const syncing = new Set<string>();
          const syncCollection = await Promise.allSettled(
            history.map(async (entry) => {
              if (
                !syncing.has(entry.manga) &&
                localRealm.objectForPrimaryKey(LocalMangaSchema, entry.manga) ==
                  null
              ) {
                console.log(`Fetching for user history: ${entry.manga}`);
                syncing.add(entry.manga);
                const source = getMangaHostFromLink(entry.manga);
                if (source == null)
                  throw new Error(`Invalid source from manga ${entry.manga}`);
                try {
                  const meta = await source.getMeta({ link: entry.manga });
                  const { chapters, availableLanguages } = writeLocalChapters(
                    localRealm,
                    meta,
                    user,
                  );
                  writeManga(
                    localRealm,
                    realm,
                    meta,
                    chapters,
                    availableLanguages,
                    user,
                  );
                  setSyncedHistoryCount((prev) => prev + 1);
                  return {
                    success: true,
                  };
                } catch (e) {
                  return {
                    success: false,
                    entry,
                  };
                }
              }
            }),
          );
          realm.write(() => {
            for (const settledResult of syncCollection) {
              if (settledResult.status === 'rejected')
                realm.delete(settledResult.reason.entry);
            }
          });
        }),
      );
      return () => {
        controller.abort();
      };
    }
  }, [mangaHistoryDataIsStale]);

  return (
    <IsLibrarySyncedContext.Provider value={!mangaDataIsStale}>
      <SyncingMangaCountContext.Provider value={syncedMangaCount}>
        <SyncErrorContext.Provider value={syncError}>
          <SyncingHistoryCountContext.Provider value={syncedHistoryCount}>
            <SyncingHistoryErrorContext.Provider value={syncHistoryError}>
              <IsHistorySyncedContext.Provider value={!mangaHistoryDataIsStale}>
                {children}
              </IsHistorySyncedContext.Provider>
            </SyncingHistoryErrorContext.Provider>
          </SyncingHistoryCountContext.Provider>
        </SyncErrorContext.Provider>
      </SyncingMangaCountContext.Provider>
    </IsLibrarySyncedContext.Provider>
  );
};

export default SyncData;
