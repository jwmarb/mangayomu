'use client';
import React from 'react';
import * as Realm from 'realm-web';
import jwt from 'jsonwebtoken';
import { usePathname, useRouter } from 'next/navigation';

const RealmContext = React.createContext<ReturnType<
  typeof Realm.App.getApp
> | null>(null);

const UserContext = React.createContext<Realm.User | null>(null);

const UserSetterContext = React.createContext<React.Dispatch<
  React.SetStateAction<Realm.User | null>
> | null>(null);

export const useRealm = () => {
  const ctx = React.useContext(RealmContext);
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
  idToken?: string;
  idTokenInvalid?: boolean;
}

export function ClientRealmProvider({
  children,
  appId,
  idToken,
  idTokenInvalid,
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
      if (_app.currentUser == null) {
        /** If they have the id_token still with them, log them in using that instead */
        const credentials =
          idToken != null
            ? Realm.Credentials.jwt(idToken)
            : Realm.Credentials.anonymous();
        const user = await _app.logIn(credentials);
        setUser(user);
      } else {
        if (idToken == null && idTokenInvalid) {
          /** If the user has no idToken and they're still logged into realm, log them out */
          if (_app.currentUser.isLoggedIn) await _app.currentUser.logOut();

          /** Then assign an anonymous user and redirect them to login, reminding them that their session expired */
          const anonymousCredentials = Realm.Credentials.anonymous();
          await _app.logIn(anonymousCredentials); // assigns null to _app.currentUser
          router.push('/login?auth_error=session_expired');
        }
        setUser(_app.currentUser);
      }
    })();

    // if (idToken != null) {
    //   const jwtCredentials = Realm.Credentials.jwt(idToken);

    //   _app
    //     .logIn(jwtCredentials)
    //     .then(setUser)
    //     .finally(() => {
    //       console.log('Successfully logged in with jwt');
    //     });
    // } else if (_app.currentUser == null) {
    //   const anonymousCredentials = Realm.Credentials.anonymous();
    //   _app.logIn(anonymousCredentials).then(setUser);
    // } else setUser(_app.currentUser);
  }, [appId, idToken]);

  if (app == null || user == null) return null;
  return (
    <RealmContext.Provider value={app}>
      <UserContext.Provider value={user}>
        <UserSetterContext.Provider value={setUser}>
          {children}
        </UserSetterContext.Provider>
      </UserContext.Provider>
    </RealmContext.Provider>
  );
}
