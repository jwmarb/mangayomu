/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from '@navigators/Root';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import { createTheme } from '@mangayomu/theme';
import { ThemeProvider, Theme } from '@emotion/react';
import { RFValue } from 'react-native-responsive-fontsize';
import { typography } from '@theme/theme';
import { helpers } from '@theme/helpers';

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
      borderRadius: RFValue(24),
      spacing: {
        s: 2,
        m: 6,
        l: 10,
        xl: 16,
      },
    },
    typography,
    helpers,
  }));

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen name="Home" component={Home} />
            <RootStack.Screen name="MangaView" component={MangaView} />
          </RootStack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
}

export default App;
