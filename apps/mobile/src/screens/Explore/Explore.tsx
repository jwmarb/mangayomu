import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Text from '@components/Text';
import useAuth0 from '@hooks/useAuth0';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import connector, {
  ConnectedExploreProps,
} from '@screens/Explore/Explore.redux';
import React from 'react';
import Animated from 'react-native-reanimated';
import {
  InteractionManager,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  useWindowDimensions,
} from 'react-native';
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import NetInfo from '@react-native-community/netinfo';
import { RefreshControl, TextInput } from 'react-native-gesture-handler';
import { HotMangaList } from '@screens/Explore/components/HotMangaList';
import { LatestMangaList } from '@screens/Explore/components/LatestMangaList';
import GenresList from '@screens/Explore/components/GenresList';
import { Freeze } from 'react-freeze';
import Progress from '@components/Progress';
import useTabNavigation from '@hooks/useTabNavigation';
import ContinueReading from '@screens/Explore/components/ContinueReading/ContinueReading';

const Explore: React.FC<ConnectedExploreProps> = ({
  source,
  setExplorerState,
  explorerNetworkStateListenerHandler,
  refreshExplorerState,
  loading,
  suspendRendering,
  internetStatus,
}) => {
  const { user } = useAuth0();
  const { height } = useWindowDimensions();
  const navigation = useTabNavigation();
  const sourceSelectorRef =
    React.useRef<React.ElementRef<typeof MainSourceSelector>>(null);
  const inputRef = React.useRef<TextInput>(null);
  function handleOnPress() {
    sourceSelectorRef.current?.snapToIndex(1);
  }
  const { onScroll, scrollViewStyle, contentContainerStyle } =
    useCollapsibleTabHeader({
      dependencies: [source.getSourcesLength(), user?.picture],
      loading,
      headerLeft: (
        <Badge type="number" count={source.getSourcesLength()} color="primary">
          <IconButton
            icon={<Icon type="font" name="bookshelf" />}
            onPress={handleOnPress}
          />
        </Badge>
      ),
      headerRight: (
        <IconButton icon={<Avatar />} onPress={() => console.log('Account')} />
      ),
    });

  async function fetchMangas() {
    if (!suspendRendering && !loading) {
      console.log('fetching explorer state');
      refreshExplorerState();
      const hot = await source.getHotMangas();
      const latest = await source.getLatestMangas();
      setExplorerState({ hot, latest });
    }
  }
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
      if (internetStatus !== 'offline') await fetchMangas();
    });
  }, [suspendRendering, internetStatus]);
  function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    navigation.navigate('Browse', { initialQuery: e.nativeEvent.text });
    inputRef.current?.clear();
  }
  return (
    <>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={fetchMangas}
            refreshing={loading}
            tintColor="transparent"
            colors={['transparent']}
            style={{ backgroundColor: 'transparent' }}
          />
        }
        style={scrollViewStyle}
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        contentContainerStyle={contentContainerStyle}
      >
        <Stack space="s" flex-grow minHeight={height}>
          <Box my="s" mx="m">
            <Input
              ref={inputRef}
              onSubmitEditing={handleOnSubmitEditing}
              icon={<Icon type="font" name="magnify" />}
              width="100%"
              placeholder="Titles, authors, or topics"
            />
          </Box>
          <ContinueReading />
          {!suspendRendering ? (
            source.hasNoSources() ? (
              <Stack space="s" mx="m" align-self="center">
                <Text variant="header" align="center">
                  No sources selected
                </Text>
                <Text color="textSecondary">
                  Sources that are selected will have their hot and latest
                  updates shown here.
                </Text>
                <Text color="textSecondary">
                  To select sources, press on{' '}
                  <Icon type="font" name="bookshelf" /> at the top left corner
                  to open the source selector modal.
                </Text>
              </Stack>
            ) : (
              <Stack space="s" my="s">
                <GenresList />
                <HotMangaList />
                <LatestMangaList />
              </Stack>
            )
          ) : (
            <Progress />
          )}
        </Stack>
      </Animated.ScrollView>
      <MainSourceSelector ref={sourceSelectorRef} />
    </>
  );
};

export const EmptyMangaListComponent = (
  <Box>
    <Text color="textSecondary">No mangas found</Text>
  </Box>
);

export default connector(Explore);
