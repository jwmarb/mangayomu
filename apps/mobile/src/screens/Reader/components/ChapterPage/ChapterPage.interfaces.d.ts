import { ChapterPage } from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import { TapGesture } from 'react-native-gesture-handler';

export interface ChapterPageProps {
  page: ChapterPage;
  index: number;
}

export interface ChapterPageContextState {
  tapGesture: TapGesture;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
}
