import React from 'react';
import { ColorSchema, readColors } from './helpers';
export * from './colorHelpers';
export * from './themeProvider';

export interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export type ThemeMode = null | undefined | 'light' | 'dark';

export interface Color {
  light: string;
  main: string;
  dark: string;
}

export interface BackgroundColor {
  paper: string;
  default: string;
}

export interface TextColor {
  primary: string;
  secondary: string;
  hint: string;
  disabled: string;
}

export interface DefaultTheme {
  mode: ThemeMode;
  palette: {
    primary: Color;
    secondary: Color;
    background: BackgroundColor;
    text: TextColor;
  };
  style: {
    borderRadius: number;
  };
}

export type Theme = DefaultTheme;

export interface ThemeBuilder {
  color(dark: string, light: string): ColorSchema;
  colorConstant(color: string): ColorSchema;
}

export type ThemeSchema<T> = {
  [K in keyof T]: K extends 'palette'
    ? ThemeSchema<T[K]>
    : T[K] extends Color | BackgroundColor | TextColor
    ? {
        [V in keyof T[K]]: T[K][V] extends string ? ColorSchema : T[K][V];
      }
    : T[K];
};

type ThemeCreator<T> = (builder: ThemeBuilder) => ThemeSchema<T>;

/**
 * Create a theme for the application. Must be placed at the most top-level of the React app, and must be inside the component.
 * @param builder A helper function to create a theme
 * @returns Returns the theme that will be used for the application
 */
export function createTheme(builder: ThemeCreator<Theme>): Theme {
  function color(dark: string, light: string): ColorSchema {
    return { dark, light };
  }
  function colorConstant(color: string): ColorSchema {
    return { dark: color, light: color };
  }
  const template = builder({ color, colorConstant });
  const parsed: Theme = {
    ...template,
    palette: React.useMemo(
      () => readColors(template.palette, template.mode),
      [template.palette, template.mode],
    ),
  };
  return parsed;
}
