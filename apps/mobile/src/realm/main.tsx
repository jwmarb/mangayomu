import Realm from 'realm';
import { REACT_APP_REALM_ID } from '@env';
export * from './providers/UserProvider';
export * from './providers/RealmProvider';

export const app = new Realm.App({ id: REACT_APP_REALM_ID });

export const { currentUser } = app;
