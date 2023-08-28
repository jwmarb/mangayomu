import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Text from '@components/Text';
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
import GenresList from '@screens/Explore/components/GenresList';
import { Freeze } from 'react-freeze';
import Progress from '@components/Progress';
import useTabNavigation from '@hooks/useTabNavigation';
import ContinueReading from '@screens/Explore/components/ContinueReading/ContinueReading';
import { useUser } from '@realm/react';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import HotMangaList from '@screens/Explore/components/HotMangaList';
import LatestMangaList from '@screens/Explore/components/LatestMangaList';
import { ExploreMethods, ExploreProps } from '@screens/Explore';
import {
  explorerNetworkStateListenerHandler,
  refreshExplorerState,
  setExplorerState,
} from '@redux/slices/explore';
import { useAppDispatch } from '@redux/main';
import useMangaHost from '@hooks/useMangaHost';
import useAppSelector from '@hooks/useAppSelector';

const Explore: React.ForwardRefRenderFunction<ExploreMethods, ExploreProps> = (
  { onScroll, scrollViewStyle, contentContainerStyle, loading },
  ref,
) => {
  const source = useMangaHost();
  const dispatch = useAppDispatch();
  const internetStatus = useAppSelector(
    (state) => state.explore.internetStatus,
  );
  const { height } = useWindowDimensions();
  const navigation = useTabNavigation();
  const sourceSelectorRef = React.useRef<BottomSheetMethods>(null);
  const inputRef = React.useRef<TextInput>(null);
  const suspendRendering = useAppSelector(
    (state) => state.host.suspendRendering,
  );

  React.useImperativeHandle(ref, () => ({
    openMainSourceSelector: () => {
      sourceSelectorRef.current?.snapToIndex(1);
    },
  }));

  async function fetchMangas() {
    if (!suspendRendering && !loading) {
      console.log('fetching explorer state');
      dispatch(refreshExplorerState());
      const [hotResult, latestResult] = await Promise.allSettled([
        source.getHotMangas(),
        source.getLatestMangas(),
      ]);
      if (hotResult.status === 'rejected')
        return console.error(hotResult.reason);
      if (latestResult.status === 'rejected')
        return console.error(latestResult.reason);
      dispatch(
        setExplorerState({ hot: hotResult.value, latest: latestResult.value }),
      );
    }
  }
  React.useEffect(() => {
    const netListener = NetInfo.addEventListener((e) =>
      dispatch(explorerNetworkStateListenerHandler(e)),
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
          <Freeze freeze={suspendRendering} placeholder={<Progress />}>
            {source.hasNoSources() ? (
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
            )}
          </Freeze>
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

export default React.forwardRef(Explore);
