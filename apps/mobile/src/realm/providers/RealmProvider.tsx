import { MangaSchema } from '../schemas/Manga';
import { useQuery, useRealm } from '@database/main';
import { useApp, useUser } from '@realm/react';
import React from 'react';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { UserHistorySchema } from '@database/schemas/History';
import { ChapterSchema } from '@database/schemas/Chapter';
import useAppSelector from '@hooks/useAppSelector';

export function RealmEffect({ children }: React.PropsWithChildren) {
  // const mangas = useQuery(MangaSchema);
  const enableCloud = useAppSelector((state) => state.settings.cloud.enabled);
  const realm = useRealm();
  const currentUser = useUser();

  // const callback: Realm.CollectionChangeCallback<
  //   MangaSchema & Realm.Object<unknown, never>
  // > = React.useCallback((collection, changes) => {
  //   for (const index of changes.newModifications) {
  //     const { inLibrary, title } = collection[index];
  //     console.log(`${user?.deviceId} - ${title}`);
  //   }
  // }, []);

  const mangas = useQuery(MangaSchema, (collection) =>
    collection.filtered('_realmId = $0', currentUser.id),
  );
  const userHistory = useQuery(UserHistorySchema, (collection) =>
    collection.filtered('_realmId = $0', currentUser.id),
  );
  const chapters = useQuery(ChapterSchema, (collection) =>
    collection.filtered('_realmId = $0', currentUser.id),
  );

  React.useEffect(() => {
    const addSubscriptions = async () => {
      await realm.subscriptions.update((sub) => {
        sub.add(mangas);
        sub.add(userHistory);
        sub.add(chapters);
      });
    };

    addSubscriptions();

    return () => {
      // console.log('Removing all subscriptions');
      realm.subscriptions.update((sub) => {
        sub.removeAll();
      });
    };
  }, [currentUser.id]);

  React.useEffect(() => {
    if (
      currentUser != null &&
      currentUser.isLoggedIn &&
      realm.syncSession?.isConnected()
    ) {
      if (enableCloud) realm.syncSession?.resume();
      else realm.syncSession?.pause();
    }
  }, [enableCloud, currentUser]);

  return <>{children}</>;
}
