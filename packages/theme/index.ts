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
    spacing: {
      s: number | string;
      m: number | string;
      l: number | string;
      xl: number | string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Theme extends DefaultTheme {}

export interface ThemeBuilder {
  color(dark: string, light: string): ColorSchema;
  colorConstant(color: string): ColorSchema;
}

export type ThemeSchema<T> = {
  [K in keyof T]: K extends 'palette'
    ? {
        [V in keyof T[K]]: T[K][V] extends Color | TextColor | BackgroundColor
          ? {
              [S in keyof T[K][V]]: T[K][V][S] extends string
                ? ColorSchema
                : T[K][V][S];
            }
          : T[K][V];
      }
    : T[K];
};

type ThemeCreator<T> = (builder: ThemeBuilder) => ThemeSchema<T>;

/**
 * Create a theme for the application. Must be placed at the most top-level of the React app, and must be inside the component.
 * @param builder A helper function to create a theme
 * @returns Returns the theme that will be used for the application
 */
export function createTheme<T extends DefaultTheme>(
  builder: ThemeCreator<T>,
): T {
  function color(dark: string, light: string): ColorSchema {
    return { dark, light };
  }
  function colorConstant(color: string): ColorSchema {
    return { dark: color, light: color };
  }
  const template: ThemeSchema<T> = builder({ color, colorConstant });

  const parsed = {
    ...template,
    palette: React.useMemo(
      () =>
        readColors<DefaultTheme>(
          (template as ThemeSchema<DefaultTheme>).palette,
          template.mode,
        ),
      [template.palette, template.mode],
    ),
    style: {
      borderRadius: React.useMemo(
        () => template.style.borderRadius,
        [template.style.borderRadius],
      ),
      spacing: React.useMemo(
        () => template.style.spacing,
        [
          template.style.spacing.l,
          template.style.spacing.m,
          template.style.spacing.s,
          template.style.spacing.xl,
        ],
      ),
    },
  };
  return parsed as T;
}
