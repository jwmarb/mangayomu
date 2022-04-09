import { ThemedPalette } from '@theme/Color/Color.interfaces';
import { Palette, applicableColors } from '@theme/Color';
import spacing from '@theme/Spacing';
import { useColorScheme } from 'react-native';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: ThemedPalette & typeof applicableColors;
    spacing: typeof spacing;
    borderRadius: number;
  }
}

const theme = (): DefaultTheme => {
  useColorScheme(); // this must be used here so that this will always rerender when the color scheme changes
  return {
    palette: Palette(),
    spacing,
    borderRadius: 24,
  };
};

export default theme;
