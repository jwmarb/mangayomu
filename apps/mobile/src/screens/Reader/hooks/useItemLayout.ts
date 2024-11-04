import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { Data } from '@/screens/Reader/Reader';
import { ReadingDirection } from '@/models/schema';

export default function useItemLayout(readingDirection: ReadingDirection) {
  const getPageOffset = React.useCallback(
    (page: Data) => {
      const { width, height } = Dimensions.get('window');
      switch (readingDirection) {
        case ReadingDirection.GLOBAL:
          return 0;
        case ReadingDirection.LEFT_TO_RIGHT:
        case ReadingDirection.RIGHT_TO_LEFT:
          return width;
        case ReadingDirection.VERTICAL:
          return height;
        case ReadingDirection.WEBTOON:
          switch (page.type) {
            case 'NO_MORE_CHAPTERS':
            case 'CHAPTER_DIVIDER':
              return height;
            case 'PAGE':
              return page.source.height * (width / page.source.width);
          }
      }
    },
    [readingDirection],
  );

  const getPageOffsetFromOrigin = React.useCallback(
    (data: ArrayLike<Data>, index: number) => {
      const { width, height } = Dimensions.get('window');
      switch (readingDirection) {
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
        case ReadingDirection.GLOBAL:
          return 0;
      }
    },
    [readingDirection],
  );

  const getItemLayout = React.useCallback(
    (pages: ArrayLike<Data> | null | undefined, index: number) => {
      if (pages == null)
        return {
          index,
          length: 0,
          offset: 0,
        };
      return {
        index,
        length: getPageOffset(pages[index]),
        offset: getPageOffsetFromOrigin(pages, index),
      };
    },
    [getPageOffset, getPageOffsetFromOrigin],
  );

  return { getItemLayout };
}
