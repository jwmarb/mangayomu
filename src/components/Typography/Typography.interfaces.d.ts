import { Color } from '@theme/Color';
import { AppColors } from '@theme/Color/Color.interfaces';
import { TypographyVariants } from '@theme/Typography/typography.interfaces';
import { TextStyle } from 'react-native';

export interface TypographyProps {
  color?: AppColors;
  bold?: boolean;
  italics?: boolean;
  align?: TextStyle['textAlign'];
  variant?: TypographyVariants;
}
