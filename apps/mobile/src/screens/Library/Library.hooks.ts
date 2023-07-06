import { useQuery, useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import displayMessage from '@helpers/displayMessage';
import integrateSortedList from '@helpers/integrateSortedList';
import useMountedEffect from '@hooks/useMountedEffect';
import { MangaHost } from '@mangayomu/mangascraper';
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
  const isFocused = useIsFocused();
  const realm = useRealm();
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
      if (ignoreGenres.size > 0) {
        for (const genre of ignoreGenres) {
          if (
            source.getGenre(genre) != null &&
            manga.genres.has(source.getGenre(genre))
          )
            return false;
        }
      }
      if (requireGenres.size > 0) {
        for (const genre of requireGenres) {
          if (source.getGenre(genre) == null) return false;
          else if (!manga.genres.has(source.getGenre(genre))) return false;
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
            const meta = await host.getMeta({
              imageCover: manga.imageCover,
              link: manga._id,
              source: manga.source,
              title: manga.title,
            });
            if (meta.chapters.length !== manga.chapters.length) {
              numberOfUpdates++;
              realm.write(() => {
                realm.create<MangaSchema>(
                  MangaSchema,
                  {
                    _id: meta.link,
                    _realmId: currentUser?.id,
                    notifyNewChaptersCount:
                      manga.notifyNewChaptersCount +
                      (meta.chapters.length - manga.chapters.length),
                    description: meta.description,
                    genres: meta.genres as unknown as Set<string>,
                    imageCover: meta.imageCover,
                    source: meta.source,
                    title: meta.title,
                    chapters: meta.chapters.map((x) => x.link),
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
