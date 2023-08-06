import { TitleAlignment } from '@redux/slices/settings';
import { ViewStyle } from 'react-native';
export { default } from './Alignment';
export interface TitleAlignmentPreviewProps {
  isSelected: boolean;
  alignItems: ViewStyle['alignItems'];
  titleAlignment: TitleAlignment;
}
