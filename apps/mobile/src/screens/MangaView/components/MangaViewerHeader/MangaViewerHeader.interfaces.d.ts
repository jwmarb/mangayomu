import { NavStyles } from '@components/NavHeader';
import { IMangaSchema, FetchMangaMetaStatus } from '@database/schemas/Manga';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export interface MangaViewerHeaderProps extends React.PropsWithChildren {
  meta?: IMangaSchema;
  manga: Manga;
  status: FetchMangaMetaStatus;
  error: string;
  refresh: () => void;
  scrollViewStyle: typeof NavStyles.offset;
  onBookmark: () => void;
}

export interface MangaMetaProperty<TProperty extends keyof IMangaSchema> {
  data: IMangaSchema[TProperty] | undefined;
  loading?: boolean;
}
