import { MangaSchema } from '../schemas/Manga';
import { useRealm } from '@database/main';
import { useApp, useUser } from '@realm/react';
import React from 'react';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { UserHistorySchema } from '@database/schemas/History';
import { ChapterSchema } from '@database/schemas/Chapter';

const _RealmEffect: React.FC<ConnectedRealmEffectProps> = ({
  children,
  enableCloud,
}) => {
  // const mangas = useQuery(MangaSchema);
  const realm = useRealm();
  const currentUser = useUser();
  const app = useApp();

  // const callback: Realm.CollectionChangeCallback<
  //   MangaSchema & Realm.Object<unknown, never>
  // > = React.useCallback((collection, changes) => {
  //   for (const index of changes.newModifications) {
  //     const { inLibrary, title } = collection[index];
  //     console.log(`${user?.deviceId} - ${title}`);
  //   }
  // }, []);

  React.useEffect(() => {
    const addSubscriptions = async () => {
      for (const userId in app.allUsers) {
        if (app.allUsers[userId].isLoggedIn && userId === currentUser.id) {
          await realm.subscriptions.update((sub) => {
            console.log(`Setting subscription for ${userId}`);
            sub.add(
              realm.objects(MangaSchema).filtered(`_realmId == "${userId}"`),
            );
            sub.add(
              realm.objects(UserHistorySchema).filtered(`_id == "${userId}"`),
            );
            sub.add(
              realm.objects(ChapterSchema).filtered(`_realmId == "${userId}"`),
            );
          });
        } else {
          await app.allUsers[userId].logOut();
          console.log(
            `Logged out ${userId} because they are not the active user`,
          );
        }
      }
    };

    realm.subscriptions.waitForSynchronization().then(() => addSubscriptions());
    return () => {
      console.log('Removing all subscriptions');
      realm.subscriptions.update((sub) => {
        sub.removeAll();
      });
    };
  }, [currentUser.id]);

  React.useEffect(() => {
    if (currentUser != null && currentUser.isLoggedIn) {
      if (enableCloud) realm.syncSession?.resume();
      else realm.syncSession?.pause();
    }
  }, [enableCloud, currentUser]);

  return <>{children}</>;
};

const mapStateToProps = (state: AppState, props: React.PropsWithChildren) => ({
  children: props.children,
  enableCloud: state.settings.cloud.enabled,
});

const connector = connect(mapStateToProps);

type ConnectedRealmEffectProps = ConnectedProps<typeof connector>;

export const RealmEffect = connector(_RealmEffect);
