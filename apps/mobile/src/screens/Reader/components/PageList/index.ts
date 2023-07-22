export { default } from './PageList';
import { Page } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { FlashListProps } from '@shopify/flash-list';
import { FlatListProps } from 'react-native';
import { GestureType } from 'react-native-gesture-handler';

export interface PageListProps
  extends Omit<FlatListProps<Page>, keyof FlashListProps<Page>>,
    FlashListProps<Page> {
  readingDirection: ReadingDirection;
  panRef: React.MutableRefObject<GestureType | undefined>;
  pinchRef: React.MutableRefObject<GestureType | undefined>;
}
