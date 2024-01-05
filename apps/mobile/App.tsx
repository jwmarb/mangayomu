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
import SyncData from './src/context/SyncData';
import { AppProvider, UserProvider } from '@realm/react';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorFallback from '@components/ErrorFallback';
import ThemeProvider from '@theme/themeprovider';
import { getErrorMessage } from '@helpers/getErrorMessage';
import RNFetchBlob from 'rn-fetch-blob';
import { IMAGE_CACHE_DIR } from 'env';
enableFreeze(true);

const realmConfiguration: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately,
};

const sync: Partial<Realm.SyncConfiguration> = {
  flexible: true,
  onError: (_, error) => {
    if (error instanceof Realm.SyncError)
      console.log({
        code: error.code,
        message: error.message,
        type: 'SyncError',
      });
    else
      console.log({
        type: 'ClientResetError',
        message: getErrorMessage(error),
      });
  },
  clientReset: {
    mode: Realm.ClientResetMode.RecoverOrDiscardUnsyncedChanges,
  },

  newRealmFileBehavior: realmConfiguration,
  existingRealmFileBehavior: realmConfiguration,
};

function App(): JSX.Element {
  React.useEffect(() => {
    RNFetchBlob.fs.exists(IMAGE_CACHE_DIR).then((exists) => {
      if (!exists)
        RNFetchBlob.fs
          .mkdir(IMAGE_CACHE_DIR)
          .then(() => console.log('Created image cache directory'))
          .catch(() => console.error('Failed to create image cache directory'));
    });
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
                          <SyncData>
                            <AppearanceProvider>
                              <Root />
                            </AppearanceProvider>
                          </SyncData>
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
