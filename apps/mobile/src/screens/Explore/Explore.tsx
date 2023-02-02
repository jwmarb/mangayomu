import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useAuth0 from '@hooks/useAuth0';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import connector, {
  ConnectedExploreProps,
} from '@screens/Explore/Explore.redux';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import {
  InteractionManager,
  ListRenderItem,
  useWindowDimensions,
} from 'react-native';
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { FlatList } from 'react-native-gesture-handler';
import { Manga } from '@mangayomu/mangascraper';
import { HotMangaList } from '@screens/Explore/components/HotMangaList';
import { LatestMangaList } from '@screens/Explore/components/LatestMangaList';
import GenresList from '@screens/Explore/components/GenresList';

const Explore: React.FC<ConnectedExploreProps> = ({
  source,
  setExplorerState,
  explorerNetworkStateListenerHandler,
  refreshExplorerState,
  networkStatus,
  hotMangas,
  latestMangas,
}) => {
  const { user } = useAuth0();
  const { height } = useWindowDimensions();
  const sourceSelectorRef =
    React.useRef<React.ElementRef<typeof MainSourceSelector>>(null);
  function handleOnPress() {
    sourceSelectorRef.current?.snapToIndex(1);
  }
  const { onScroll, scrollViewStyle } = useCollapsibleTabHeader({
    dependencies: [source.getSourcesLength()],
    headerLeft: (
      <Badge type="number" count={source.getSourcesLength()} color="primary">
        <IconButton
          icon={<Icon type="font" name="bookshelf" />}
          onPress={handleOnPress}
        />
      </Badge>
    ),
    headerRight: (
      <IconButton
        icon={<Avatar uri={user?.picture} />}
        onPress={() => console.log('Account')}
      />
    ),
  });
  React.useEffect(() => {
    const netListener = NetInfo.addEventListener(
      explorerNetworkStateListenerHandler,
    );
    return () => {
      netListener(); // unsubscribe from listening to network events
    };
  }, []);
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      if (
        networkStatus === 'online' ||
        (await NetInfo.fetch()).isInternetReachable
      ) {
        const hot = await source.getHotMangas();
        const latest = await source.getLatestMangas();
        setExplorerState({ hot, latest });
      }
    });
  }, []);
  return (
    <>
      <Animated.ScrollView style={scrollViewStyle} onScroll={onScroll}>
        <Stack space="s" flex-grow minHeight={height}>
          <Box my="s" mx="m">
            <Input
              icon={<Icon type="font" name="magnify" />}
              width="100%"
              placeholder="Titles, authors, or topics"
            />
          </Box>
          {source.hasNoSources() && (
            <Stack space="s" mx="m" align-self="center">
              <Text variant="header" align="center">
                No sources selected
              </Text>
              <Text color="textSecondary">
                Sources that are selected will have their hot and latest updates
                shown here.
              </Text>
              <Text color="textSecondary">
                To select sources, press on{' '}
                <Icon type="font" name="bookshelf" /> at the top left corner to
                open the source selector modal.
              </Text>
            </Stack>
          )}
          <Box my="s">
            <GenresList />
            <HotMangaList />
            <LatestMangaList />
          </Box>
        </Stack>
      </Animated.ScrollView>
      <MainSourceSelector ref={sourceSelectorRef} />
    </>
  );
};

export default connector(Explore);
