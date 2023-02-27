import Realm from 'realm';
import React from 'react';
import useAuth0 from '@hooks/useAuth0';
import { app } from '../main';
import useMountedEffect from '@hooks/useMountedEffect';

export const useCurrentUserFromRealm = () => React.useContext(UserContext);

const UserContext = React.createContext<Realm.User<
  Realm.DefaultFunctionsFactory,
  SimpleObject,
  Realm.DefaultUserProfileData
> | null>(null);

export const RealmUserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user, getCredentials } = useAuth0();
  const [realmUser, setRealmUser] = React.useState<Realm.User<
    Realm.DefaultFunctionsFactory,
    SimpleObject,
    Realm.DefaultUserProfileData
  > | null>(null);
  async function initialize() {
    try {
      const credentials = await getCredentials();
      const idToken = credentials.idToken;
      if (idToken != null) {
        const user = await app.logIn(Realm.Credentials.jwt(idToken));
        if (realmUser != null) app.switchUser(user);
        setRealmUser(user);
      } else {
        const user = await app.logIn(Realm.Credentials.anonymous());
        if (realmUser != null) app.switchUser(user);
        setRealmUser(user);
      }
    } catch (e) {
      const user = await app.logIn(Realm.Credentials.anonymous());
      if (realmUser != null) app.switchUser(user);
      setRealmUser(user);
    }
  }

  React.useEffect(() => {
    const shouldInitialize = realmUser == null;
    if (shouldInitialize) initialize();
  }, [realmUser]);
  useMountedEffect(() => {
    console.log('Called from useMountedEffect');
    initialize();
  }, [user]);

  // React.useEffect(() => {
  //   console.log({ id: realmUser?.id, name: user?.name });
  // }, [realmUser]);

  return (
    <UserContext.Provider value={realmUser}>{children}</UserContext.Provider>
  );
};
