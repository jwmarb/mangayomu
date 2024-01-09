import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import Hyperlink from '@components/Hyperlink';
import ImprovedImage from '@components/ImprovedImage';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { MangaHost } from '@mangayomu/mangascraper/src';
import connector, {
  ConnectedItemProps,
} from '@screens/Welcome/components/MainSourceSelector/components/Item/Item.redux';
import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';

const Item: React.FC<ConnectedItemProps> = React.memo(
  ({ item, addSource, isSelected, removeSource }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = MangaHost.sourcesMap.get(item)!;
    function handleOnPress() {
      if (!isSelected) addSource(host.name);
      else removeSource(host.name);
    }
    return (
      <Pressable onPress={handleOnPress}>
        <Box flex-direction="row" align-items="center">
          <Box align-self="center" ml="s">
            <Checkbox onChange={handleOnPress} checked={isSelected} />
          </Box>
          <Stack py="s" flex-direction="row" space="m">
            <ImprovedImage // ImprovedImage
              source={{ uri: host.icon }}
              style={styles.icon}
            />
            <Stack>
              <Text bold>{host.name}</Text>
              <Text color="textSecondary">v{host.getVersion()}</Text>
              <Hyperlink url={`https://${host.getLink()}/`}>
                {host.getLink()}
              </Hyperlink>
            </Stack>
          </Stack>
        </Box>
      </Pressable>
    );
  },
);

const styles = ScaledSheet.create({
  icon: {
    width: '64@ms' as unknown as number,
    height: '64@ms' as unknown as number,
  },
});

export default connector(React.memo(Item));
