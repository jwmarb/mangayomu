import {
  useCurrentChapterContext,
  useReaderFlatListRef,
} from '@/screens/Reader/context';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import React from 'react';

export default function useScrollToPage() {
  const flatListRef = useReaderFlatListRef();
  const currentChapter = useCurrentChapterContext();

  return {
    goToPage: React.useCallback(
      (page: number) => {
        const [min, max] = ExtraReaderInfo.getPageBoundaries(currentChapter);
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
        index: ExtraReaderInfo.getPageBoundaries(currentChapter)[0],
      });
    }, [currentChapter.link]),
    goToLastPage: React.useCallback(() => {
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: ExtraReaderInfo.getPageBoundaries(currentChapter)[1],
      });
    }, [currentChapter.link]),
  };
}
