import { MangaSchema } from '../schemas/Manga';
import { useRealm } from '@database/main';
import { useUser } from '@realm/react';
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

  // const callback: Realm.CollectionChangeCallback<
  //   MangaSchema & Realm.Object<unknown, never>
  // > = React.useCallback((collection, changes) => {
  //   for (const index of changes.newModifications) {
  //     const { inLibrary, title } = collection[index];
  //     console.log(`${user?.deviceId} - ${title}`);
  //   }
  // }, []);

  React.useEffect(() => {
    if (currentUser != null) {
      if (enableCloud) realm.syncSession?.resume();
      else realm.syncSession?.pause();
    }
  }, [enableCloud, currentUser]);

  React.useEffect(() => {
    (async () => {
      await realm.subscriptions.waitForSynchronization();
      await realm.subscriptions.update((sub) => {
        sub.add(
          realm
            .objects(MangaSchema)
            .filtered(`_realmId == "${currentUser?.id}"`),
        );
        sub.add(
          realm
            .objects(UserHistorySchema)
            .filtered(`_id == "${currentUser?.id}"`),
        );
        sub.add(
          realm
            .objects(ChapterSchema)
            .filtered(`_realmId == "${currentUser.id}"`),
        );
      });
    })();
    return () => {
      (async () => {
        await realm.subscriptions.update((sub) => {
          sub.removeAll();
        });
      })();
    };
    // mangas.addListener(callback);
    // return () => {
    //   mangas.removeListener(callback);
    // };
  }, [currentUser?.id]);
  return <>{children}</>;
};

const mapStateToProps = (state: AppState, props: React.PropsWithChildren) => ({
  children: props.children,
  enableCloud: state.settings.cloud.enabled,
});

const connector = connect(mapStateToProps);

type ConnectedRealmEffectProps = ConnectedProps<typeof connector>;

export const RealmEffect = connector(_RealmEffect);
