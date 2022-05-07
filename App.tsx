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
import { HoldMenuProvider } from 'react-native-hold-menu';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RootSiblingParent } from 'react-native-root-siblings';
import { PortalProvider } from '@gorhom/portal';
import '@services/MangaPark_v3';
import '@services/MangaSee';

export default function App() {
  const generated = theme();
  return (
    <ThemeProvider theme={generated}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RootSiblingParent>
            <ResourceLoader
              onFinishedLoading={
                <HoldMenuProvider iconComponent={FeatherIcon} theme={generated.palette.mode ?? 'light'}>
                  <Provider store={store}>
                    <PersistGate persistor={persistor}>
                      <NavigationThemeProvider value={generated['@react-navigation']}>
                        <PortalProvider>
                          <Root />
                        </PortalProvider>
                        <StatusBar translucent />
                      </NavigationThemeProvider>
                    </PersistGate>
                  </Provider>
                </HoldMenuProvider>
              }
            />
          </RootSiblingParent>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
