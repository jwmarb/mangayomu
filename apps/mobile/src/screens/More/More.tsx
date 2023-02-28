import Avatar from '@components/Avatar';
import Button from '@components/Button';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useAuth0 from '@hooks/useAuth0';
import { useUser } from '@realm/react';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';

const Settings: React.FC = () => {
  const { user, authorize, clearSession, clearCredentials } = useAuth0();
  const currentUser = useUser();

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
