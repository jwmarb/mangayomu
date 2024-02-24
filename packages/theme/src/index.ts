/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColorSchema,
  definePalette,
  getColor,
  getContrastText,
  isPaletteColor,
  mutatePalette,
  readColors,
} from './helpers';
export * from './colorHelpers';
import deepcopy from 'deepcopy';
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
export type ButtonColors = keyof Omit<Theme['palette'], 'background' | 'text'>;
export type ButtonColorsTextContrasts<
  O = Omit<Theme['palette'], 'background' | 'text'>,
> = keyof {
  [K in keyof O as K extends string ? `${K}@contrast` : never]: O[K];
};

export type CustomButtonColorsTextContrasts<
  T extends DefaultTheme,
  O = Omit<T['palette'], 'background' | 'text'>,
> = keyof {
  [K in keyof O as K extends string ? `${K}@contrast` : never]: O[K];
};

export type CustomButtonColors<T extends DefaultTheme> = keyof Omit<
  T['palette'],
  'background' | 'text'
>;

export type BackgroundColors = keyof BackgroundColor;
export type Colors = TextColors | ButtonColors;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeHelpers extends DefaultThemeHelpers {}

export interface DefaultThemeHelpers {
  getColor(colorProp: Colors | ButtonColorsTextContrasts): string;
  getContrastText(colorProp: string): string;
  isPaletteColor(
    colorProp: string,
  ): colorProp is Colors | ButtonColorsTextContrasts;
}

export interface IThemeHelpers {
  helpers: ThemeHelpers;
}

export interface DefaultTheme extends IThemeHelpers {
  mode: ThemeMode;
  palette: {
    primary: Color;
    secondary: Color;
    warning: Color;
    error: Color;
    background: BackgroundColor;
    text: TextColor;
  };
  style: {
    borderRadius: number;
    borderWidth: number;
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
          : T[K][V] extends string
          ? ColorSchema
          : T[K][V] extends Record<PropertyKey, unknown>
          ? UserDefinedPalette<T[K][V]>
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

type ThemeCreator<T extends Theme> = (
  builder: ThemeBuilder,
) => Omit<ThemeSchema<T>, 'opposite'>;
/**
 * Create a theme for the application. Must be placed at the most top-level of the React app, and must be inside the component.
 * @param builder A helper function to create a theme
 * @returns Returns the theme that will be used for the application
 */
export function createTheme<T extends Theme>(
  builder: ThemeCreator<T>,
): T & { opposite: T } {
  function color(dark: string, light: string): ColorSchema {
    return { dark, light };
  }
  function colorConstant(color: string): ColorSchema {
    return { dark: color, light: color };
  }
  const template: Omit<ThemeSchema<T>, 'opposite'> = builder({
    color,
    colorConstant,
    definePalette: definePalette as ThemeBuilder['definePalette'],
  });
  const opposite = deepcopy(template);

  const parsedGetContrastText = getContrastText(
    template.palette as ThemeSchema<DefaultTheme>['palette'],
  );

  const oppositeMode = template.mode === 'light' ? 'dark' : 'light';
  opposite.mode = oppositeMode;

  mutatePalette(template, template.mode);
  mutatePalette(opposite, oppositeMode);

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
  const oppositeParsed = {
    ...opposite,
    palette: readColors(
      (opposite as ThemeSchema<DefaultTheme>).palette,
      oppositeMode,
    ),
    helpers: {},
  };

  for (const key in template.helpers) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parsed.helpers as any)[key] = (...args: unknown[]) =>
      (template.helpers as any)[key](...args)(parsed);

    (oppositeParsed.helpers as any)[key] = (...args: unknown[]) =>
      (template.helpers as any)[key](...args)(oppositeParsed);
  }
  (parsed as DefaultTheme).helpers['isPaletteColor'] = isPaletteColor(
    parsed as DefaultTheme,
  );
  (parsed as DefaultTheme).helpers['getColor'] = getColor(
    parsed as DefaultTheme,
  );
  (parsed as DefaultTheme).helpers['getContrastText'] = parsedGetContrastText;

  (oppositeParsed as DefaultTheme).helpers['isPaletteColor'] = isPaletteColor(
    oppositeParsed as DefaultTheme,
  );
  (oppositeParsed as DefaultTheme).helpers['getColor'] = getColor(
    oppositeParsed as DefaultTheme,
  );
  (oppositeParsed as DefaultTheme).helpers['getContrastText'] =
    parsedGetContrastText;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (parsed as any).opposite = oppositeParsed;
  return parsed as T & DefaultThemeHelpers & { opposite: T };
}
