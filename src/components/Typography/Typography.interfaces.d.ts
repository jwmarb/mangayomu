import { Color } from '@theme/Color';
import { AppColors } from '@theme/Color/Color.interfaces';
import { TextStyle } from 'react-native';

export interface TypographyProps {
  color?: AppColors | Color;
  bold?: boolean;
  italics?: boolean;
  align?: TextStyle['textAlign'];
}
