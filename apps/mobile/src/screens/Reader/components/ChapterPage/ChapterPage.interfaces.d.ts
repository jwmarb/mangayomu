import {
  ChapterPage,
  ExtendedReaderPageState,
} from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import { TapGesture } from 'react-native-gesture-handler';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
}

export interface ChapterPageContextState {
  tapGesture: TapGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
}
