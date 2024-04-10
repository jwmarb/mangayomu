import React from 'react';
import { Manga } from '@mangayomu/mangascraper';
import useLocalManga from '@/hooks/useLocalManga';
import { ChapterSortOption } from '@/models/schema';
import { INITIAL_CHAPTERS_BATCH } from '@/screens/MangaView';

export default function useSortOptions(manga: Manga) {
  const [numOfChapters, setNumOfChapters] = React.useState<number>(
    INITIAL_CHAPTERS_BATCH,
  );
  const sortChaptersBy = useLocalManga(
    manga,
    (select) => select.sortChaptersBy,
    {
      onUpdate() {
        setNumOfChapters(INITIAL_CHAPTERS_BATCH);
      },
      default: ChapterSortOption.CHAPTER_NUMBER,
    },
  );
  const sortReversed = useLocalManga(manga, (select) => select.isSortReversed, {
    default: false,
  });

  // The reason we need to defer these is because sorting is an expensive operation
  // Sorting and reversing large lists will delay the main thread
  const deferredSortChaptersBy = React.useDeferredValue(sortChaptersBy);
  const deferredSortReversed = React.useDeferredValue(sortReversed);

  return {
    sortChaptersBy: deferredSortChaptersBy,
    sortIsReversed: deferredSortReversed,
    setNumOfChapters,
    numOfChapters,
  } as const;
}
