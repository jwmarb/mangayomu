import { ColorSchema, readColors } from "./helpers";
export * from "./colorHelpers";
export * from "./themeProvider";

export interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export type ThemeMode = null | undefined | "light" | "dark";

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
  textPrimary: string;
  textSecondary: string;
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
}

export type ThemeSchema<T> = {
  [K in keyof T]: K extends "palette"
    ? ThemeSchema<T[K]>
    : T[K] extends Color | BackgroundColor | TextColor
    ? {
        [V in keyof T[K]]: T[K][V] extends string ? ColorSchema : T[K][V];
      }
    : T[K];
};

type ThemeCreator<T> = (builder: ThemeBuilder) => ThemeSchema<T>;

export function createTheme(builder: ThemeCreator<Theme>): Theme {
  function color(dark: string, light: string): ColorSchema {
    return { dark, light };
  }
  const template = builder({ color });
  const parsed: Theme = {
    ...template,
    palette: readColors(template.palette, template.mode),
  };
  return parsed;
}
