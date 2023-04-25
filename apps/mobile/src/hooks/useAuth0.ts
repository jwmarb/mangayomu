import {
  useAuth0 as useAuth0_,
  Auth0ContextInterface as Auth0ContextInterface_,
} from 'react-native-auth0';
import React from 'react';
import Realm from 'realm';
import { useApp, useUser } from '@realm/react';
import { getErrorMessage } from '@helpers/getErrorMessage';

interface User {
  name: string;
  picture: string;
  email: string;
  sub: string;
}

interface Auth0ContextInterface extends Auth0ContextInterface_ {
  user: User;
}

/**
 * Same as useAuth0 from `react-native-auth0` but overrides property `user`
 * @returns Returns authentication
 */
export default function useAuth0(): Auth0ContextInterface {
  const {
    authorize: _authorize,
    requireLocalAuthentication,
    clearCredentials,
    clearSession: _clearSession,
    user,
    isLoading,
    getCredentials,
    error,
  } = useAuth0_();
  const app = useApp();
  const realmUser = useUser();
  const authorize = React.useCallback(
    async (...params: Parameters<typeof _authorize>) => {
      try {
        await _authorize(...params);
      } catch (e) {
        console.error(e);
      }
      try {
        const credentials = await getCredentials();
        if (
          credentials != null &&
          credentials.idToken != null &&
          app.currentUser != null
        ) {
          const isAnonymousUser = app.currentUser.providerType === 'anon-user';
          const realmCredentials = Realm.Credentials.jwt(credentials.idToken);
          if (isAnonymousUser || !app.currentUser.isLoggedIn)
            await app.logIn(realmCredentials);
        } else
          throw Error(
            `Failed to get user credentials. credentials = ${JSON.stringify(
              credentials,
            )}`,
          );
      } catch (e: unknown) {
        throw Error(getErrorMessage(e));
      }
    },
    [_authorize, getCredentials, app.currentUser],
  );

  const clearSession = React.useCallback(async () => {
    if (realmUser == null) {
      console.warn('Tried to clearSession when realmUser does not exist');
      return;
    }
    try {
      await _clearSession();
      await realmUser.logOut();
    } catch (e) {
      console.error(e);
    } finally {
      console.log('Successfully executed clearSession');
    }
  }, [_clearSession, realmUser]);
  return {
    authorize,
    requireLocalAuthentication,
    clearCredentials,
    clearSession,
    user,
    isLoading,
    getCredentials,
    error,
  };
}
