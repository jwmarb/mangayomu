import useAppSelector from '@hooks/useAppSelector';
import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { Page, chapterIndices, offsetMemo } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import React from 'react';
import { Dimensions, FlatListProps } from 'react-native';

export default function usePageLayout(args: {
  readingDirection: ReadingDirection;
  chapterKey: string;
}) {
  const { readingDirection, chapterKey } = args;
  const pages = useAppSelector((state) => state.reader.pages);
  const chapterKeyRef = useMutableObject(chapterKey);
  const { width, height } = useScreenDimensions();
  const pagesRef = useMutableObject(pages);
  const readingDirectionRef = useMutableObject(readingDirection);

  const getItemLayout: FlatListProps<Page>['getItemLayout'] = (data, index) => {
    if (data == null)
      return {
        index,
        length: 0,
        offset: 0,
      };
    return {
      index,
      length: getPageOffset(data[index]),
      offset: getPageOffsetFromOrigin(data, index),
    };
  };

  const getPageOffsetFromOrigin = (data: ArrayLike<Page>, index: number) => {
    const { width, height } = Dimensions.get('screen');
    switch (readingDirectionRef.current) {
      case ReadingDirection.WEBTOON: {
        let offset = 0;
        for (let i = 0; i < index; i++) {
          offset += getPageOffset(data[i]);
        }
        return offset;
      }
      case ReadingDirection.LEFT_TO_RIGHT:
      case ReadingDirection.RIGHT_TO_LEFT:
        return width * index;
      case ReadingDirection.VERTICAL:
        return height * index;
    }
  };

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

    const x = chapterIndices.get(chapterKeyRef.current);
    if (x != null) {
      const { start, end } = x;
      const { width, height } = Dimensions.get('screen');
      let minAccumulator = 0;
      let maxAccumulator = 0;
      switch (readingDirectionRef.current) {
        case ReadingDirection.WEBTOON: {
          const memo = offsetMemo.get(chapterKeyRef.current);
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
            offsetMemo.set(chapterKeyRef.current, {
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
    getItemLayout,
    getPageOffsetFromOrigin,
  };
}
