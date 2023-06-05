import React from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createTheme, UserDefinedPalette } from '@mangayomu/theme';
import { Theme, ThemeProvider } from '@emotion/react';
import { shadow, spacing, typography } from '@theme/theme';
import { helpers } from '@theme/helpers';
import { moderateScale } from 'react-native-size-matters';
import { MenuProvider } from 'react-native-popup-menu';
import DialogProvider from '@components/Dialog/DialogProvider';
import { PortalProvider } from '@gorhom/portal';

export enum AppearanceMode {
  SYSTEM = 'System',
  LIGHT = 'Light',
  DARK = 'Dark',
}

export const useAppearanceColorScheme = (
  mode: AppearanceMode,
): ColorSchemeName => {
  const theme = useColorScheme();
  switch (mode) {
    case AppearanceMode.SYSTEM:
      return theme;
    case AppearanceMode.LIGHT:
      return 'light';
    case AppearanceMode.DARK:
      return 'dark';
  }
};

export const AppearanceContext = React.createContext<
  | {
      mode: AppearanceMode;
      setMode: React.Dispatch<React.SetStateAction<AppearanceMode>>;
    }
  | undefined
>(undefined);

export const useAppearanceMode = () => {
  const ctx = React.useContext(AppearanceContext);
  if (ctx == null)
    throw Error('This component is not a child of AppearanceContext');
  return ctx;
};

export const AppearanceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = React.useState(AppearanceMode.SYSTEM);
  const colorScheme = useAppearanceColorScheme(mode);
  const theme = React.useMemo(
    () =>
      createTheme<Theme>(({ color, colorConstant, definePalette }) => ({
        mode: colorScheme,
        palette: {
          mangaViewerBackButtonColor: colorConstant('#fafafa'),
          skeleton: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
          borderColor: color('#444444', '#CCCCCC'),
          action: {
            ripple: color('#606060', '#C4C4C4'),
          },
          primary: {
            light: colorConstant('#69c0ff'),
            main: colorConstant('#1890ff'),
            dark: colorConstant('#0050b3'),
          },
          secondary: {
            light: colorConstant('#EE4B2B'),
            main: colorConstant('#D22B2B'),
            dark: colorConstant('#AA4A44'),
          },
          error: {
            main: color('#f44336', '#d32f2f'),
            light: color('#e57373', '#ef5350'),
            dark: color('#d32f2f', '#c62828'),
          },
          warning: {
            main: color('#ed6c02', '#ffa726'),
            light: color('#ff9800', '#ffb74d'),
            dark: color('#e65100', '#f57c00'),
          },
          text: {
            primary: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
            secondary: color('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.6)'),
            disabled: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
            hint: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
          },
          background: {
            default: color('#000000', '#fafafa'),
            paper: color('#111111', '#ffffff'),
            disabled: color('#232323', '#EFEFEF'),
          },
          status: {
            ongoing: color('#73d13d', '#b7eb8f'),
            hiatus: color('#ffc53d', '#ffe58f'),
            discontinued: color('#f5222d', '#ff7875'),
            completed: color('#434343', '#8c8c8c'),
          },
        },
        style: {
          borderRadius: moderateScale(24),
          spacing,
          shadow,
        },
        typography,
        helpers,
        __react_navigation__: {
          dark: mode === AppearanceMode.DARK,
          colors: definePalette<(typeof NavigationDefaultTheme)['colors']>({
            ...Object.entries(NavigationDefaultTheme.colors).reduce(
              (prev, [key, value]) => {
                prev[key as keyof typeof NavigationDefaultTheme.colors] =
                  colorConstant(value);
                return prev;
              },
              {} as UserDefinedPalette<typeof NavigationDefaultTheme.colors>,
            ),
            primary: colorConstant('#1890ff'),
            background: color('#141414', '#fafafa'),
            text: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
          }),
        },
      })),

    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <MenuProvider>
        <DialogProvider>
          <PortalProvider>
            <NavigationContainer theme={theme.__react_navigation__}>
              <AppearanceContext.Provider value={{ mode, setMode }}>
                {children}
              </AppearanceContext.Provider>
            </NavigationContainer>
          </PortalProvider>
        </DialogProvider>
      </MenuProvider>
    </ThemeProvider>
  );
};
