import Avatar from '@components/Avatar';
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useRealm } from '@database/main';
import displayMessage from '@helpers/displayMessage';
import { getErrorMessage } from '@helpers/getErrorMessage';
import useDialog from '@hooks/useDialog';
import useRootNavigation from '@hooks/useRootNavigation';
import { useApp, useUser } from '@realm/react';
import React from 'react';
import Realm from 'realm';
import { moderateScale } from 'react-native-size-matters';
import { IMangaSchema } from '@mangayomu/schemas';
import { MangaSchema } from '@database/schemas/Manga';
import pLimit from 'p-limit';

const limit = pLimit(1);

const User: React.FC = () => {
  const realm = useRealm();
  const dialog = useDialog();
  const navigation = useRootNavigation();
  const user = useUser();
  const app = useApp();

  function login() {
    navigation.navigate('Login');
  }
  async function logout() {
    dialog.open({
      title: 'Do you really want to log out?',
      message:
        'If you log out, all your saved data will be unavailable until you login again.',
      actions: [
        {
          text: 'Log out',
          type: 'destructive',
          onPress: async () => {
            displayMessage('Signing out...');
            try {
              await realm.syncSession?.uploadAllLocalChanges();
              await app.logIn(Realm.Credentials.anonymous());
              displayMessage('You have logged out');
            } catch (e) {
              console.error(e);
              displayMessage('There was an error signing out');
            }
          },
        },
        { text: 'Stay signed in', type: 'normal' },
      ],
    });
  }
  async function displayUserId() {
    dialog.open({ title: 'User ID', message: user.id });
  }
  async function displayDeviceId() {
    if (user.deviceId)
      dialog.open({ title: 'Device ID', message: user.deviceId });
  }

  async function handleOnForceSync() {
    // if (realm.syncSession)
    try {
      // await realm.syncSession.downloadAllServerChanges();
      const mangas = (await user
        .mongoClient('mongodb-atlas')
        .db('mangayomu')
        .collection<IMangaSchema>('Manga')
        .aggregate([
          { $match: { _realmId: user.id, inLibrary: true } },
        ])) as IMangaSchema[];
      let count = 0;
      // console.log(mangas);
      for (let i = 0; i < mangas.length; i++) {
        mangas[i]._id = new Realm.BSON.ObjectID(mangas[i]._id);
        count++;
        if (realm.objectForPrimaryKey(MangaSchema, mangas[i]._id) == null)
          limit(async () => {
            await wait();
            console.log(`Attempting to save ${mangas[i].link}`);
            realm.write(() => {
              const k = realm.create(
                MangaSchema,
                mangas[i],
                Realm.UpdateMode.Modified,
              );
              console.log(count, k._id);
            });
          });
        else
          console.log(count, `${mangas[i].link} is saved locally. Skipping...`);
      }
      console.log(mangas.length);
    } catch (e) {
      dialog.open({ title: 'Failed to sync', message: getErrorMessage(e) });
    } finally {
      dialog.open({
        title: 'Sync complete',
        message: 'Downloaded all server changes success',
      });
    }
  }

  return (
    <Stack
      space="s"
      align-items="center"
      mx="m"
      my="s"
      justify-content="space-between"
      flex-direction="row"
    >
      <Stack space="m" align-items="center" flex-direction="row">
        <Avatar size={moderateScale(48)} />
        <Box align-self="center">
          <Text bold>{user.profile.name ?? 'Guest'}</Text>
          <Text color="textSecondary" variant="book-title" numberOfLines={1}>
            {user.profile.name ? user.id : 'Not signed in'}
          </Text>
        </Box>
      </Stack>
      <Menu
        trigger={
          <IconButton icon={<Icon type="font" name="dots-horizontal" />} />
        }
      >
        <MenuItem
          onPress={() => {
            for (const userId in app.allUsers) {
              const foundUser = app.allUsers[userId];
              console.log(
                `${userId}${userId === user.id ? '(active)' : ''} {
                  name = ${foundUser.profile.name},
                  loggedIn = ${foundUser.isLoggedIn},
                  state = ${foundUser.state}
                }`,
              );
            }
          }}
        >
          Log users
        </MenuItem>
        {user.profile.name != null ? (
          <>
            <MenuItem
              color="secondary"
              icon={<Icon type="font" name="logout" />}
              onPress={logout}
            >
              Log out
            </MenuItem>
            <MenuItem
              onPress={handleOnForceSync}
              icon={<Icon type="font" name="sync" />}
              color="primary"
            >
              Force sync
            </MenuItem>
          </>
        ) : (
          <MenuItem
            color="primary"
            icon={<Icon type="font" name="login" />}
            onPress={login}
          >
            Sign in
          </MenuItem>
        )}
        <MenuItem
          icon={<Icon type="font" name="content-copy" />}
          onPress={displayUserId}
        >
          Display user id
        </MenuItem>
        {user?.deviceId && (
          <MenuItem
            icon={<Icon type="font" name="content-copy" />}
            onPress={displayDeviceId}
          >
            Display device id
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

const wait = () => new Promise<void>((res) => setTimeout(() => res(), 200));

export default User;
