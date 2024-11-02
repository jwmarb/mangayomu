import React from 'react';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';

import {
  CHAPTER_SORT_OPTIONS,
  ChapterSortOption,
  sortOptionComparators,
} from '@/models/schema';
import useMangaSource from '@/hooks/useMangaSource';
import { HASH_BIT_SHIFT } from '@/screens/MangaView';
import useBoolean from '@/hooks/useBoolean';

function reverseCopy<T>(arr: ArrayLike<T>) {
  'worklet';
  const reversed = new Array<T>(arr.length),
    n = arr.length - 1;
  for (let i = 0; i <= n; i++) {
    reversed[i] = arr[n - i];
  }
  return reversed;
}

export default function useSorted(
  manga: Manga,
  data?: MangaMeta,
  unparsedData?: unknown,
) {
  const source = useMangaSource({ manga });
  const memo = React.useRef<Record<number, unknown[]>>({});
  const [isBusySorting, toggle] = useBoolean(true);
  const onFinishCreatingSorts = () => {
    toggle(false);
  };

  React.useEffect(() => {
    if (data == null || unparsedData == null) return;

    const dummyCopy = [...data.chapters];

    for (const key of CHAPTER_SORT_OPTIONS) {
      switch (key) {
        case ChapterSortOption.CHAPTER_NUMBER:
          memo.current[ChapterSortOption.CHAPTER_NUMBER] = data.chapters;
          memo.current[ChapterSortOption.CHAPTER_NUMBER | HASH_BIT_SHIFT] =
            reverseCopy(data.chapters);
          break;
        default: {
          const compare = sortOptionComparators[key];
          const sorted = dummyCopy.sort((a, b) => {
            const chapterA = source.toChapter(a, unparsedData) as MangaChapter;
            const chapterB = source.toChapter(b, unparsedData) as MangaChapter;
            return compare(chapterA, chapterB);
          });
          memo.current[key] = sorted;
          memo.current[key | HASH_BIT_SHIFT] = reverseCopy(sorted);
          break;
        }
      }
    }

    onFinishCreatingSorts();
  }, [data != null, unparsedData != null]);

  return [memo.current, isBusySorting] as const;
}
