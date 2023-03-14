import Box from '@components/Box';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Hyperlink from '@components/Hyperlink';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { MangaHost } from '@mangayomu/mangascraper';
import connector, {
  ConnectedItemProps,
} from '@screens/Welcome/components/MainSourceSelector/components/Item/Item.redux';
import React from 'react';
import { Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RectButton } from 'react-native-gesture-handler';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

const Item: React.FC<ConnectedItemProps> = React.memo(
  ({ item, addSource, isSelected, removeSource }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = MangaHost.getAvailableSources().get(item)!;
    function handleOnPress() {
      if (!isSelected) addSource(host.getName());
      else removeSource(host.getName());
    }
    const theme = useTheme();
    return (
      <RectButton
        onPress={handleOnPress}
        rippleColor={theme.palette.action.ripple}
      >
        <Box flex-direction="row" align-items="center">
          <Box align-self="center" ml="s">
            <Checkbox onChange={handleOnPress} checked={isSelected} />
          </Box>
          <Stack py="s" flex-direction="row" space="m">
            <FastImage source={{ uri: host.getIcon() }} style={styles.icon} />
            <Stack>
              <Text bold>{host.getName()}</Text>
              <Text color="textSecondary">v{host.getVersion()}</Text>
              <Hyperlink url={`https://${host.getLink()}/`}>
                {host.getLink()}
              </Hyperlink>
            </Stack>
          </Stack>
        </Box>
      </RectButton>
    );
  },
);

const styles = ScaledSheet.create({
  icon: {
    width: '64@ms',
    height: '64@ms',
  },
});

export default connector(React.memo(Item));
