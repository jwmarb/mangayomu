import React from 'react';
import { ColorSchema, getColor, readColors, RecursivePartial } from './helpers';
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

export type TextColors = 'textPrimary' | 'textSecondary' | 'disabled' | 'hint';
export type ButtonColors = 'primary' | 'secondary';
export type Colors = TextColors | ButtonColors;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeHelpers extends DefaultThemeHelpers {}

export interface DefaultThemeHelpers {
  getColor(colorProp: Colors): string;
}

export interface IThemeHelpers {
  helpers: ThemeHelpers;
}

export interface DefaultTheme extends IThemeHelpers {
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

export type ThemeSchema<T extends DefaultTheme> = {
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
    : K extends 'helpers'
    ? Omit<
        {
          [V in keyof T[K]]:
            | ((
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...args: any[]
              ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (theme: T) => any)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            | (() => (theme: T) => any)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            | (() => () => any);
        },
        keyof DefaultThemeHelpers
      >
    : T[K];
};

type PartializeKeys<T, K extends keyof T> = Omit<T, K> &
  Pick<RecursivePartial<T>, K>;
type ThemeCreator<T extends DefaultTheme> = (
  builder: ThemeBuilder,
) => ThemeSchema<T>;
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

  const parsed: DefaultTheme = {
    ...template,
    palette: React.useMemo(
      () =>
        readColors(
          (template as ThemeSchema<DefaultTheme>).palette,
          template.mode,
        ),
      [template.mode],
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
  } as DefaultTheme; // missing helpers, which will be assigned under this line
  (parsed as PartializeKeys<DefaultTheme, 'helpers'>).helpers = {
    getColor: getColor(parsed),
  };
  for (const key in template.helpers) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parsed.helpers as any)[key] = (...args: unknown[]) =>
      (template.helpers as any)[key](args)(parsed);
  }
  return parsed as T & DefaultThemeHelpers;
}
