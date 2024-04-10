import React from 'react';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import {
  useRunInJS,
  useSharedValue,
  useWorklet,
} from 'react-native-worklets-core';
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

export default function useSorted(manga: Manga, data?: MangaMeta) {
  const source = useMangaSource({ manga });

  const toChapter = useRunInJS<
    MangaChapter,
    [unknown, unknown],
    typeof source.toChapter
  >((tchapter, tmangameta) => source.toChapter(tchapter, tmangameta), [source]);
  const memo = useSharedValue<Record<number, unknown[]>>({});
  const [jsMemo, setJSMemo] = React.useState<Record<number, unknown[]>>({});
  const [isBusySorting, toggle] = useBoolean(true);
  const onFinishCreatingSorts = useRunInJS(() => {
    toggle(false);
    setJSMemo(() => {
      const newJSMemo: typeof jsMemo = {};
      for (const key in memo.value) {
        newJSMemo[key] = Array.from(memo.value[key]);
      }
      return newJSMemo;
    });
  }, []);

  const worklet = useWorklet(
    'default',
    async () => {
      'worklet';
      if (data == null) return;
      const copy = [...data.chapters]; // copy onto this thread
      const map: Map<unknown, MangaChapter> = new Map();
      await Promise.all(
        copy.map((_, i) =>
          toChapter(copy[i], data).then((x) => {
            map.set(copy[i], x);
          }),
        ),
      );

      // console.log(map.get(data.chapters[0]));
      // toChapter(data?.chapters[0]).then(console.log);
      for (const key of CHAPTER_SORT_OPTIONS) {
        switch (key) {
          case ChapterSortOption.CHAPTER_NUMBER:
            memo.value[ChapterSortOption.CHAPTER_NUMBER] = copy;
            memo.value[ChapterSortOption.CHAPTER_NUMBER | HASH_BIT_SHIFT] =
              reverseCopy(copy);
            break;
          default: {
            const op = sortOptionComparators[key];
            const sorted = [...copy].sort((a, b) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              op(map.get(a)!, map.get(b)!),
            );
            memo.value[key] = sorted;
            memo.value[key | HASH_BIT_SHIFT] = reverseCopy(sorted);
          }
        }
      }

      onFinishCreatingSorts();
    },
    [data != null],
  );

  React.useEffect(() => {
    worklet();
  }, [data != null]);

  return [jsMemo, isBusySorting] as const;
}
