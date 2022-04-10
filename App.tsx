import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import store from '@redux/store';
import Root from './src/Root';
import { ThemeProvider } from 'styled-components/native';
import theme from '@theme/core';
import ResourceLoader from '@utils/ResourceLoader';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ResourceLoader
          onFinishedLoading={
            <Provider store={store}>
              <ThemeProvider theme={theme()}>
                <Root />
                <StatusBar translucent />
              </ThemeProvider>
            </Provider>
          }
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
