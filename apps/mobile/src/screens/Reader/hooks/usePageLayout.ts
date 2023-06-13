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
  const pagesRef = React.useRef<Page[]>(pages);
  const readingDirectionRef = React.useRef<ReadingDirection>(readingDirection);
  React.useEffect(() => {
    readingDirectionRef.current = readingDirection;
  }, [readingDirection]);
  React.useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const getPageOffset = (page: Page) => {
    const { width, height } = Dimensions.get('screen');
    switch (readingDirectionRef.current) {
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
    if (pagesRef.current.length === 0) return [0, 0];

    const x = chapterIndices.get(chapterKey);
    if (x != null) {
      const { start, end } = x;
      const { width, height } = Dimensions.get('screen');
      let minAccumulator = 0;
      let maxAccumulator = 0;
      switch (readingDirectionRef.current) {
        case ReadingDirection.WEBTOON: {
          const memo = offsetMemo.get(chapterKey);
          if (memo != null) {
            minAccumulator = memo.min;
            maxAccumulator = memo.max;
          } else {
            for (let i = 0; i < pagesRef.current.length; i++) {
              // precondition: start + pageNumber < end
              if (i < start)
                minAccumulator += getPageOffset(pagesRef.current[i]);
              if (i < end) maxAccumulator += getPageOffset(pagesRef.current[i]);
              if (i === end)
                maxAccumulator -= height - getPageOffset(pagesRef.current[i]);
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
