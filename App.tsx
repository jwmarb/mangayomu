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
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { RootSiblingParent } from 'react-native-root-siblings';
import { PortalProvider } from '@gorhom/portal';
import { LogBox } from 'react-native';
import '@services/MangaPark_v3';
import '@services/MangaSee';
import ExpoStorage from '@utils/ExpoStorage';

LogBox.ignoreLogs([
  `ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.`,
]);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ResourceLoader
          onFinishedLoading={
            <>
              <PortalProvider>
                <Root />
              </PortalProvider>
              <StatusBar translucent />
            </>
          }
        />
      </PersistGate>
    </Provider>
  );
}
