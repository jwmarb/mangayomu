'use client';
import React from 'react';
import * as Realm from 'realm-web';

const RealmContext = React.createContext<ReturnType<
  typeof Realm.App.getApp
> | null>(null);

export const useRealm = () => {
  const ctx = React.useContext(RealmContext);
  if (ctx == null)
    throw new Error(
      'Tried using RealmContext when component is not a child of it',
    );

  return ctx;
};

interface RealmProviderProps extends React.PropsWithChildren {
  appId: string;
}

export function ClientRealmProvider({ children, appId }: RealmProviderProps) {
  const [app, setApp] = React.useState<ReturnType<
    typeof Realm.App.getApp
  > | null>(null);
  React.useEffect(() => {
    setApp(Realm.App.getApp(appId));
  }, [appId]);
  if (app == null) return null;
  return <RealmContext.Provider value={app}>{children}</RealmContext.Provider>;
}
