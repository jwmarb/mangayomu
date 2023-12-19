/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Realm from 'realm';
import { AppState, AppStateStatus, StatusBar } from 'react-native';
import 'react-native-get-random-values';
import { Provider } from 'react-redux';
import Root from './src/Root';
import { store, persistor } from '@redux/main';
import { PersistGate } from 'redux-persist/integration/react';
import { enableFreeze } from 'react-native-screens';
import {
  LocalRealmProvider,
  RealmProvider,
  RealmUserProvider,
} from '@database/main';
import { REACT_APP_REALM_ID } from '@env';
import { RealmEffect } from '@database/providers/RealmProvider';
import { AppearanceProvider } from '@theme/appearanceprovider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ImageResolver } from '@redux/slices/imageresolver';
import SyncData from './src/context/SyncData';
import { AppProvider, UserProvider } from '@realm/react';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorFallback from '@components/ErrorFallback';
import ThemeProvider from '@theme/themeprovider';
enableFreeze(true);

const sync: Partial<Realm.SyncConfiguration> = {
  flexible: true,
  onError: (_, error) => {
    console.error(error);
  },
  clientReset: {
    mode: Realm.ClientResetMode.RecoverUnsyncedChanges,
  },
};

function App(): JSX.Element {
  React.useEffect(() => {
    function handleMemoryWarning(e: AppStateStatus) {
      console.log(`memoryWarning:: ${e}`);
    }
    const subscription = AppState.addEventListener(
      'memoryWarning',
      handleMemoryWarning,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaProvider>
        <ThemeProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppProvider id={REACT_APP_REALM_ID}>
                  <UserProvider fallback={<RealmUserProvider />}>
                    <RealmProvider sync={sync}>
                      <LocalRealmProvider>
                        <RealmEffect>
                          <ImageResolver>
                            <SyncData>
                              <AppearanceProvider>
                                <Root />
                              </AppearanceProvider>
                            </SyncData>
                          </ImageResolver>
                        </RealmEffect>
                      </LocalRealmProvider>
                    </RealmProvider>
                  </UserProvider>
                </AppProvider>
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}

export default App;
