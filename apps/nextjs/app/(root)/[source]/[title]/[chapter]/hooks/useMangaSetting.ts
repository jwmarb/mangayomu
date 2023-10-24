import { useManga } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import { useUser } from '@app/context/realm';
import useObject from '@app/hooks/useObject';
import MangaSchema from '@app/realm/Manga';
import { IMangaSchema } from '@mangayomu/schemas';
import React from 'react';

export default function useMangaSetting<
  T extends
    | 'readerDirection'
    | 'readerImageScaling'
    | 'readerZoomStartPosition',
>(
  setting: T,
  options: Record<string, Exclude<IMangaSchema[T], 'Use global setting'>>,
): [
  IMangaSchema[T],
  (val: IMangaSchema[T]) => void,
  Record<string, IMangaSchema[T]>,
] {
  const manga = useManga();
  const userManga = useObject(MangaSchema, { link: manga.link });
  const setSetting = React.useCallback(
    (val: IMangaSchema[T]) => {
      userManga.update(
        (draft) => {
          draft[setting] = val;
        },
        { upsert: true },
      );
    },
    [setting, userManga],
  );
  return [
    (userManga[setting] as IMangaSchema[T]) ?? 'Use global setting',
    setSetting,
    {
      ...options,
      'Use global setting': 'Use global setting',
    },
  ];
}
