/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createTheme, UserDefinedPalette } from '@mangayomu/theme';
import { ThemeProvider, Theme } from '@emotion/react';
import { shadow, spacing, typography } from '@theme/theme';
import { helpers } from '@theme/helpers';
import { Provider } from 'react-redux';
import Root from './src/Root';
import { store, persistor } from '@redux/main';
import { moderateScale } from 'react-native-size-matters';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Auth0Provider } from 'react-native-auth0';
import { PersistGate } from 'redux-persist/integration/react';
import { PortalProvider } from '@gorhom/portal';
import { MenuProvider } from 'react-native-popup-menu';
import { enableFreeze } from 'react-native-screens';
import { MangaRealmProvider } from '@realm/schemas/Manga';
enableFreeze(true);
enum Auth0 {
  DOMAIN = 'dev-wq6wbghv.us.auth0.com',
  CLIENT_ID = '2dLESXiDyJFgpzKU2FYZJKb0s9yzXWX8',
}

function App(): JSX.Element {
  const mode = useColorScheme();
  const theme = React.useMemo(
    () =>
      createTheme<Theme>(({ color, colorConstant, definePalette }) => ({
        mode,
        palette: {
          skeleton: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
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
        },
        style: {
          borderRadius: moderateScale(24),
          spacing,
          shadow,
        },
        typography,
        helpers,
        __react_navigation__: {
          dark: mode === 'dark',
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
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Auth0Provider domain={Auth0.DOMAIN} clientId={Auth0.CLIENT_ID}>
          <MangaRealmProvider>
            <ThemeProvider theme={theme}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <MenuProvider>
                    <PortalProvider>
                      <NavigationContainer theme={theme.__react_navigation__}>
                        <Root />
                      </NavigationContainer>
                    </PortalProvider>
                  </MenuProvider>
                </PersistGate>
              </Provider>
            </ThemeProvider>
          </MangaRealmProvider>
        </Auth0Provider>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
