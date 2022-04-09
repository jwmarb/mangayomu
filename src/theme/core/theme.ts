import { Palette } from '@theme/Palette/Palette';
import { ThemedPalette } from '@theme/Palette/Palette.interfaces';
import spacing from '@theme/Spacing';
import { useColorScheme } from 'react-native';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: ThemedPalette;
    spacing: typeof spacing;
    borderRadius: number;
  }
}

const theme = () => {
  useColorScheme(); // this must be used here so that this will always rerender when the color scheme changes
  return {
    palette: Palette(),
    spacing,
    borderRadius: 24,
  };
};

export default theme;
