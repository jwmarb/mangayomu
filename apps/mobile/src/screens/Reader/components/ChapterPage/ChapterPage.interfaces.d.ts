import {
  ChapterPage,
  ExtendedReaderPageState,
} from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { TapGesture } from 'react-native-gesture-handler';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
  index: number;
}

export interface ChapterPageContextState {
  tapGesture: TapGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
}
