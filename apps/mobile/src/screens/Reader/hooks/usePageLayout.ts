import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { Page, chapterIndices, offsetMemo } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import React from 'react';
import { Dimensions } from 'react-native';

export default function usePageLayout(args: {
  readingDirection: ReadingDirection;
  pages: Page[];
  chapterKey: string;
}) {
  const { readingDirection, pages, chapterKey } = args;
  const { width, height } = useScreenDimensions();
  const pagesRef = useMutableObject(pages);
  const readingDirectionRef = useMutableObject(readingDirection);

  const getPageOffset = (page: Page) => {
    const { width, height } = Dimensions.get('screen');
    switch (readingDirectionRef) {
      case ReadingDirection.LEFT_TO_RIGHT:
      case ReadingDirection.RIGHT_TO_LEFT:
        return width;
      case ReadingDirection.VERTICAL:
        return height;
      case ReadingDirection.WEBTOON:
        switch (page.type) {
          case 'NO_MORE_PAGES':
          case 'TRANSITION_PAGE':
          case 'CHAPTER_ERROR':
            return height;
          case 'PAGE':
            return page.height * (width / page.width);
        }
    }
  };

  const getSafeScrollRange = (): [number, number] => {
    if (pagesRef.length === 0) return [0, 0];

    const x = chapterIndices.get(chapterKey);
    if (x != null) {
      const { start, end } = x;
      const { width, height } = Dimensions.get('screen');
      let minAccumulator = 0;
      let maxAccumulator = 0;
      switch (readingDirectionRef) {
        case ReadingDirection.WEBTOON: {
          const memo = offsetMemo.get(chapterKey);
          if (memo != null) {
            minAccumulator = memo.min;
            maxAccumulator = memo.max;
          } else {
            for (let i = 0; i < pagesRef.length; i++) {
              // precondition: start + pageNumber < end
              if (i < start) minAccumulator += getPageOffset(pagesRef[i]);
              if (i < end) maxAccumulator += getPageOffset(pagesRef[i]);
              if (i === end)
                maxAccumulator -= height - getPageOffset(pagesRef[i]);
            }
            offsetMemo.set(chapterKey, {
              min: minAccumulator,
              max: maxAccumulator,
            });
          }
          break;
        }
        case ReadingDirection.VERTICAL:
          minAccumulator = height * start;
          maxAccumulator = height * end;
          break;
        case ReadingDirection.LEFT_TO_RIGHT:
        case ReadingDirection.RIGHT_TO_LEFT:
          minAccumulator = width * start;
          maxAccumulator = width * end;
          break;
      }
      return [minAccumulator, maxAccumulator];
    }

    return [0, 0];
  };

  const estimatedItemSize =
    readingDirection === ReadingDirection.LEFT_TO_RIGHT ||
    readingDirection === ReadingDirection.RIGHT_TO_LEFT
      ? width
      : height;
  return {
    getPageOffset,
    estimatedItemSize,
    getSafeScrollRange,
  };
}
