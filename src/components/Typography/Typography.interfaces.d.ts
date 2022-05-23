import { Color } from '@theme/Color';
import { AppColors } from '@theme/Color/Color.interfaces';
import { TypographyVariants } from '@theme/Typography/typography.interfaces';
import { ColorSchemeName, TextStyle } from 'react-native';

export interface TypographyProps {
  color?: AppColors;
  bold?: boolean;
  italics?: boolean;
  align?: TextStyle['textAlign'];
  variant?: TypographyVariants;
  fontSize?: number;
  lockTheme?: ColorSchemeName;
}

export interface TypographySkeletonProps {
  variant?: TypographyVariants;
  fontSize?: number;
  width: number | string;
}
