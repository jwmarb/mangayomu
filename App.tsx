import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from '@redux/store';
import Root from './src/Root';
import { ThemeProvider } from 'styled-components/native';
import theme from '@theme/core';
import ResourceLoader from '@utils/ResourceLoader';
import ExpoStatusBar from '@utils/ExpoStatusBar';
import 'react-native-gesture-handler';
import { PersistGate } from 'redux-persist/integration/react';
import { PortalProvider } from '@gorhom/portal';
import { LogBox } from 'react-native';
import '@services/MangaPark_v3';
import '@services/MangaSee';
import { MenuProvider } from 'react-native-popup-menu';
LogBox.ignoreLogs([
  `ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.`,
]);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ResourceLoader
          onFinishedLoading={
            <MenuProvider>
              <PortalProvider>
                <Root />
              </PortalProvider>
              <ExpoStatusBar />
            </MenuProvider>
          }
        />
      </PersistGate>
    </Provider>
  );
}
