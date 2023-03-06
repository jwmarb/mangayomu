import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import Box from '@components/Box';
import Button from '@components/Button';
import Divider from '@components/Divider';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Menu, MenuItem } from '@components/Menu';
import { Stack } from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import { useRealm } from '@database/main';
import { useTheme } from '@emotion/react';
import copyTextToClipboard from '@helpers/copyTextToClipboard';
import useAuth0 from '@hooks/useAuth0';
import useRootNavigation from '@hooks/useRootNavigation';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { useUser } from '@realm/react';
import CloudSwitch from '@screens/More/components/CloudSwitch';
import PressableListItem from '@screens/More/components/PressableListItem';
import React from 'react';
import {
  BorderlessButton,
  RectButton,
  ScrollView,
} from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
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
