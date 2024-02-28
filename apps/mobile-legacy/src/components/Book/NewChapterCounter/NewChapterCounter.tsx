import React from 'react';
import Realm from 'realm';
import type { NewChapterCounterProps } from './';
import { MangaSchema } from '@database/schemas/Manga';
import Badge, { BadgeLocation } from '@components/Badge';

export default function NewChapterCounter(
  props: React.PropsWithChildren<NewChapterCounterProps>,
) {
  const { manga, children } = props;
  const dbManga =
    '_id' in manga
      ? (manga as unknown as MangaSchema & Realm.Object<MangaSchema>)
      : null;
  return (
    <Badge
      type="number"
      count={dbManga?.notifyNewChaptersCount ?? 0}
      placement={BadgeLocation.TOP_LEFT}
      color="primary"
    >
      {children}
    </Badge>
  );
}
