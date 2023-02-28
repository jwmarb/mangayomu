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

export const RealmEffect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // const mangas = useQuery(MangaSchema);
  const realm = useRealm();
  const user = useUser();

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
      try {
        await realm.subscriptions.waitForSynchronization();
      } catch (e) {
        console.error(e);
      } finally {
        await realm.subscriptions.update((sub) => {
          sub.add(
            realm.objects(MangaSchema).filtered(`_realmId == "${user?.id}"`),
          );
        });
      }
    })();
    // mangas.addListener(callback);
    // return () => {
    //   mangas.removeListener(callback);
    // };
  }, []);
  return <>{children}</>;
};
