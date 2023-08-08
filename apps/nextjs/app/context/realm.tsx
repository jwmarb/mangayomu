'use client';
import React from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';

const AppContext = React.createContext<ReturnType<
  typeof Realm.App.getApp
> | null>(null);

const UserContext = React.createContext<Realm.User | null>(null);

const UserSetterContext = React.createContext<React.Dispatch<
  React.SetStateAction<Realm.User | null>
> | null>(null);

export const useApp = () => {
  const ctx = React.useContext(AppContext);
  if (ctx == null)
    throw new Error(
      'Tried using RealmContext when component is not a child of it',
    );

  return ctx;
};

export const useUser = () => {
  const ctx = React.useContext(UserContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming UserContext value when component is not a child of it',
    );
  return ctx;
};

export const useUserSetter = () => {
  const ctx = React.useContext(UserSetterContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming UserSetterContext value when component is not a child of it',
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
  const [user, setUser] = React.useState<Realm.User | null>(
    app?.currentUser || null,
  );

  const router = useRouter();
  React.useEffect(() => {
    const _app = Realm.App.getApp(appId);
    setApp(_app);

    (async () => {
      if (_app.currentUser == null) {
        const credentials = Realm.Credentials.anonymous();
        const user = await _app.logIn(credentials);
        setUser(user);
      } else {
        setUser(_app.currentUser);
      }
    })();
  }, [appId, router]);

  if (app == null || user == null) return null;
  return (
    <AppContext.Provider value={app}>
      <UserContext.Provider value={user}>
        <UserSetterContext.Provider value={setUser}>
          {children}
        </UserSetterContext.Provider>
      </UserContext.Provider>
    </AppContext.Provider>
  );
}
