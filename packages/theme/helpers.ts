import { DefaultTheme, Theme, ThemeMode, ThemeSchema } from '.';

export type ColorSchema = {
  light: string;
  dark: string;
};

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends object ? RecursivePartial<T[K]> : T[K];
};

type RecursiveRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? RecursiveRequired<T[K]> : T[K];
};

export function readColors<T extends DefaultTheme>(
  obj: ThemeSchema<T>['palette'],
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
