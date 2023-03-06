import { Manga } from '@mangayomu/mangascraper';
import { SharedValue } from 'react-native-reanimated';
import { BookStyle, TitleAlignment } from '@redux/slices/settings';

export interface BookProps {
  manga: Omit<Manga, 'index'>;
}

export interface CustomizableBookProps extends Omit<Manga, 'index' | 'link'> {
  width: SharedValue<number>;
  height: SharedValue<number>;
  fontSize: SharedValue<number>;
  bold: boolean;
  letterSpacing: SharedValue<number>;
  align: TitleAlignment;
  bookStyle: BookStyle;
}
