export { default } from './Overlay';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { ChapterSchema } from '@database/schemas/Chapter';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu';
import useReaderProps from '@screens/Reader/hooks/useReaderProps';
import { FlashList } from '@shopify/flash-list';
import { Page } from '@redux/slices/reader';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator';
import useNetworkToast from '@screens/Reader/hooks/useNetworkToast';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { CombinedMangaWithLocal } from '@hooks/useCombinedMangaWithLocal';

export interface OverlayProps extends React.PropsWithChildren {
  opacity: SharedValue<number>;
  currentPage: number;
  savedChapterInfo: ChapterSchema;
  chapter: LocalChapterSchema;
  manga: CombinedMangaWithLocal;
  readerProps: ReturnType<typeof useReaderProps>;
  scrollRef: React.RefObject<FlashList<Page>>;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
  pageSliderNavRef: React.RefObject<PageSliderNavigatorMethods>;
  isFinishedInitialScrollOffset: boolean;
  topOverlayStyle: ReturnType<typeof useNetworkToast>['topOverlayStyle'];
}

export interface ReaderSettingProps {
  type?: 'button' | 'setting';
}
