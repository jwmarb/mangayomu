import { ThemedPalette } from '@theme/Color/Color.interfaces';
import { Palette, applicableColors } from '@theme/Color';
import spacing from '@theme/Spacing';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { DefaultTheme } from 'styled-components';
import { TypographyTheme } from '@theme/Typography/typography.interfaces';
import { FontFamily, typographyTheme } from '@theme/Typography';
import { Theme as NavigationTheme, DefaultTheme as DefaultNavigationTheme } from '@react-navigation/native';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { MenuOptionsCustomStyle } from 'react-native-popup-menu';
const ButtonBase = React.lazy(() => import('@components/Button/ButtonBase'));
const Flex = React.lazy(() => import('@components/Flex'));
import { RFValue } from 'react-native-responsive-fontsize';
import React from 'react';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: ThemedPalette & typeof applicableColors;
    menuOptionsStyle: MenuOptionsCustomStyle;
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
    menuOptionsStyle: {
      optionText: {
        color: generated.palette.text.primary.get(),
        fontSize: RFValue(13),
      },

      OptionTouchableComponent: (props: React.PropsWithChildren<{}>) => {
        const { children, ...rest } = props;
        return (
          <React.Suspense fallback={null}>
            <ButtonBase square useGestureHandler {...rest}>
              <Flex container horizontalPadding={3} verticalPadding={1.5}>
                {children}
              </Flex>
            </ButtonBase>
          </React.Suspense>
        );
      },
      optionsContainer: {
        backgroundColor: generated.palette.background.default.get(),
        borderWidth: 1,
        borderColor: generated.palette.divider.get(),
        maxWidth: RFValue(300),
        width: 'auto',
        borderRadius: generated.borderRadius,
      },
      optionsWrapper: {
        maxWidth: RFValue(300),
        width: 'auto',
        backgroundColor: generated.palette.background.default.get(),
        borderWidth: 1,
        borderColor: generated.palette.divider.get(),
        borderRadius: generated.borderRadius,
      },
    },
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

export const shadowDrop = {
  shadowOffset: {
    shadowColor: '#000',
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
};

export default theme;
