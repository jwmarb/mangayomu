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
import connector, { ConnectedHotMangaListProps } from './HotMangaList.redux';

const HotMangaList: React.FC<ConnectedHotMangaListProps> = (props) => {
  const { hotMangas, status } = props;
  return (
    <Stack space="s" flex-direction="column">
      <Stack
        space="s"
        mx="m"
        flex-direction="row"
        justify-content="space-between"
        align-items="center"
        flex-grow
      >
        <Text variant="header" bold>
          Trending updates{' '}
          <Icon type="font" name="fire" color="secondary" variant="header" />
        </Text>
        {hotMangas.length > 0 && (
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
        data={hotMangas}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
      />
    </Stack>
  );
};

const renderItem = () => null;

export default connector(HotMangaList);
