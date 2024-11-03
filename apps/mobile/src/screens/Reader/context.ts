import { ReadingDirection } from '@/models/schema';
import { PageProps } from '@/screens/Reader/components/ui/Page';
import { PageBoundaries } from '@/screens/Reader/helpers/determinePageBoundaries';
import { BackgroundColor } from '@/stores/settings';
import { createContext } from '@/utils/context';
import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

export const {
  useContext: useIsFetchingChapter,
  Provider: IsFetchingChapterProvider,
} = createContext<boolean>();

export const { Provider: ReaderMangaProvider, useContext: useReaderManga } =
  createContext<Manga>();

export const {
  useContext: useReaderFlatListRef,
  Provider: ReaderFlatListRefProvider,
} = createContext<React.RefObject<FlatList>>();

export const { useContext: useCurrentPage, Provider: CurrentPageNumber } =
  createContext<PageProps>(false);

export const {
  useContext: useReadingDirection,
  Provider: ReadingDirectionProvider,
} = createContext<ReadingDirection>();

export const {
  useContext: useReaderBackgroundColor,
  Provider: ReaderBackgroundColor,
} = createContext<BackgroundColor>();
