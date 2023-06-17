import {
  IMangaSchema,
  FetchMangaMetaStatus,
  useManga,
} from '@database/schemas/Manga';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export interface MangaViewerHeaderProps extends React.PropsWithChildren {
  meta?: ReturnType<typeof useManga>['manga'];
  manga: Manga;
  status: FetchMangaMetaStatus;
  error: string;
  refresh: () => void;
  scrollViewStyle: {
    readonly paddingTop: number;
  };
  onBookmark: () => void;
  numberOfSelectedLanguageChapters: number;
  onOpenMenu: () => void;
  firstChapterKey?: string;
}

export interface MangaMetaProperty<TProperty extends keyof IMangaSchema> {
  data: IMangaSchema[TProperty] | undefined;
  loading?: boolean;
}
