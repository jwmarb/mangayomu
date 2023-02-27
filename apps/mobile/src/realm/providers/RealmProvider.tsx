import { ChapterSchema } from '@database/schemas/Chapter';
import { createRealmContext } from '@realm/react';
import {
  MangaSchema,
  MangaRatingSchema,
  MangaStatusSchema,
} from '../schemas/Manga';
import Realm from 'realm';
import React from 'react';
import { createUseObject } from '@realm/react/dist/useObject';
import { createUseQuery } from '@realm/react/dist/useQuery';
import { createUseRealm } from '@realm/react/dist/useRealm';
import { useCurrentUserFromRealm } from '@database/providers/UserProvider';

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
        schemaVersion: 35,
        sync: {
          user: currentUser,
          // partitionValue: currentUser.id,
          flexible: true,
          initialSubscriptions: {
            update(subs, realm) {
              subs.add(
                realm
                  .objects<MangaSchema>('Manga')
                  .filtered(`_realmId == "${currentUser.id}"`),
              );
              subs.add(
                realm
                  .objects<ChapterSchema>('Chapter')
                  .filtered(`_realmId == "${currentUser.id}"`),
              );
            },
          },
        } as Realm.SyncConfiguration,
      };

      const initRealm = async () => {
        const openedRealm = await Realm.open(configuration);
        setRealm(openedRealm);
      };

      initRealm().catch(console.error);
      return () => {
        if (realm != null) {
          realm.close();
          setRealm(null);
        }
      };
    }
  }, [currentUser, setRealm]);

  if (realm == null) return null;
  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
};

export const RealmEffect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mangas = useQuery(MangaSchema);
  const realm = useRealm();
  const user = useCurrentUserFromRealm();

  const callback: Realm.CollectionChangeCallback<
    MangaSchema & Realm.Object<unknown, never>
  > = React.useCallback((collection, changes) => {
    for (const index of changes.newModifications) {
      const { inLibrary, title } = collection[index];
      console.log(`${user?.deviceId} - ${title}`);
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
