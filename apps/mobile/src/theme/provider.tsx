import React from 'react';
import { ColorSchemeName, StatusBar, useColorScheme } from 'react-native';

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
import { useMMKV } from 'react-native-mmkv';

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
      setMode: (setter: AppearanceMode) => void;
    }
  | undefined
>(undefined);

export const useAppearanceMode = () => {
  const ctx = React.useContext(AppearanceContext);
  if (ctx == null)
    throw Error('This component is not a child of AppearanceContext');
  return ctx;
};

const DEVICE_THEME = 'device_theme';

export const AppearanceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mmkv = useMMKV();
  const [mode, _setMode] = React.useState<AppearanceMode>(() => {
    const savedValue = mmkv.getString(DEVICE_THEME);
    if (savedValue == null) {
      mmkv.set(DEVICE_THEME, AppearanceMode.SYSTEM);
      return AppearanceMode.SYSTEM;
    }
    return savedValue as AppearanceMode;
  });
  const setMode = React.useCallback(
    (setter: AppearanceMode) => {
      mmkv.set(DEVICE_THEME, setter);
      _setMode(setter);
    },
    [_setMode, mmkv],
  );
  React.useEffect(() => {
    switch (mode) {
      case AppearanceMode.DARK:
        StatusBar.setBarStyle('light-content', true);
        break;
      case AppearanceMode.LIGHT:
        StatusBar.setBarStyle('dark-content', true);
        break;
      case AppearanceMode.SYSTEM:
        StatusBar.setBarStyle('default', true);
        break;
    }
  }, [mode]);
  const providedContextValue = React.useMemo(
    () => ({ mode, setMode }),
    [mode, setMode],
  );
  const colorScheme = useAppearanceColorScheme(mode);
  const theme = React.useMemo(
    () =>
      createTheme<Theme>(({ color, colorConstant, definePalette }) => ({
        mode: colorScheme,
        palette: {
          mangaViewerBackButtonColor: colorConstant('#fafafa'),
          skeleton: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
          borderColor: color('rgba(160, 160, 160, 0.1)', '#CCCCCC'),
          action: {
            ripple: color('#606060', '#C4C4C4'),
          },
          primary: {
            light: color('#B2CBE6', '#34A1FB'),
            main: color('#8DB1D8', '#1996FD'),
            dark: color('#6897CA', '#066EC4'),
          },
          secondary: {
            light: color('#DAA2B7', '#EC8F43'),
            main: color('#D290A9', '#E57417'),
            dark: color('#BA5B7F', '#B55D14'),
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
            default: color('#071113', '#fafafa'),
            paper: color('#09181A', '#ffffff'),
            disabled: color('#102A2D', '#EFEFEF'),
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
          borderWidth: moderateScale(2),
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
            primary: color('#8DB1D8', '#1996FD'),
            background: color('#071113', '#fafafa'),
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
              <AppearanceContext.Provider value={providedContextValue}>
                {children}
              </AppearanceContext.Provider>
            </NavigationContainer>
          </PortalProvider>
        </DialogProvider>
      </MenuProvider>
    </ThemeProvider>
  );
};
