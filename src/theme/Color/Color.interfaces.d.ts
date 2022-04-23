import { applicableColors, Color, status } from '@theme/core';
import { ColorSchemeName } from 'react-native';

export interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface ThemedColorValue<T = string> {
  light: T;
  dark: T;
}

export interface TextColors {
  primary: Color;
  secondary: Color;
  disabled: Color;
}

export interface BackgroundColors {
  default: Color;
  paper: Color;
}

export interface ActionColors {
  disabledOpacity: number;
  disabledBackground: Color;
  disabled: Color;
}

export type ThemedPalette = {
  mode: ColorSchemeName;
  text: TextColors;
  background: BackgroundColors;
  action: ActionColors;
  status: typeof status;
  modalOverlay: Color;
  divider: Color;
};

export type ColorConstant = {
  1: Color;
  2: Color;
  3: Color;
  4: Color;
  5: Color;
  6: Color;
  7: Color;
  8: Color;
  9: Color;
  10: Color;
};

export type NeutralColorConstant = {
  11: Color;
  12: Color;
  13: Color;
} & ColorConstant;

export type AppColors = keyof typeof applicableColors | 'textPrimary' | 'textSecondary' | 'disabled' | Color;

export type ButtonColors = keyof typeof applicableColors | Color;
