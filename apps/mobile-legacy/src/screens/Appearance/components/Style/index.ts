export { default } from './Style';
import { BookStyle } from '@redux/slices/settings';

export interface BookStyleProps {
  setBookStyle: (style: BookStyle) => void;
}

export interface PreviewBookStyleProps {
  isSelected: boolean;
  onSelect: (bookStyle: BookStyle) => void;
}
