/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from '@navigators/Root';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import { createTheme } from '@mangayomu/theme';

function App(): JSX.Element {
  const mode = useColorScheme();
  const theme = createTheme(({ color, colorConstant }) => ({
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
      borderRadius: 24,
    },
  }));
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="MangaView" component={MangaView} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
