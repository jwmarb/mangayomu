import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import Realm from 'realm';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import useReaderProps from '@screens/Reader/hooks/useReaderProps';
import { FlashList } from '@shopify/flash-list';
import { Page } from '@redux/slices/reader';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';

export interface OverlayProps extends React.PropsWithChildren {
  opacity: SharedValue<number>;
  currentPage: number;
  chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
  readerProps: ReturnType<typeof useReaderProps>;
  scrollRef: React.RefObject<FlashList<Page>>;
  pageSliderNavRef: React.RefObject<PageSliderNavigatorMethods>;
  isFinishedInitialScrollOffset: boolean;
}

export interface ReaderSettingProps {
  type?: 'button' | 'setting';
}
