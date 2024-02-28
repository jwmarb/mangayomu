import Realm from 'realm';
import React from 'react';
import { useApp } from '@realm/react';

export const RealmUserProvider: React.FC = () => {
  const app = useApp();
  async function initialize() {
    await app.logIn(Realm.Credentials.anonymous());
  }

  React.useEffect(() => {
    initialize();
  }, []);

  return null;
};
