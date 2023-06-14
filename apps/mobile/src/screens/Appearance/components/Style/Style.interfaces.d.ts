import { BookStyle } from '@redux/slices/settings';

export interface StyleProps {
  setBookStyle: (style: BookStyle) => void;
  style: BookStyle;
}

export interface PreviewBookStyleProps {
  isSelected: boolean;
  onSelect: (bookStyle: BookStyle) => void;
}
