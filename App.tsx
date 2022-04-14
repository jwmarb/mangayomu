import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from '@redux/store';
import Root from './src/Root';
import { ThemeProvider } from 'styled-components/native';
import theme from '@theme/core';
import ResourceLoader from '@utils/ResourceLoader';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  const generated = theme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ResourceLoader
          onFinishedLoading={
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <NavigationThemeProvider value={generated['@react-navigation']}>
                  <ThemeProvider theme={generated}>
                    <Root />
                    <StatusBar translucent />
                  </ThemeProvider>
                </NavigationThemeProvider>
              </PersistGate>
            </Provider>
          }
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
