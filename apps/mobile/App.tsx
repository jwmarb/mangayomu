/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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
import { UserProvider, AppProvider } from '@realm/react';
import { REACT_APP_REALM_ID } from '@env';
import { RealmEffect } from '@database/providers/RealmProvider';
import { AppearanceProvider } from '@theme/provider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ImageResolver } from '@redux/slices/imageresolver';
enableFreeze(true);

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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppProvider id={REACT_APP_REALM_ID}>
              <UserProvider fallback={<RealmUserProvider />}>
                <RealmProvider
                  sync={{
                    flexible: true,
                    onError: (_, error) => {
                      console.error(error);
                    },
                    clientReset: {
                      mode: Realm.ClientResetMode.Manual,
                      onManual: () => {
                        console.log('recovery initiated');
                      },
                    },
                  }}
                >
                  <LocalRealmProvider>
                    <RealmEffect>
                      <AppearanceProvider>
                        <ImageResolver>
                          <Root />
                        </ImageResolver>
                      </AppearanceProvider>
                    </RealmEffect>
                  </LocalRealmProvider>
                </RealmProvider>
              </UserProvider>
            </AppProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </>
  );
}

export default App;
