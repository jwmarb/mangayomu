import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import Hyperlink from '@components/Hyperlink';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { MangaHost } from '@mangayomu/mangascraper';
import connector, {
  ConnectedItemProps,
} from '@screens/Welcome/components/MainSourceSelector/components/Item/Item.redux';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { RectButton } from 'react-native-gesture-handler';
import { ScaledSheet } from 'react-native-size-matters';

const Item: React.FC<ConnectedItemProps> = React.memo(
  ({ item, addSource, isSelected, removeSource }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = MangaHost.sourcesMap.get(item)!;
    function handleOnPress() {
      if (!isSelected) addSource(host.name);
      else removeSource(host.name);
    }
    const theme = useTheme();
    return (
      <RectButton
        shouldCancelWhenOutside
        onPress={handleOnPress}
        rippleColor={theme.palette.action.ripple}
      >
        <Box flex-direction="row" align-items="center">
          <Box align-self="center" ml="s">
            <Checkbox onChange={handleOnPress} checked={isSelected} />
          </Box>
          <Stack py="s" flex-direction="row" space="m">
            <FastImage source={{ uri: host.icon }} style={styles.icon} />
            <Stack>
              <Text bold>{host.name}</Text>
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
