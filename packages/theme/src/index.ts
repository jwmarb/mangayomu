import {
  ColorSchema,
  definePalette,
  getColor,
  mutatePalette,
  readColors,
} from './helpers';
export * from './colorHelpers';

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
  contrastText: string;
  ripple: string;
}

export interface BackgroundColor {
  paper: string;
  default: string;
  disabled: string;
}

export interface TextColor {
  primary: string;
  secondary: string;
  hint: string;
  disabled: string;
}

export type TextColors = 'textPrimary' | 'textSecondary' | 'disabled' | 'hint';
export type ButtonColors = 'primary' | 'secondary';
export type ButtonColorsTextContrasts =
  | 'primary@contrast'
  | 'secondary@contrast';
export type BackgroundColors = keyof BackgroundColor;
export type Colors = TextColors | ButtonColors;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeHelpers extends DefaultThemeHelpers {}

export interface DefaultThemeHelpers {
  getColor(colorProp: Colors | ButtonColorsTextContrasts): string;
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

export type Spacing = keyof DefaultTheme['style']['spacing'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Theme extends DefaultTheme {}

export interface ThemeBuilder {
  color(dark: string, light: string): ColorSchema;
  colorConstant(color: string): ColorSchema;
  definePalette<T extends Record<PropertyKey, unknown>>(
    obj: UserDefinedPalette<T>,
  ): T;
}

export type UserDefinedPalette<T extends Record<PropertyKey, unknown>> = {
  [K in keyof T]: T[K] extends string
    ? ColorSchema
    : T[K] extends Record<PropertyKey, string>
    ? UserDefinedPalette<T[K]>
    : T[K];
};

export type ThemeSchema<T extends DefaultTheme> = {
  [K in keyof T]: K extends 'palette'
    ? {
        [V in keyof T[K]]: T[K][V] extends Color | TextColor | BackgroundColor
          ? Omit<
              {
                [S in keyof T[K][V]]: T[K][V][S] extends string
                  ? ColorSchema
                  : T[K][V][S];
              },
              'contrastText' | 'ripple'
            >
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
  const template: ThemeSchema<T> = builder({
    color,
    colorConstant,
    definePalette: definePalette as ThemeBuilder['definePalette'],
  });

  mutatePalette(template, template.mode);

  // const parsed: DefaultTheme = {
  //   ...template,
  //   palette: readColors(
  //     (template as ThemeSchema<DefaultTheme>).palette,
  //     template.mode,
  //   ),
  //   style: {
  //     borderRadius: template.style.borderRadius,
  //     spacing: template.style.spacing,
  //   },
  // } as DefaultTheme; // missing helpers, which will be assigned under this line
  const parsed = {
    ...template,
    palette: readColors(
      (template as ThemeSchema<DefaultTheme>).palette,
      template.mode,
    ),
    helpers: {},
  };

  for (const key in template.helpers) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parsed.helpers as any)[key] = (...args: unknown[]) =>
      (template.helpers as any)[key](...args)(template);
  }
  (parsed as DefaultTheme).helpers['getColor'] = getColor(
    parsed as DefaultTheme,
  );
  return parsed as T & DefaultThemeHelpers;
}
