import { Page } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { FlashListProps } from '@shopify/flash-list';
import { FlatListProps } from 'react-native';
import { GestureType } from 'react-native-gesture-handler';

export interface PageListProps
  extends FlashListProps<Page>,
    FlatListProps<Page> {
  readingDirection: ReadingDirection;
  panRef: React.MutableRefObject<GestureType | undefined>;
}
