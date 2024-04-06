import { MangaMeta, MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
import {
  BASE_CHAPTER_HEIGHT,
  CHAPTER_HEIGHT_EXTENDED,
} from '@/screens/MangaView/components/primitives/Chapter';

export default function useItemLayout(source: MangaSource, data?: MangaMeta) {
  const layoutSize = React.useRef<number>(0);

  const getItemLayout = React.useCallback(
    (
      element: ArrayLike<unknown> | null | undefined,
      index: number,
    ): {
      length: number;
      offset: number;
      index: number;
    } => {
      if (element == null)
        return {
          length: 0,
          offset: 0,
          index,
        };
      const length = source.toChapter(element[index], data).subname
        ? CHAPTER_HEIGHT_EXTENDED
        : BASE_CHAPTER_HEIGHT;
      const offset = layoutSize.current;
      layoutSize.current += length;
      return {
        length,
        offset,
        index,
      };
    },
    [data],
  );

  return getItemLayout;
}
