import {
  ButtonColors,
  ButtonColorsTextContrasts,
  Colors,
  DefaultTheme,
  hexToRgb,
  parseRGBA,
  RGBA,
  rgbaToString,
  Theme,
  ThemeMode,
  ThemeSchema,
} from '.';

export type ColorSchema = {
  light: string;
  dark: string;
};

export type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends object ? RecursivePartial<T[K]> : T[K];
};

type RecursiveRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? RecursiveRequired<T[K]> : T[K];
};

export function readColors(
  obj: ThemeSchema<DefaultTheme>['palette'],
  mode: ThemeMode,
) {
  const converted: RecursivePartial<DefaultTheme['palette']> = {};
  for (const name in obj) {
    const typedName = name as keyof ThemeSchema<Theme>['palette'];

    if (
      'light' in obj[typedName] &&
      'dark' in obj[typedName] &&
      typeof (obj[typedName] as unknown as ColorSchema).light === 'string' &&
      typeof (obj[typedName] as unknown as ColorSchema).dark === 'string'
    ) {
      switch (mode) {
        case null:
        case undefined:
        case 'light':
          (converted[typedName] as string) = (
            obj[typedName] as unknown as ColorSchema
          ).light;
          break;
        case 'dark':
          (converted[typedName] as string) = (
            obj[typedName] as unknown as ColorSchema
          ).dark;
          break;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (converted as any)[typedName] =
        typeof obj[typedName] === 'function' ? obj[typedName] : {};
      for (const variety in obj[typedName]) {
        switch (mode) {
          case null:
          case undefined:
          case 'light':
            (converted as Record<string, Record<string, string>>)[name][
              variety
            ] = (obj[typedName] as Record<string, ColorSchema>)[variety][
              'light'
            ];
            break;
          case 'dark':
            (converted as Record<string, Record<string, string>>)[name][
              variety
            ] = (obj[typedName] as Record<string, ColorSchema>)[variety][
              'dark'
            ];

            break;
        }
      }
    }
    if (typedName === 'primary' || typedName === 'secondary') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rgba = hexToRgb(converted[typedName]!.main!);
      const yiq = (rgba.red * 299 + rgba.green * 587 + rgba.blue * 114) / 1000;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      converted[typedName]!.contrastText =
        yiq > 125 ? obj.text.primary.light : obj.text.primary.dark;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      converted[typedName]!.ripple = rgbaToString({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...hexToRgb(converted[typedName]![mode ?? 'main']!),
        alpha: 0.4,
      });
    }
  }

  return converted as RecursiveRequired<Theme['palette']>;
}

export function mutatePalette<T>(a: T, mode: ThemeMode) {
  for (const key in a) {
    if (key === 'palette') continue;
    if (typeof a[key] === 'object' && a[key] != null) {
      const b = a[key] as Record<PropertyKey, unknown>;
      if ('light' in b && 'dark' in b) {
        (a as Record<string, unknown>)[key] =
          mode === 'light' ? b.light : b.dark;
      } else mutatePalette(a[key], mode);
    }
    if (Array.isArray(a[key])) {
      const b = a[key] as unknown[];
      if (b[0] === 'palette' && typeof b[1] === 'object' && b[1] != null) {
        (a as Record<string, unknown>)[key] = { ...b[1] };
        mutatePalette(a[key], mode);
      }
    }
  }
}

/**
 * Processes object to convert getters into their actual value
 * @param obj The object that contains getter functions
 * @param parsedTheme A preprocessed theme object for reference to access non-getter values
 */
export function parseGetters<T extends Record<PropertyKey, unknown>>(
  obj: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedTheme: any,
) {
  for (const key in obj) {
    if (key === 'helpers') continue;
    const typed = obj[key];
    if (typed != null && typeof typed === 'object')
      parseGetters(typed as Record<PropertyKey, unknown>, parsedTheme);
    else if (typeof typed === 'function') obj[key] = typed(parsedTheme);
  }
}

/**
 * If an object is going to use colors that will or cannot be defined in the `palette` property, this function should be called to recursively convert color properties
 * @param obj The object to define a palette
 * @returns
 */
export function definePalette<T>(obj: T) {
  return ['palette', obj];
}

export function isPaletteColor(theme: DefaultTheme) {
  return (color: string): color is Colors | ButtonColorsTextContrasts => {
    const contrastIndex = color.indexOf('@contrast');
    const withoutContrast =
      contrastIndex === -1 ? color : color.substring(0, contrastIndex);
    switch (withoutContrast) {
      case 'textPrimary':
      case 'textSecondary':
        return true;
      default:
        if (
          withoutContrast in theme.palette &&
          'main' in
            theme.palette[withoutContrast as keyof DefaultTheme['palette']]
        )
          return true;
        if (color in theme.palette.text) return true;
        return false;
    }
  };
}

export function getColor(theme: DefaultTheme) {
  return (color: Colors | ButtonColorsTextContrasts) => {
    const indexContrastDecoration = color.indexOf('@contrast');
    if (indexContrastDecoration === -1)
      switch (color) {
        case 'textPrimary':
          return theme.palette.text.primary;
        case 'textSecondary':
          return theme.palette.text.secondary;
        default:
          if (color in theme.palette)
            return theme.palette[color as 'primary' | 'secondary'].main;
          if (color in theme.palette.text)
            return theme.palette.text[color as 'disabled' | 'hint'];

          throw Error('Invalid color');
      }

    return theme.palette[
      color.substring(0, indexContrastDecoration) as ButtonColors
    ].contrastText;
  };
}

export function getContrastText(
  preparsedPalette: ThemeSchema<DefaultTheme>['palette'],
) {
  return (color: string, variant?: 'textPrimary' | 'textSecondary') => {
    let rgba: RGBA;
    if (color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i) != null)
      rgba = hexToRgb(color);
    else if (color.match(/rgb(a?)\(\d+/g) != null) rgba = parseRGBA(color);
    else throw Error('Invalid color: ' + color);
    const yiq = (rgba.red * 299 + rgba.green * 587 + rgba.blue * 114) / 1000;
    return yiq > 125
      ? preparsedPalette.text[
          variant === 'textSecondary' ? 'secondary' : 'primary'
        ].light
      : preparsedPalette.text[
          variant === 'textSecondary' ? 'secondary' : 'primary'
        ].dark;
  };
}
