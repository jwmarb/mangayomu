import Color from '@theme/Color/Color';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemedPalette {
  mode: ColorSchemeName;
  text: TextColors;
}

export interface ApplicableColors {
  primary: Color;
}

export interface TextColors {
  primary: Color;
  secondary: Color;
  disabled: Color;
}
