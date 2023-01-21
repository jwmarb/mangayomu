/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createTheme } from '@mangayomu/theme';
import { ThemeProvider, Theme } from '@emotion/react';
import { shadow, spacing, typography } from '@theme/theme';
import { helpers } from '@theme/helpers';
import { Provider } from 'react-redux';
import Root from './src/Root';
import store from '@redux/main';
import { moderateScale } from 'react-native-size-matters';

function App(): JSX.Element {
  const mode = useColorScheme();
  const theme = createTheme<Theme>(({ color, colorConstant }) => ({
    mode,
    palette: {
      primary: {
        light: colorConstant('#69c0ff'),
        main: colorConstant('#1890ff'),
        dark: colorConstant('#0050b3'),
      },
      secondary: {
        light: colorConstant('#ffa39e'),
        main: colorConstant('#ff7875'),
        dark: colorConstant('#ff4d4f'),
      },
      text: {
        primary: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
        secondary: color('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.6)'),
        disabled: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
        hint: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
      },
      background: {
        default: color('#141414', '#fafafa'),
        paper: color('#262626', '#ffffff'),
      },
    },
    style: {
      borderRadius: moderateScale(24),
      spacing,
      shadow,
    },
    typography,
    helpers,
  }));

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Provider store={store}>
            <Root />
          </Provider>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
}

export default App;
