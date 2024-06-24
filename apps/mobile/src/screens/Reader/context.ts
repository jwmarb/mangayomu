import { createContext } from '@/utils/context';
import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';

export const {
  useContext: useCurrentChapterContext,
  Provider: CurrentChapterProvider,
} = createContext<MangaChapter | null>();

export const {
  useContext: useIsFetchingChapter,
  Provider: IsFetchingChapterProvider,
} = createContext<boolean>();
