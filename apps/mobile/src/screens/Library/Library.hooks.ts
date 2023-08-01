import {
  useLocalQuery,
  useLocalRealm,
  useQuery,
  useRealm,
} from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useLocalManga from '@database/schemas/LocalManga/useLocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import writeLocalChapters from '@database/schemas/Manga/writeChapters';
import writeManga from '@database/schemas/Manga/writeManga';
import displayMessage from '@helpers/displayMessage';
import { getErrorMessage } from '@helpers/getErrorMessage';
import integrateSortedList from '@helpers/integrateSortedList';
import useMountedEffect from '@hooks/useMountedEffect';
import { MangaMultilingualChapter } from '@mangayomu/mangascraper';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { useIsFocused } from '@react-navigation/native';
import { useUser } from '@realm/react';
import { LibrarySortOption, SORT_LIBRARY_BY } from '@redux/slices/library';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { inPlaceSort } from 'fast-sort';
import pLimit from 'p-limit';
const limit = pLimit(1);
import React, { useTransition } from 'react';

export function useLibraryData(args: {
  filters: {
    Sources: Record<string, boolean>;
    Genres: Record<string, FilterState>;
  };
  reversed: boolean;
  sortBy: LibrarySortOption;
  query: string;
  refreshing: boolean;
  setRefreshing: (val: boolean) => void;
}) {
  const { filters, reversed, sortBy, query, refreshing, setRefreshing } = args;
  const [isLoading, setTransition] = useTransition();
  const mangas = useQuery(MangaSchema);
  const mangasInLibrary = mangas.filtered('inLibrary == true');
  const { getLocalManga } = useLocalManga();
  const isFocused = useIsFocused();
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const currentUser = useUser();
  const applyFilters = React.useMemo(() => {
    const ignoreGenres = new Set<string>();
    const requireGenres = new Set<string>();
    for (const x in filters.Genres) {
      switch (filters.Genres[x]) {
        case FilterState.EXCLUDE:
          ignoreGenres.add(x);
          break;
        case FilterState.INCLUDE:
          requireGenres.add(x);
      }
    }
    return (manga: MangaSchema) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const source = MangaHost.sourcesMap.get(manga.source)!;
      const localManga = getLocalManga(manga._id);
      if (ignoreGenres.size > 0) {
        for (const genre of ignoreGenres) {
          if (
            source.getGenre(genre) != null &&
            localManga.genres.has(source.getGenre(genre))
          )
            return false;
        }
      }
      if (requireGenres.size > 0) {
        for (const genre of requireGenres) {
          if (source.getGenre(genre) == null) return false;
          else if (!localManga.genres.has(source.getGenre(genre))) return false;
        }
      }
      return filters.Sources[manga.source];
    };
  }, [filters.Genres, filters.Sources]);
  const [sortedData, setSortedData] = React.useState(() =>
    inPlaceSort(mangasInLibrary.filter(applyFilters)).by(
      reversed
        ? { desc: SORT_LIBRARY_BY[sortBy] }
        : { asc: SORT_LIBRARY_BY[sortBy] },
    ),
  );

  /**
   * Sorts unsorted mangas in response to changes
   */
  useMountedEffect(() => {
    setSortedData(
      inPlaceSort(mangasInLibrary.filter(applyFilters)).by(
        reversed
          ? { desc: SORT_LIBRARY_BY[sortBy] }
          : { asc: SORT_LIBRARY_BY[sortBy] },
      ),
    );
  }, [sortBy, reversed, mangasInLibrary.length, applyFilters]);

  /**
   * Sorts NEARLY/ALMOST sorted mangas
   */
  useMountedEffect(() => {
    if (
      sortBy === 'Number of available chapters (multilingual)' ||
      sortBy === 'Number of updates'
    ) {
      const copy = mangasInLibrary.filter(applyFilters);
      integrateSortedList(
        copy,
        (a, b) => SORT_LIBRARY_BY[sortBy](a) - SORT_LIBRARY_BY[sortBy](b),
      ).insertionSort(reversed);
      setSortedData(copy);
    }
  }, [isFocused]);

  const [data, setData] = React.useState(sortedData);
  useMountedEffect(() => {
    setData(sortedData);
  }, [sortedData]);

  function updateQuerifiedData(text: string) {
    setTransition(() => {
      setData(
        sortedData.filter((x) =>
          x.title.toLowerCase().includes(text.trim().toLowerCase()),
        ),
      );
    });
  }

  React.useEffect(() => {
    (async () => {
      if (refreshing) {
        displayMessage('Fetching updates...');
        let numberOfUpdates = 0;
        const updates = mangasInLibrary.map((manga) =>
          limit(async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const host = MangaHost.sourcesMap.get(manga.source)!;
            const localManga = getLocalManga(manga._id);
            const meta = await host.getMeta({
              imageCover: manga.imageCover,
              link: manga._id,
              source: manga.source,
              title: manga.title,
            });
            if (meta.chapters.length !== localManga.chapters.length) {
              numberOfUpdates++;
              const chapters: string[] = [];
              localRealm.write(() => {
                for (const chapter of meta.chapters) {
                  chapters.push(chapter.link);
                  localRealm.create(
                    LocalChapterSchema,
                    {
                      _id: chapter.link,
                      _mangaId: meta.link,
                      name: chapter.name,
                      index: chapter.index,
                      date: chapter.date,
                      language:
                        (chapter as Partial<MangaMultilingualChapter>)
                          ?.language ?? 'en',
                    },
                    Realm.UpdateMode.Modified,
                  );
                }
              });
              realm.write(() => {
                realm.create<MangaSchema>(
                  MangaSchema,
                  {
                    _id: meta.link,
                    _realmId: currentUser.id,
                    notifyNewChaptersCount:
                      manga.notifyNewChaptersCount +
                      (meta.chapters.length - localManga.chapters.length),
                    // description: meta.description,
                    // genres: meta.genres as unknown as Set<string>,
                    imageCover: meta.imageCover,
                    source: meta.source,
                    title: meta.title,
                    // chapters,
                  },
                  Realm.UpdateMode.Modified,
                );
              });
              if (
                sortBy === 'Number of updates' ||
                sortBy === 'Number of available chapters (multilingual)'
              )
                setData((prev) => {
                  integrateSortedList(
                    prev,
                    (a, b) =>
                      SORT_LIBRARY_BY[sortBy](a) - SORT_LIBRARY_BY[sortBy](b),
                  ).insertionSort();
                  return [...prev];
                });
            }
          }),
        );
        try {
          await Promise.all(updates);
        } finally {
          setRefreshing(false);
          if (numberOfUpdates > 0)
            displayMessage(
              `Successfully updated ${numberOfUpdates} manga${
                numberOfUpdates !== 1 ? 's' : ''
              }.`,
            );
          else displayMessage('No updates were found.');
        }
      }
    })();
  }, [refreshing]);

  return { data, mangasInLibrary, updateQuerifiedData };
}

export const useIsDataStale = () => {
  const localRealm = useLocalRealm();
  const realm = useRealm();
  const localMangas = useLocalQuery(LocalMangaSchema);
  const [mangas, setMangas] = React.useState<Realm.Results<MangaSchema>>(
    realm.objects(MangaSchema).filtered('inLibrary == true'),
  );
  const [syncedCount, setSyncedCount] = React.useState<number>(0);
  const [currentlySyncing, setCurrentlySyncing] = React.useState<string>('');
  const [syncError, setSyncError] = React.useState<string>('');
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (
      collection,
    ) => {
      setMangas(collection.filtered('inLibrary == true'));
    };
    const collection = realm.objects(MangaSchema).filtered('inLibrary == true');
    collection.addListener(callback);
    return () => {
      collection.removeListener(callback);
    };
  }, []);

  const dataIsStale = React.useMemo(() => {
    if (mangas.length > localMangas.length) return true;
    for (let i = 0; i < mangas.length; i++) {
      const obj = localRealm.objectForPrimaryKey(
        LocalMangaSchema,
        mangas[i]._id,
      );
      if (obj == null) return true;
    }
    return false;
  }, [mangas, localMangas]);

  React.useEffect(() => {
    if (dataIsStale) {
      (async () => {
        const syncCollection = mangas.map(async (manga) => {
          const localManga = localRealm.objectForPrimaryKey(
            LocalMangaSchema,
            manga._id,
          );
          if (localManga == null) {
            const source = MangaHost.sourcesMap.get(manga.source);
            if (source == null)
              throw new Error(`${source} as a source does not exist`);
            setCurrentlySyncing(manga._id);
            const meta = await source.getMeta({
              link: manga._id,
              imageCover: manga.imageCover,
              title: manga.title,
              source: manga.source,
            });
            const { chapters, availableLanguages } = writeLocalChapters(
              localRealm,
              meta,
            );
            writeManga(localRealm, realm, meta, chapters, availableLanguages);
          }
          setSyncedCount((prev) => prev + 1);
        });
        try {
          await Promise.all(syncCollection);
        } catch (e) {
          setSyncError(getErrorMessage(e));
        } finally {
          setCurrentlySyncing('');
        }
      })();
    }
  }, []);

  return {
    dataIsStale,
    syncing: {
      count: syncedCount,
      totalToSync: mangas.length,
      error: syncError,
      current: realm.objectForPrimaryKey(MangaSchema, currentlySyncing),
    },
  };
};
