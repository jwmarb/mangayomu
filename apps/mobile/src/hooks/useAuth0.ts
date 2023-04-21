import {
  useAuth0 as useAuth0_,
  Auth0ContextInterface as Auth0ContextInterface_,
  AuthorizeParams,
  AuthorizeOptions,
} from 'react-native-auth0';
import React from 'react';
import Realm from 'realm';
import { useApp, useUser } from '@realm/react';

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
      } finally {
        try {
          if (realmUser?.isLoggedIn) realmUser?.logOut();
          const credentials = await getCredentials();
          await app.logIn(Realm.Credentials.jwt(credentials.idToken!));
        } catch (e) {
          console.error(e);
        } finally {
          console.log('Authorized user through Auth0 and Realm');
        }
      }
    },
    [_authorize, getCredentials, app],
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
