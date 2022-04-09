import { hexToRgb, parseRGBA, rgbaToHex, rgbaToString } from '@theme/Color/Color.helpers';
import { RGBA, ThemedColorValue } from '@theme/Color/Color.interfaces';
import { Palette } from '@theme/Palette/Palette';
import { ApplicableColors } from '@theme/Palette/Palette.interfaces';
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
    return yiq >= 128
      ? rgbaToString(Palette().text.primary.rgba.dark)
      : rgbaToString(Palette().text.primary.rgba.light);
  }

  public toString() {
    const rgbaFromCurrentTheme = this.rgba[Appearance.getColorScheme() ?? 'light'];
    return `rgba(${rgbaFromCurrentTheme.red}, ${rgbaFromCurrentTheme.green}, ${rgbaFromCurrentTheme.blue}, ${rgbaFromCurrentTheme.alpha})`;
  }

  /**
   * Get the color from the color palette
   */
  public static valueOf(v: keyof Omit<typeof Palette, 'mode' | 'text'>): Color {
    return Palette[v];
  }

  public static hex(lightThemeHex: string, darkThemeHex: string): Color {
    return new Color({ light: lightThemeHex, dark: darkThemeHex });
  }

  public static rgba(lightRGBA: string, darkRGBA: string) {
    return new Color({ light: parseRGBA(lightRGBA), dark: parseRGBA(darkRGBA) });
  }
}
