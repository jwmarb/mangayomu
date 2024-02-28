export { default } from './PageList';
import { Page } from '@redux/slices/reader';
import { FlashListProps } from '@shopify/flash-list';
import { FlatListProps } from 'react-native';
import { NativeGesture } from 'react-native-gesture-handler';

export interface PageListProps
  extends Omit<FlatListProps<Page>, keyof FlashListProps<Page>>,
    FlashListProps<Page> {
  nativeFlatListGesture: NativeGesture;
}
