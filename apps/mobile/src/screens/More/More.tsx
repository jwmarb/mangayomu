import Avatar from '@components/Avatar';
import Button from '@components/Button';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { app, currentUser } from '@database/main';
import { useCurrentUserFromRealm } from '@database/main';
import useAuth0 from '@hooks/useAuth0';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';

const Settings: React.FC = () => {
  const { user, authorize, clearSession, clearCredentials } = useAuth0();
  const currentUser = useCurrentUserFromRealm();

  return (
    <ScrollView>
      <Stack space="s" flex-direction="row" align-items="center" mx="m" my="s">
        <Avatar size={moderateScale(64)} />
        <Text bold>{user?.name}</Text>
        <Text bold>{JSON.stringify(currentUser?.id, null, 2)}</Text>
      </Stack>
      <Button label="Sign out" onPress={() => clearSession()} />
      <Button
        label="Log in"
        onPress={() => authorize({ scope: 'openid profile email' })}
      />
    </ScrollView>
  );
};

export default Settings;
