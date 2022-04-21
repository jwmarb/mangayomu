import { createSharedColors, hexToRgb, parseRGBA, rgbaToHex, rgbaToString } from '@theme/Color/Color.helpers';
import {
  ActionColors,
  AppColors,
  BackgroundColors,
  RGBA,
  TextColors,
  ThemedColorValue,
  ThemedPalette,
} from '@theme/Color/Color.interfaces';
import { Appearance } from 'react-native';

export default class Color {
  /**
   * The hexadecimal of the color
   */
  private hexadecimal: ThemedColorValue;

  /**
   * The RGBA value of the color
   */
  private rgba: ThemedColorValue<RGBA>;
  public constructor(val: ThemedColorValue | ThemedColorValue<RGBA>) {
    const { light, dark } = val;
    if (typeof light === 'string' && typeof dark === 'string') {
      this.hexadecimal = {
        light,
        dark,
      };
      this.rgba = {
        light: hexToRgb(light),
        dark: hexToRgb(dark),
      };
    } else if (typeof light === 'object' && typeof dark === 'object') {
      this.hexadecimal = {
        light: rgbaToHex(light),
        dark: rgbaToHex(dark),
      };
      this.rgba = {
        light: light,
        dark: dark,
      };
    } else throw Error('Invalid argument type in constructor of Color');
  }

  /**
   * Get the contrast text color that would be preferred when this color is used as a background
   * @returns Returns the recommended text color where this color is used as the background
   */
  public getContrastText(): string {
    const mode = Appearance.getColorScheme() ?? 'light';
    const yiq = (this.rgba[mode].red * 299 + this.rgba[mode].green * 587 + this.rgba[mode].blue * 114) / 1000;

    return yiq > 125 ? rgbaToString(textColors.primary.rgba.light) : rgbaToString(textColors.primary.rgba.dark);
  }

  /**
   * Converts the class to a usable string for styled-components. This method does not need to be called in a styled-components component, but it will need to be called when outside styled-components.
   * @returns Returns the string value
   */
  public toString(): string {
    const rgbaFromCurrentTheme = this.rgba[Appearance.getColorScheme() ?? 'light'];
    return `rgba(${rgbaFromCurrentTheme.red}, ${rgbaFromCurrentTheme.green}, ${rgbaFromCurrentTheme.blue}, ${rgbaFromCurrentTheme.alpha})`;
  }

  /**
   * Get the disabled version of the color
   * @returns Returns the disabled color version of the color
   */
  public toDisabled(): Color {
    return Color.rgba(
      rgbaToString({ ...this.rgba.light, alpha: actionColors.disabledOpacity }),
      rgbaToString({ ...this.rgba.dark, alpha: actionColors.disabledOpacity })
    );
  }

  /**
   * Same as toString()
   * @returns Returns the value of the color in string form
   */
  public get(): string {
    return this.toString();
  }

  /**
   * Get the color from the color palette
   */
  public static valueOf(v: AppColors): string {
    if (v instanceof Color) return v.get();
    const palette = Palette();
    switch (v) {
      case 'textPrimary':
        return palette.text.primary.get();
      case 'textSecondary':
        return palette.text.secondary.get();
      case 'disabled':
        return palette.text.disabled.get();
      default:
        return palette[v].main.get();
    }
  }

  public static hex(lightThemeHex: string, darkThemeHex: string): Color {
    return new Color({ light: lightThemeHex, dark: darkThemeHex });
  }

  public static rgba(lightRGBA: string, darkRGBA: string) {
    return new Color({ light: parseRGBA(lightRGBA), dark: parseRGBA(darkRGBA) });
  }

  public static constant(hex: string) {
    return new Color({ light: hex, dark: hex });
  }
}

export const actionColors: ActionColors = {
  disabledOpacity: 0.38,
  disabled: Color.rgba('rgba(0, 0, 0, 0.26)', 'rgba(255, 255, 255, 0.3)'),
  disabledBackground: Color.rgba('rgba(0, 0, 0, 0.12)', 'rgba(255, 255, 255, 0.12)'),
};

export const applicableColors = {
  primary: {
    light: Color.constant('#69c0ff'),
    main: Color.constant('#1890ff'),
    dark: Color.constant('#0050b3'),
  },
  secondary: {
    light: Color.constant('#ffa39e'),
    main: Color.constant('#ff7875'),
    dark: Color.constant('#ff4d4f'),
  },
};

export const textColors: TextColors = {
  primary: Color.rgba('rgba(0, 0, 0, 0.87)', 'rgba(255, 255, 255, 1)'),
  secondary: Color.rgba('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.7)'),
  disabled: Color.rgba('rgba(0, 0, 0, 0.38)', 'rgba(255, 255, 255, 0.5)'),
};

export const background: BackgroundColors = {
  default: Color.hex('#fafafa', '#141414'),
  paper: Color.hex('#ffffff', '#262626'),
};

export const status = {
  ...createSharedColors(['discontinued', 'canceled', 'cancelled'], Color.hex('#ff7875', '#f5222d')),
  ...createSharedColors(['hiatus', 'on hiatus'], Color.hex('#ffe58f', '#ffc53d')),
  ...createSharedColors(['ongoing', 'publishing'], Color.hex('#b7eb8f', '#73d13d')),
  ...createSharedColors(['finished', 'complete', 'completed'], Color.hex('#8c8c8c', '#434343')),
};

export const Palette = (): ThemedPalette & typeof applicableColors & { status: typeof status } => ({
  mode: Appearance.getColorScheme(),
  text: textColors,
  background,
  status,
  action: actionColors,
  modalOverlay: Color.rgba('rgba(0, 0, 0, 0.22)', 'rgba(0, 0, 0, 0.1)'),
  ...applicableColors,
});
