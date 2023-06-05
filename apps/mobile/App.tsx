/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppState, AppStateStatus, StatusBar } from 'react-native';

import { Provider } from 'react-redux';
import Root from './src/Root';
import { store, persistor } from '@redux/main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Auth0Provider } from 'react-native-auth0';
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
enableFreeze(true);
enum Auth0 {
  DOMAIN = 'dev-wq6wbghv.us.auth0.com',
  CLIENT_ID = '2dLESXiDyJFgpzKU2FYZJKb0s9yzXWX8',
}

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Auth0Provider domain={Auth0.DOMAIN} clientId={Auth0.CLIENT_ID}>
              <AppProvider id={REACT_APP_REALM_ID}>
                <UserProvider fallback={<RealmUserProvider />}>
                  <RealmProvider
                    sync={{
                      flexible: true,
                      onError: (_, error) => {
                        console.error(error);
                      },
                    }}
                  >
                    <LocalRealmProvider>
                      <RealmEffect>
                        <AppearanceProvider>
                          <Root />
                        </AppearanceProvider>
                      </RealmEffect>
                    </LocalRealmProvider>
                  </RealmProvider>
                </UserProvider>
              </AppProvider>
            </Auth0Provider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
