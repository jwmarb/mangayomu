import { createContext } from '@/utils/context';
import { Manga, MangaMeta, MangaSource } from '@mangayomu/mangascraper';
import { Manga as MangaModel } from '@/models/Manga';
import { FetchStatus } from '@tanstack/react-query';
import React from 'react';
export const {
  Provider: MangaViewMangaSourceProvider,
  useContext: useMangaViewSource,
} = createContext<MangaSource>();

export const {
  Provider: MangaViewFetchStatusProvider,
  useContext: useMangaViewFetchStatus,
} = createContext<FetchStatus>();

export const {
  Provider: SynopsisExpandedProvider,
  useContext: useSynopsisExpanded,
} = createContext<boolean, false>(false, false);

export const {
  Provider: MangaViewErrorProvider,
  useContext: useMangaViewError,
} = createContext<Error | null>(false);

export const { Provider: MangaViewDataProvider, useContext: useMangaViewData } =
  createContext<(Manga & MangaMeta<unknown>) | null | undefined>(false);

export const {
  Provider: MangaViewUnparsedDataProvider,
  useContext: useMangaViewUnparsedData,
} = createContext<unknown | undefined>(false);

export const {
  Provider: MangaViewMangaProvider,
  useContext: useMangaViewManga,
} = createContext<Manga>();

export const {
  Provider: MangaViewOpenFilterMenuProvider,
  useContext: useOpenFilterMenu,
} = createContext<(() => void) | null>(false);

export const {
  Provider: MangaViewChaptersProvider,
  useContext: useMangaViewChapters,
} = createContext<unknown[] | null>();

export const {
  Provider: MangaViewUnparsedMangaProvider,
  useContext: useMangaViewUnparsedManga,
} = createContext<unknown | undefined>(undefined);

export const {
  useContext: useMangaViewMangaModel,
  Provider: MangaViewMangaModel,
} = createContext<MangaModel>();
