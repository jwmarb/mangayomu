import {
  useCurrentChapterContext,
  usePageBoundaries,
  useReaderFlatListRef,
} from '@/screens/Reader/context';
import React from 'react';

export default function useScrollToPage() {
  const flatListRef = useReaderFlatListRef();
  const boundaries = usePageBoundaries();
  const currentChapter = useCurrentChapterContext();

  return {
    goToPage: React.useCallback(
      (page: number) => {
        const [min, max] = boundaries.current[currentChapter.link];
        flatListRef.current?.scrollToIndex({
          animated: false,
          index: Math.min(Math.max(min, min + page), max),
        });
      },
      [currentChapter.link],
    ),
    goToFirstPage: React.useCallback(() => {
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: boundaries.current[currentChapter.link][0],
      });
    }, [currentChapter.link]),
    goToLastPage: React.useCallback(() => {
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: boundaries.current[currentChapter.link][1],
      });
    }, [currentChapter.link]),
  };
}
