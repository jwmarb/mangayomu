'use client';
import React from 'react';
import * as Realm from 'realm-web';
import { useRouter } from 'next/navigation';
import { EmbeddedResponseStatus } from '@mangayomu/request-handler';

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
  authToken?: string;
}

type SessionResponse = {
  response: EmbeddedResponseStatus;
  data: unknown;
};

export function ClientRealmProvider({
  children,
  appId,
  authToken,
}: RealmProviderProps) {
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
      if (_app.currentUser == null || authToken == null) {
        const credentials = Realm.Credentials.anonymous();
        const user = await _app.logIn(credentials);
        setUser(user);
      } else {
        const response = await fetch('/api/v1/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_token: authToken }),
        });
        const isAuth: SessionResponse = await response.json();
        switch (isAuth.response.status_code) {
          case 200:
            setUser(_app.currentUser);
            break;
          default:
            router.push('/login');
            break;
        }
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
