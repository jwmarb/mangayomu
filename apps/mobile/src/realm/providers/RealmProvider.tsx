import {
  MangaSchema,
  MangaRatingSchema,
  MangaStatusSchema,
} from '../schemas/Manga';
import { useQuery, useRealm } from '@database/main';
import { useUser } from '@realm/react';
import Realm from 'realm';
import React from 'react';
import { ChapterSchema } from '@database/schemas/Chapter';
import useAuth0 from '@hooks/useAuth0';

export const RealmEffect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // const mangas = useQuery(MangaSchema);
  const realm = useRealm();
  const currentUser = useUser();
  const { user } = useAuth0();

  // const callback: Realm.CollectionChangeCallback<
  //   MangaSchema & Realm.Object<unknown, never>
  // > = React.useCallback((collection, changes) => {
  //   for (const index of changes.newModifications) {
  //     const { inLibrary, title } = collection[index];
  //     console.log(`${user?.deviceId} - ${title}`);
  //   }
  // }, []);

  React.useEffect(() => {
    (async () => {
      await realm.subscriptions.waitForSynchronization();
      await realm.subscriptions.update((sub) => {
        sub.add(
          realm
            .objects(MangaSchema)
            .filtered(`_realmId == "${currentUser?.id}"`),
        );
      });
      return async () => {
        await realm.subscriptions.update((sub) => {
          sub.removeAll();
        });
      };
    })();
    // mangas.addListener(callback);
    // return () => {
    //   mangas.removeListener(callback);
    // };
  }, [user]);
  return <>{children}</>;
};
