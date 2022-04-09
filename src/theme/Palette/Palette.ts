import Color from '@theme/Color/Color';
import { TextColors, ThemedPalette } from '@theme/Palette/Palette.interfaces';
import { Appearance, ColorSchemeName } from 'react-native';

const applicableColors = {
  primary: Color.hex('#1890ff', '#1890ff'),
  secondary: Color.hex('#ff7875', '#ff7875'),
};

const textColors: TextColors = {
  primary: Color.rgba('rgba(0, 0, 0, 0.87)', 'rgba(255, 255, 255, 1)'),
  secondary: Color.rgba('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.7)'),
  disabled: Color.rgba('rgba(0, 0, 0, 0.38)', 'rgba(255, 255, 255, 0.5)'),
};

export const Palette = (): ThemedPalette & typeof applicableColors => ({
  mode: Appearance.getColorScheme(),
  text: textColors,
  ...applicableColors,
});
