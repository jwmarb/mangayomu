import { NavStyles } from '@components/NavHeader';
import { IMangaSchema, FetchMangaMetaStatus } from '@database/schemas/Manga';
import { Manga } from '@mangayomu/mangascraper';
import Realm from 'realm';
import React from 'react';
import { ChapterSchema } from '@database/schemas/Chapter';

export interface MangaViewerHeaderProps extends React.PropsWithChildren {
  meta?: IMangaSchema;
  manga: Manga;
  status: FetchMangaMetaStatus;
  error: string;
  refresh: () => void;
  scrollViewStyle: typeof NavStyles.offset;
  onBookmark: () => void;
  queriedChaptersForManga: Realm.Results<
    ChapterSchema & Realm.Object<unknown, never>
  >;
}

export interface MangaMetaProperty<TProperty extends keyof IMangaSchema> {
  data: IMangaSchema[TProperty] | undefined;
  loading?: boolean;
}
