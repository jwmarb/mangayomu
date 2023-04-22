import Avatar from '@components/Avatar';
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useRealm } from '@database/main';
import copyTextToClipboard from '@helpers/copyTextToClipboard';
import { getErrorMessage } from '@helpers/getErrorMessage';
import useAuth0 from '@hooks/useAuth0';
import useDialog from '@hooks/useDialog';
import { useUser } from '@realm/react';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

const User: React.FC = () => {
  const { user, authorize, clearSession, error } = useAuth0();
  const realm = useRealm();
  const dialog = useDialog();
  React.useEffect(() => {
    if (error != null)
      dialog.open({
        title: 'There was an issue logging in',
        message: `Auth0 threw an error: ${error?.message}`,
      });
  }, [error]);
  async function login() {
    try {
      await authorize({ scope: 'openid profile email' });
    } catch (e) {
      console.error(e);
    }
  }
  const currentUser = useUser();
  async function displayUserId() {
    if (currentUser) dialog.open({ title: 'User ID', message: currentUser.id });
  }
  async function displayDeviceId() {
    if (currentUser && currentUser.deviceId)
      dialog.open({ title: 'Device ID', message: currentUser.deviceId });
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

  const subscriptionType = React.useMemo(() => {
    if (user == null) return 'Not signed in';
    return `Signed in via ${user.sub
      .split('|')
      .filter((c) => Number.isNaN(parseInt(c)))
      .join(' & ')}`;
  }, [user?.sub]);
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
          <Text bold>{user?.name ?? 'Guest'}</Text>
          <Text color="textSecondary" variant="book-title" numberOfLines={1}>
            {subscriptionType}
          </Text>
        </Box>
      </Stack>
      <Menu
        trigger={
          <IconButton icon={<Icon type="font" name="dots-horizontal" />} />
        }
      >
        {user != null ? (
          <>
            <MenuItem
              color="secondary"
              icon={<Icon type="font" name="logout" />}
              onPress={clearSession}
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
        {currentUser?.deviceId && (
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
