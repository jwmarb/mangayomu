export { default } from './ChapterPage';
import {
  ChapterPage,
  ExtendedReaderPageState,
} from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import { PageGestures } from '@screens/Reader/hooks/useOverlayGesture';
import { PanGesture, PinchGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
}

export interface ChapterPageContextState {
  velocityX: SharedValue<number>;
  velocityY: SharedValue<number>;
  rootPanGesture: PanGesture;
  rootPinchGesture: PinchGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
  pageGestures: PageGestures;
}
