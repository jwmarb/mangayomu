import { ChapterSchema } from '@database/schemas/Chapter';
import { createRealmContext } from '@realm/react';
import {
  MangaSchema,
  MangaRatingSchema,
  MangaStatusSchema,
} from './schemas/Manga';
import Realm from 'realm';
import React from 'react';
import { REACT_APP_REALM_ID } from '@env';
import useAuth0 from '@hooks/useAuth0';
import { createUseObject } from '@realm/react/dist/useObject';
import { createUseQuery } from '@realm/react/dist/useQuery';
import { createUseRealm } from '@realm/react/dist/useRealm';
import { Text } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';

export const app = new Realm.App({ id: REACT_APP_REALM_ID });

export const { currentUser } = app;

// export const { RealmProvider, useRealm, useQuery, useObject } =
//   createRealmContext({
//     schema: [MangaSchema, ChapterSchema, MangaRatingSchema, MangaStatusSchema],
//     schemaVersion: 29,
//     sync:
//       currentUser != null
//         ? ({
//             user: currentUser,
//             flexible: true,
//             initialSubscriptions: {
//               update(subs, realm) {
//                 subs.add(
//                   realm
//                     .objects<MangaSchema>('Manga')
//                     .filtered(`realmId === "${currentUser.id}"`),
//                 );
//                 subs.add(
//                   realm
//                     .objects<ChapterSchema>('Chapter')
//                     .filtered(`realmId === "${currentUser.id}"`),
//                 );
//               },
//             },
//           } as Realm.SyncConfiguration)
//         : undefined,
//   });

const UserContext = React.createContext<Realm.User<
  Realm.DefaultFunctionsFactory,
  SimpleObject,
  Realm.DefaultUserProfileData
> | null>(currentUser);

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
        setRealmUser(user);
      } else {
        const user = await app.logIn(Realm.Credentials.anonymous());
        setRealmUser(user);
      }
    } catch (e) {
      console.error(e);
      const user = await app.logIn(Realm.Credentials.anonymous());
      setRealmUser(user);
    }
  }

  React.useEffect(() => {
    const shouldInitialize = realmUser == null;
    if (shouldInitialize) initialize();
  }, [realmUser]);

  // React.useEffect(() => {
  //   console.log({ id: realmUser?.id, name: user?.name });
  // }, [realmUser]);

  return (
    <UserContext.Provider value={realmUser}>{children}</UserContext.Provider>
  );
};
export const useCurrentUserFromRealm = () => React.useContext(UserContext);
const RealmContext = React.createContext<Realm | null>(null);

export const useRealm = createUseRealm(RealmContext);
export const useObject = createUseObject(useRealm);
export const useQuery = createUseQuery(useRealm);

export const RealmProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const currentUser = useCurrentUserFromRealm();
  const [realm, setRealm] = React.useState<Realm | null>(null);

  React.useEffect(() => {
    if (currentUser != null) {
      const configuration: Realm.Configuration = {
        schema: [
          MangaSchema,
          ChapterSchema,
          MangaRatingSchema,
          MangaStatusSchema,
        ],
        schemaVersion: 33,
        sync: {
          user: currentUser,
          partitionValue: currentUser.id,
          // flexible: true,
          // initialSubscriptions: {
          //   update(subs, realm) {
          //     subs.add(
          //       realm
          //         .objects<MangaSchema>('Manga')
          //         .filtered(`_realmId == '${currentUser.id}'`),
          //     );
          //     subs.add(
          //       realm
          //         .objects<ChapterSchema>('Chapter')
          //         .filtered(`_realmId == '${currentUser.id}'`),
          //     );
          //   },
          // },
        } as Realm.SyncConfiguration,
      };

      const shouldInitRealm = realm == null;
      const initRealm = async () => {
        const openedRealm = await Realm.open(configuration);
        setRealm(openedRealm);
      };

      if (shouldInitRealm) initRealm().catch(console.error);
      return () => {
        if (realm != null) {
          realm.close();
          setRealm(null);
        }
      };
    }
  }, [currentUser, realm, setRealm]);

  if (realm == null) return null;
  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
};

export const RealmEffect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mangas = useQuery(MangaSchema);

  const callback: Realm.CollectionChangeCallback<
    MangaSchema & Realm.Object<unknown, never>
  > = React.useCallback((collection, changes) => {
    for (const index of changes.newModifications) {
      const { inLibrary, title } = collection[index];
      console.log(`${title} = ${inLibrary}`);
    }
  }, []);

  React.useEffect(() => {
    mangas.addListener(callback);
    return () => {
      mangas.removeListener(callback);
    };
  }, []);
  return <>{children}</>;
};
