import { hexToRgb, parseRGBA, rgbaToHex, rgbaToString } from '@theme/Color/Color.helpers';
import {
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

  public getContrastText(): string {
    const mode = Appearance.getColorScheme() ?? 'light';
    const yiq = (this.rgba[mode].red * 299 + this.rgba[mode].green * 587 + this.rgba[mode].blue * 114) / 1000;
    return yiq >= 128 ? rgbaToString(textColors.primary.rgba.dark) : rgbaToString(textColors.primary.rgba.light);
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
      default:
        return palette[v].get();
    }
  }

  public static hex(lightThemeHex: string, darkThemeHex: string): Color {
    return new Color({ light: lightThemeHex, dark: darkThemeHex });
  }

  public static rgba(lightRGBA: string, darkRGBA: string) {
    return new Color({ light: parseRGBA(lightRGBA), dark: parseRGBA(darkRGBA) });
  }
}

export const applicableColors = {
  primary: Color.hex('#1890ff', '#1890ff'),
  secondary: Color.hex('#ff7875', '#ff7875'),
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

export const Palette = (): ThemedPalette & typeof applicableColors => ({
  mode: Appearance.getColorScheme(),
  text: textColors,
  background,
  ...applicableColors,
});
