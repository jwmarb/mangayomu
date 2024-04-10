import React from 'react';
import { Manga, MangaMeta } from '@mangayomu/mangascraper';
import { ChapterSortOption } from '@/models/schema';
import { HASH_BIT_SHIFT } from '@/screens/MangaView';
import useSorted from '@/screens/MangaView/hooks/useSorted';
import useSortOptions from '@/screens/MangaView/hooks/useSortOptions';

function hash(sort: ChapterSortOption, reversed: boolean) {
  return sort.valueOf() | (reversed ? HASH_BIT_SHIFT : 0);
}

export default function useChapters(manga: Manga, data?: MangaMeta) {
  const { sortChaptersBy, sortIsReversed, setNumOfChapters, numOfChapters } =
    useSortOptions(manga);

  const [cached, isLoading] = useSorted(manga, data);

  const chapters = React.useMemo(
    () =>
      (cached[hash(sortChaptersBy, sortIsReversed)] ?? []).slice(
        0,
        numOfChapters,
      ),
    [numOfChapters, cached],
  );

  const onEndReached = React.useCallback(() => {
    setNumOfChapters((prev) => {
      if (data != null && prev < data.chapters.length) {
        return prev << 1;
      }
      return prev;
    });
  }, [setNumOfChapters, data?.chapters.length]);

  return {
    onEndReached,
    chapters,
    isLoading,
  };
}
