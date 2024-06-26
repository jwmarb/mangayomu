import { PageBoundaries } from '@/screens/Reader/helpers/determinePageBoundaries';
import { createContext } from '@/utils/context';
import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

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

export const {
  useContext: usePageBoundaries,
  Provider: PageBoundariesProvider,
} = createContext<React.MutableRefObject<PageBoundaries>>();

export const {
  useContext: useReaderFlatListRef,
  Provider: ReaderFlatListRefProvider,
} = createContext<React.RefObject<FlatList>>();
