import { createContext } from '@/utils/context';
import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';

export const {
  useContext: useCurrentChapterContext,
  Provider: CurrentChapterProvider,
} = createContext<MangaChapter | null>();

export const {
  useContext: useIsFetchingChapter,
  Provider: IsFetchingChapterProvider,
} = createContext<boolean>();

export const { Provider: ReaderMangaProvider, useContext: useReaderManga } =
  createContext<Manga>();
