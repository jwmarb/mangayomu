import { MangaSchema } from '../schemas/Manga';
import { useRealm } from '@database/main';
import { useUser } from '@realm/react';
import React from 'react';
import { UserHistorySchema } from '@database/schemas/History';
import { ChapterSchema } from '@database/schemas/Chapter';
import { RealmProvider } from '@database/main';
import useAppSelector from '@hooks/useAppSelector';
import { getErrorMessage } from '@helpers/getErrorMessage';
import Realm from 'realm';

const realmConfiguration: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately,
  timeOutBehavior: Realm.OpenRealmTimeOutBehavior.OpenLocalRealm,
};

const onError: Realm.ErrorCallback = (_, error) => {
  if (error instanceof Realm.SyncError)
    console.log({
      code: error.code,
      name: error.name,
      message: error.message,
      logUrl: error.logUrl,
      reason: error.reason,
      userInfo: error.userInfo,
      type: 'SyncError',
    });
  else
    console.log({
      type: 'ClientResetError',
      message: getErrorMessage(error),
    });
};

const clientReset: Realm.ClientResetConfig = {
  mode: Realm.ClientResetMode.RecoverOrDiscardUnsyncedChanges,
};

export function MongoDBRealmProvider({ children }: React.PropsWithChildren) {
  const currentUser = useUser();

  const sync: Partial<Realm.SyncConfiguration> = {
    flexible: true,
    onError,
    clientReset: clientReset,
    newRealmFileBehavior: realmConfiguration,
    existingRealmFileBehavior: realmConfiguration,
    initialSubscriptions: {
      update: (subs, realm) => {
        subs.add(
          realm.objects(MangaSchema).filtered('_realmId = $0', currentUser.id),
        );
        subs.add(
          realm
            .objects(UserHistorySchema)
            .filtered('_realmId = $0', currentUser.id),
        );
        subs.add(
          realm
            .objects(ChapterSchema)
            .filtered('_realmId = $0', currentUser.id),
        );
      },
    },
  };

  return <RealmProvider sync={sync}>{children}</RealmProvider>;
}

// todo
function ApplyRealmSettings(props: React.PropsWithChildren) {
  const { children } = props;
  const currentUser = useUser();
  const enableCloud = useAppSelector((state) => state.settings.cloud.enabled);
  const realm = useRealm();

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
