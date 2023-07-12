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
import useAuth0 from '@hooks/useAuth0';
import useDialog from '@hooks/useDialog';
import useRootNavigation from '@hooks/useRootNavigation';
import { useApp, useUser } from '@realm/react';
import React from 'react';
import Realm from 'realm';
import { moderateScale } from 'react-native-size-matters';

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
              await user.logOut();
            } catch (e) {
              displayMessage('There was an error signing out');
            } finally {
              const anonymousCredentials = Realm.Credentials.anonymous();
              await app.logIn(anonymousCredentials);
              displayMessage('You have logged out');
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
    if (realm.syncSession)
      try {
        await realm.syncSession.downloadAllServerChanges();
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

export default User;
