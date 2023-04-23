import Box from '@components/Box';
import Divider from '@components/Divider';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import useAuth0 from '@hooks/useAuth0';
import useRootNavigation from '@hooks/useRootNavigation';
import CloudSwitch from '@screens/More/components/CloudSwitch';
import PressableListItem from '@screens/More/components/PressableListItem';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import User from './components/User';

const Settings: React.FC = () => {
  const { user } = useAuth0();
  const theme = useTheme();
  const navigation = useRootNavigation();
  const handleOnSettings = React.useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  return (
    <ScrollView>
      <User />
      <Box
        background-color="paper"
        mx="m"
        my="s"
        border-radius="@theme"
        overflow="hidden"
      >
        {user != null && (
          <>
            <CloudSwitch />
            <Divider />
          </>
        )}
        <PressableListItem
          label="Settings"
          iconLeft={<Icon type="font" name="cog" />}
          onPress={handleOnSettings}
        />
        <Divider />
        <PressableListItem
          label="About"
          iconLeft={<Icon type="font" name="information" />}
        />
      </Box>
    </ScrollView>
  );
};

export default Settings;
