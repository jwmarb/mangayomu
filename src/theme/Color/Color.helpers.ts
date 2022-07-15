import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { RGBA } from '@theme/Color/Color.interfaces';
import { Color } from '@theme/core';
import { Appearance, ColorSchemeName } from 'react-native';
let store: any | null;

export function injectThemeFromStore(_store: any) {
  store = _store;
}

export function getUserSelectedTheme(): ColorSchemeName {
  if (store == null) return Appearance.getColorScheme();
  switch (store.getState().settings.theme) {
    case ChangeableTheme.LIGHT:
      return 'light';
    case ChangeableTheme.DARK:
      return 'dark';
    case ChangeableTheme.SYSTEM_THEME:
    default:
      return Appearance.getColorScheme();
  }
}

/**
 * Convert a hexadecimal to RGB value
 * @param hex The hexadecimal
 * @returns Returns the RGBA version of the hex
 */
export function hexToRgb(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result)
    return {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16),
      alpha: 1,
    };
  else throw Error('Invalid hex value');
}

/**
 * Convert RGBA to hexadecimal. This does not preserve alpha
 * @param rgba The RGBA value
 * @returns Returns the hexadecimal version of RGBA
 */
export function rgbaToHex(rgba: RGBA): string {
  return (
    '#' +
    (rgba.red | (1 << 8)).toString(16).slice(1) +
    (rgba.green | (1 << 8)).toString(16).slice(1) +
    (rgba.blue | (1 << 8)).toString(16).slice(1)
  );
}

/**
 * Parse a string RGBA
 * @param rgba RGBA value
 * @returns Returns a string version of rgba
 */
export function parseRGBA(rgba: string): RGBA {
  const rgbaregex = /\d+\.?\d*/g;
  const [red, green, blue, alpha] = rgba.match(rgbaregex)!;
  return {
    red: parseInt(red),
    green: parseInt(green),
    blue: parseInt(blue),
    alpha: parseFloat(alpha),
  };
}

/**
 * Convert an RGBA to a string
 * @param rgba The color's RGBA
 * @returns Returns a string version of RGBA
 */
export function rgbaToString(rgba: RGBA): string {
  return `rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, ${rgba.alpha})`;
}

/**
 * Create colors that share the same color value
 * @param names Name of the colors
 * @param color The color
 * @returns Returns names of the colors with the same color
 */
export function createSharedColors<T extends string>(names: readonly T[], color: Color): Record<T, Color> {
  return names.reduce((prev, current) => ({ ...prev, [current]: color }), {} as any);
}
