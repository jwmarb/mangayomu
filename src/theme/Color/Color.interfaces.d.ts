import { applicableColors } from '@theme/core';
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

export type ThemedPalette = {
  mode: ColorSchemeName;
  text: TextColors;
};

export type AppColors = keyof typeof applicableColors | 'textPrimary' | 'textSecondary';
