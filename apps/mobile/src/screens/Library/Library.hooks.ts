import { useLocalRealm, useQuery, useRealm } from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import useLocalManga from '@database/schemas/LocalManga/useLocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import displayMessage from '@helpers/displayMessage';
import integrateSortedList from '@helpers/integrateSortedList';
import useAppSelector from '@hooks/useAppSelector';
import useMountedEffect from '@hooks/useMountedEffect';
import { MangaMultilingualChapter } from '@mangayomu/mangascraper';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { useIsFocused } from '@react-navigation/native';
import { useUser } from '@realm/react';
import { SORT_LIBRARY_BY } from '@redux/slices/library';
import { FilterState } from '@redux/slices/mainSourceSelector';
import {
  useLibraryRefreshing,
  useLibrarySetRefreshing,
} from '@screens/Library';
import { inPlaceSort } from 'fast-sort';
import pLimit from 'p-limit';
const limit = pLimit(1);
import React, { useTransition } from 'react';
import Realm from 'realm';

export function useLibraryData() {
  const refreshing = useLibraryRefreshing();
  const setRefreshing = useLibrarySetRefreshing();
  const filters = useAppSelector((state) => state.library.filters);
  const sortBy = useAppSelector((state) => state.library.sortBy);
  const reversed = useAppSelector((state) => state.library.reversed);
  const [isLoading, setTransition] = useTransition();
  const mangasInLibrary = useQuery(MangaSchema, (collection) =>
    collection.filtered('inLibrary == true'),
  );
  const { getLocalManga } = useLocalManga();
  // React.useEffect(() => {
  //   user
  //     .mongoClient('mongodb-atlas')
  //     .db('mangayomu')
  //     .collection('Manga')
  //     .aggregate([{ $match: { _realmId: user.id, inLibrary: true } }])
  //     .then(console.log);
  // }, []);
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
      const localManga = getLocalManga(manga.link);
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
    if (sortBy === 'Number of updates') {
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
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (changes) => {
      setSortedData(
        inPlaceSort(changes.filter(applyFilters)).by(
          reversed
            ? { desc: SORT_LIBRARY_BY[sortBy] }
            : { asc: SORT_LIBRARY_BY[sortBy] },
        ),
      );
    };
    mangasInLibrary.addListener(callback);
    return () => {
      mangasInLibrary.removeListener(callback);
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      if (refreshing) {
        displayMessage('Fetching updates...');
        let numberOfUpdates = 0;
        const updates = mangasInLibrary.map((manga) =>
          limit(async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const host = MangaHost.sourcesMap.get(manga.source)!;
            const localManga = getLocalManga(manga.link);
            const meta = await host.getMeta({
              link: manga.link,
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
                    _id: manga._id,
                    link: meta.link,
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
              if (sortBy === 'Number of updates')
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
