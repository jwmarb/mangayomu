import { ThemedPalette } from '@theme/Color/Color.interfaces';
import { Palette, applicableColors } from '@theme/Color';
import spacing from '@theme/Spacing';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { DefaultTheme } from 'styled-components';
import { TypographyTheme } from '@theme/Typography/typography.interfaces';
import { typographyTheme } from '@theme/Typography';
import { Theme as NavigationTheme, DefaultTheme as DefaultNavigationTheme } from '@react-navigation/native';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: ThemedPalette & typeof applicableColors;
    spacing: typeof spacing;
    borderRadius: number;
    typography: TypographyTheme;
    '@react-navigation': NavigationTheme;
  }
}

const theme = (mode: ColorSchemeName): DefaultTheme => {
  const generated = {
    palette: Palette(),
    spacing,
    borderRadius: 10,
    typography: typographyTheme,
  };
  return {
    ...generated,
    '@react-navigation': {
      colors: {
        ...DefaultNavigationTheme.colors,
        background: generated.palette.background.default.get(mode),
        text: generated.palette.text.primary.get(mode),
        primary: generated.palette.primary.main.get(mode),
      },
      dark: mode === 'dark',
    },
  };
};

export default theme;
