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
import useMountedEffect from '@hooks/useMountedEffect';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const _RealmEffect: React.FC<ConnectedRealmEffectProps> = ({
  children,
  enableCloud,
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

  useMountedEffect(() => {
    if (enableCloud) realm.syncSession?.resume();
    else realm.syncSession?.pause();
  }, [enableCloud]);

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

const mapStateToProps = (state: AppState, props: React.PropsWithChildren) => ({
  children: props.children,
  enableCloud: state.settings.cloud.enabled,
});

const connector = connect(mapStateToProps);

type ConnectedRealmEffectProps = ConnectedProps<typeof connector>;

export const RealmEffect = connector(_RealmEffect);
