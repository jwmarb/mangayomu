import {
  useAuth0 as useAuth0_,
  Auth0ContextInterface as Auth0ContextInterface_,
  AuthorizeParams,
  AuthorizeOptions,
} from 'react-native-auth0';
import React from 'react';
import { app } from '@database/main';
import Realm from 'realm';

interface User {
  name: string;
  picture: string;
  email: string;
}

interface Auth0ContextInterface extends Auth0ContextInterface_ {
  user: User;
}

/**
 * Same as useAuth0 from `react-native-auth0` but overrides property `user`
 * @returns Returns authentication
 */
export default function useAuth0(): Auth0ContextInterface {
  return useAuth0_();
}
