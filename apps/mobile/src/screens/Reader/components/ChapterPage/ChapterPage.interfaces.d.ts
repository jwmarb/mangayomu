import {
  ChapterPage,
  ExtendedReaderPageState,
} from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import { PanGesture, TapGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
}

export interface ChapterPageContextState {
  velocityX: SharedValue<number>;
  rootPanGesture: PanGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
}
