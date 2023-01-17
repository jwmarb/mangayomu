import { Colors, DefaultTheme, Theme, ThemeMode, ThemeSchema } from '.';

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
  const converted: RecursivePartial<Theme['palette']> = {};
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
  }

  return converted as RecursiveRequired<Theme['palette']>;
}

export function getColor(theme: DefaultTheme) {
  return (color: Colors) => {
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
  };
}
