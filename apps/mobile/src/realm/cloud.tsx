import Realm from 'realm';
import React from 'react';
import { createUseRealm } from '@realm/react/dist/useRealm';
import { createUseObject } from '@realm/react/dist/useObject';
import { createUseQuery } from '@realm/react/dist/useQuery';
import { CloudMangaSchema } from '@database/schemas/CloudManga';
import { useCurrentUserFromRealm, useQuery, useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';

const RealmCloudContext = React.createContext<Realm | null>(null);
export const useCloudRealm = createUseRealm(RealmCloudContext);
export const useCloudObject = createUseObject(useCloudRealm);
export const useCloudQuery = createUseQuery(useCloudRealm);

export const RealmCloudProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const currentUser = useCurrentUserFromRealm();
  const [realm, setRealm] = React.useState<Realm | null>(null);
  const currentRealm = React.useRef<Realm | null>(null);

  React.useEffect(() => {
    currentRealm.current = realm;
  }, [realm]);

  React.useEffect(() => {
    if (currentUser != null) {
      const configuration: Realm.Configuration = {
        schema: [CloudMangaSchema],
        schemaVersion: 2,
        path: Realm.defaultPath.replace('default.realm', 'cloud.realm'),
        // sync: {
        //   user: currentUser,
        //   flexible: true,
        //   initialSubscriptions: {
        //     update(subs, realm) {
        //       subs.add(
        //         realm
        //           .objects<CloudMangaSchema>('CloudManga')
        //           .filtered(`_userId == '${currentUser.id}'`),
        //       );
        //     },
        //   },
        // } as Realm.SyncConfiguration,
      };

      const realmRef = currentRealm.current;
      const shouldInitRealm = realmRef == null;
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
    <RealmCloudContext.Provider value={realm}>
      {children}
    </RealmCloudContext.Provider>
  );
};

export const RealmCloudListener: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const localRealm = useRealm();
  const localMangas = useQuery(MangaSchema);
  const [mangas, setMangas] = React.useState<{
    collection: Realm.Collection<MangaSchema & Realm.Object<unknown, never>>;
    changes: Realm.CollectionChangeSet;
  }>();
  const cloudMangas = useCloudQuery(CloudMangaSchema);
  const cloudRealm = useCloudRealm();
  const user = useCurrentUserFromRealm();

  const cloudCallback: Realm.CollectionChangeCallback<
    CloudMangaSchema & Realm.Object<unknown, never>
  > = React.useCallback((collection, changes) => {
    if (changes.newModifications.length > 0) {
      console.log(
        `Retrieved ${changes.newModifications.length} from the cloud, which will override local mangas`,
      );
      // localRealm.write(() => {
      //   for (const index of changes.newModifications) {

      //     localRealm.create<MangaSchema>(
      //       'Manga',
      //       collection[index],
      //       Realm.UpdateMode.Modified,
      //     );
      //   }
      // });
    }
  }, []);

  React.useEffect(() => {
    if (mangas != null) {
      const { changes, collection } = mangas;
      if (user != null && changes.newModifications.length > 0) {
        console.log(
          `Updating ${changes.newModifications.length} mangas saved in Cloud`,
        );
        cloudRealm.write(() => {
          for (const index of changes.newModifications) {
            const {
              currentlyReadingChapter,
              dateAddedInLibrary,
              modifyNewChaptersCount,
              selectedLanguage,
              inLibrary,
            } = collection[index];
            console.log({
              _userId: user.id,
              currentlyReadingChapter,
              dateAddedInLibrary,
              modifyNewChaptersCount,
              selectedLanguage,
              inLibrary,
            });

            cloudRealm.create<CloudMangaSchema>(
              'CloudManga',
              {
                _userId: user.id,
                currentlyReadingChapter,
                dateAddedInLibrary,
                modifyNewChaptersCount,
                selectedLanguage,
                inLibrary,
              },
              Realm.UpdateMode.Modified,
            );
          }
        });
      }
    }
  }, [mangas?.changes, mangas?.collection, user != null]);
  React.useEffect(() => {
    /**
     * Listen for updates locally and upload to the cloud
     */
    const localCallback: Realm.CollectionChangeCallback<
      MangaSchema & Realm.Object<unknown, never>
    > = (collection, changes) => {
      setMangas({ collection, changes });
    };
    localMangas.addListener(localCallback);
    return () => {
      localMangas.removeListener(localCallback);
    };
  }, [user?.id, cloudRealm]);
  React.useEffect(() => {
    cloudMangas.addListener(cloudCallback);
    return () => {
      cloudMangas.removeListener(cloudCallback);
    };
  }, [cloudCallback]);
  return <>{children}</>;
};
