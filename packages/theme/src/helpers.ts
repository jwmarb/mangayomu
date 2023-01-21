import {
  ButtonColorsTextContrasts,
  Colors,
  DefaultTheme,
  hexToRgb,
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
    converted[typedName] = {};
    for (const variety in obj[typedName]) {
      switch (mode) {
        case null:
        case undefined:
        case 'light':
          (converted as Record<string, Record<string, string>>)[name][variety] =
            (obj[typedName] as Record<string, ColorSchema>)[variety]['light'];
          break;
        case 'dark':
          (converted as Record<string, Record<string, string>>)[name][variety] =
            (obj[typedName] as Record<string, ColorSchema>)[variety]['dark'];

          break;
      }
    }
    if (typedName === 'primary' || typedName === 'secondary') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rgba = hexToRgb(converted[typedName]!.main!);
      const yiq = (rgba.red * 299 + rgba.green * 587 + rgba.blue * 114) / 1000;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      converted[typedName]!.contrastText =
        yiq > 125 ? obj.text.primary.light : obj.text.primary.dark;
    }
  }

  return converted as RecursiveRequired<Theme['palette']>;
}

export function getColor(theme: DefaultTheme) {
  return (color: Colors | ButtonColorsTextContrasts) => {
    switch (color) {
      case 'textPrimary':
        return theme.palette.text.primary;
      case 'textSecondary':
        return theme.palette.text.secondary;
      case 'primary@contrast':
        return theme.palette.primary.contrastText;
      case 'secondary@contrast':
        return theme.palette.secondary.contrastText;
      default:
        if (color in theme.palette)
          return theme.palette[color as 'primary' | 'secondary'].main;
        if (color in theme.palette.text)
          return theme.palette.text[color as 'disabled' | 'hint'];

        throw Error('Invalid color');
    }
  };
}
