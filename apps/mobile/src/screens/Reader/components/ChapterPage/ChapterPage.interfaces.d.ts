import { ChapterPage } from '@redux/slices/reader/reader';
import { TapGesture } from 'react-native-gesture-handler';

export interface ChapterPageProps {
  page: ChapterPage;
  mangaKey: string;
  tapGesture: TapGesture;
}
