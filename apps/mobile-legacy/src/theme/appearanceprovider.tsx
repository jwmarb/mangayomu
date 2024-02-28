import React from 'react';
import { ColorSchemeName, StatusBar, useColorScheme } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createTheme, UserDefinedPalette } from '@mangayomu/theme';
import { Theme, ThemeProvider, useTheme } from '@emotion/react';
import { shadow, spacing, typography } from '@theme/theme';
import { helpers } from '@theme/helpers';
import { moderateScale } from 'react-native-size-matters';
import { useMMKV } from 'react-native-mmkv';
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

export const AppearanceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const theme = useTheme();

  return (
    <MenuProvider>
      <DialogProvider>
        <PortalProvider>
          <NavigationContainer theme={theme.__react_navigation__}>
            {children}
          </NavigationContainer>
        </PortalProvider>
      </DialogProvider>
    </MenuProvider>
  );
};
