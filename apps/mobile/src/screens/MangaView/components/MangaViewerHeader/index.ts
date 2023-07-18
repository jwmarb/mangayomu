export { default } from './MangaViewerHeader';
import { ILocalManga } from '@database/schemas/LocalManga';
import { IMangaSchema, useManga } from '@database/schemas/Manga';
import { FetchMangaMetaStatus } from '@database/schemas/Manga/useFetchManga';
import { Manga } from '@mangayomu/mangascraper/src';
import React from 'react';

export interface MangaViewerHeaderProps extends React.PropsWithChildren {
  localManga?: ReturnType<typeof useManga>['meta'];
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

export interface MangaMetaProperty<TProperty extends keyof ILocalManga> {
  data: ILocalManga[TProperty] | undefined;
  loading?: boolean;
}
