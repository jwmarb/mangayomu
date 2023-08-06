export { default } from './PageList';
import { Page } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { PageGestures } from '@screens/Reader/hooks/useOverlayGesture';
import { FlashListProps } from '@shopify/flash-list';
import { FlatListProps } from 'react-native';
import { GestureType, SimultaneousGesture } from 'react-native-gesture-handler';

export interface PageListProps
  extends Omit<FlatListProps<Page>, keyof FlashListProps<Page>>,
    FlashListProps<Page> {
  readingDirection: ReadingDirection;
  panRef: React.MutableRefObject<GestureType | undefined>;
  pinchRef: React.MutableRefObject<GestureType | undefined>;
  pageGestures: PageGestures;
  currentPageKey: React.MutableRefObject<string>;
  nativeFlatListGesture: SimultaneousGesture;
}
