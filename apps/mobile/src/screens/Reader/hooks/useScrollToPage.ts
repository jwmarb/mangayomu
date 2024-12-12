import { useReaderFlatListRef } from '@/screens/Reader/context';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import React from 'react';

/**
 * Provides functions to scroll to specific pages within a chapter in a reader application.
 *
 * @returns An object containing the following methods:
 *          - goToPage(page: number): Scrolls to the specified page number within the current chapter.
 *          - goToFirstPage(): Scrolls to the first page of the current chapter.
 *          - goToLastPage(): Scrolls to the last page of the current chapter.
 */
export default function useScrollToPage() {
  const flatListRef = useReaderFlatListRef();
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

  return {
    goToPage: React.useCallback(
      (page: number) => {
        if (currentChapter == null) return;
        const [min, max] = ExtraReaderInfo.getPageBoundaries(currentChapter);
        flatListRef.current?.scrollToIndex({
          animated: false,
          index: Math.min(Math.max(min, min + page), max),
        });
      },
      [currentChapter?.link],
    ),
    goToFirstPage: React.useCallback(() => {
      if (currentChapter == null) return;
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: ExtraReaderInfo.getPageBoundaries(currentChapter)[0],
      });
    }, [currentChapter?.link]),
    goToLastPage: React.useCallback(() => {
      if (currentChapter == null) return;
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: ExtraReaderInfo.getPageBoundaries(currentChapter)[1],
      });
    }, [currentChapter?.link]),
  };
}
