import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { keyExtractor } from '@screens/Explore/Explore.flatlist';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import connector, {
  ConnectedLatestMangaListProps,
} from './LatestMangaList.redux';

const LatestMangaList: React.FC<ConnectedLatestMangaListProps> = (props) => {
  const { latestMangas, status } = props;
  return (
    <Stack space="s" flex-direction="column">
      <Stack
        mx="m"
        flex-direction="row"
        justify-content="space-between"
        space="s"
        align-items="center"
      >
        <Text variant="header" bold>
          Recently updated{' '}
          <Icon
            type="font"
            name="clock-fast"
            color="primary"
            variant="header"
          />
        </Text>
        {latestMangas.length > 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Button label="See More" />
          </Animated.View>
        )}
      </Stack>
      <FlatList
        ListHeaderComponent={
          <>
            {status === 'loading' && <Text>Loading...</Text>}
            {status === 'failed_with_errors' && <Text>Failed with errors</Text>}
            {status === 'done_with_errors' && <Text>Done with errors</Text>}
          </>
        }
        data={latestMangas}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
      />
    </Stack>
  );
};

const renderItem = () => null;

export default connector(LatestMangaList);
