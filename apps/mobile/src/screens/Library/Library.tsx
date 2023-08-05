import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import React from 'react';
import LibraryFilterMenu from '@screens/Library/components/LibraryFilterMenu';
import { Freeze } from 'react-freeze';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import { useWindowDimensions } from 'react-native';
import Stack from '@components/Stack';
import Checkbox from '@components/Checkbox';
import Badge from '@components/Badge';
import Input from '@components/Input';
import { RefreshControl } from 'react-native-gesture-handler';
import useBoolean from '@hooks/useBoolean';

import { useIsDataStale, useLibraryData } from '@screens/Library/Library.hooks';
import { AnimatedFlashList } from '@components/animated';
import Progress from '@components/Progress';
import { useUser } from '@realm/react';
import useAppSelector from '@hooks/useAppSelector';

const Library: React.FC = () => {
  const numberOfAppliedFilters = useAppSelector(
    (state) => state.library.numberOfFiltersApplied,
  );
  const ref = React.useRef<BottomSheetMethods>(null);
  const [refreshing, setRefreshing] = useBoolean();
  const [showSearchBar, setShowSearchBar] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>('');
  const user = useUser();

  function handleOnPress() {
    ref.current?.snapToIndex(1);
  }

  const { data, mangasInLibrary, updateQuerifiedData } = useLibraryData(
    refreshing,
    setRefreshing,
  );

  function handleOnShowSearchBar() {
    setShowSearchBar(true);
  }

  function handleOnBack() {
    setShowSearchBar(false);
  }
  const {
    renderItem,
    keyExtractor,
    estimatedItemSize,
    estimatedListSize,
    columns,
    key,
    overrideItemLayout,
    drawDistance,
  } = useMangaFlashlistLayout(data.length);

  const { scrollViewStyle, contentContainerStyle, onScroll } =
    useCollapsibleTabHeader({
      headerTitle: 'Library',
      headerLeft:
        mangasInLibrary.length > 0 && !showSearchBar ? (
          <Badge type="dot" show={query.length > 0} color="primary">
            <IconButton
              icon={<Icon type="font" name="magnify" />}
              onPress={handleOnShowSearchBar}
            />
          </Badge>
        ) : (
          <Input
            defaultValue={query}
            onChangeText={(e) => {
              setQuery(e);
              updateQuerifiedData(e);
            }}
            placeholder="Search for a title..."
            expanded
            iconButton={
              <IconButton
                icon={<Icon type="font" name="arrow-left" />}
                onPress={handleOnBack}
              />
            }
          />
        ),
      showHeaderLeft: mangasInLibrary.length > 0,
      headerLeftProps:
        mangasInLibrary.length > 0 && !showSearchBar
          ? { 'flex-shrink': true }
          : { 'flex-grow': true },
      showHeaderRight: mangasInLibrary.length > 0,
      showHeaderCenter: !showSearchBar,
      headerRight: (
        <Badge type="number" count={numberOfAppliedFilters} color="primary">
          <IconButton
            icon={<Icon type="font" name="filter-menu" />}
            onPress={handleOnPress}
          />
        </Badge>
      ),
      loading: refreshing,
      headerRightProps: { 'flex-shrink': true },
      dependencies: [
        mangasInLibrary.length > 0,
        numberOfAppliedFilters,
        showSearchBar,
        query.length > 0,
      ],
    });

  return (
    <>
      <AnimatedFlashList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        key={key + user.id}
        numColumns={columns}
        ListHeaderComponent={
          <>{data.length > 0 && <Box style={scrollViewStyle} />}</>
        }
        ListFooterComponent={
          <>{data.length > 0 && <Box style={contentContainerStyle} />}</>
        }
        estimatedItemSize={estimatedItemSize}
        estimatedListSize={estimatedListSize}
        overrideItemLayout={overrideItemLayout}
        drawDistance={drawDistance}
        ListEmptyComponent={
          <ListEmptyComponent libraryIsEmpty={mangasInLibrary.length === 0} />
        }
      />
      <Freeze freeze={mangasInLibrary.length === 0}>
        <LibraryFilterMenu ref={ref} filtered={mangasInLibrary} />
      </Freeze>
    </>
  );
};

const ListEmptyComponent: React.FC<{
  libraryIsEmpty: boolean;
}> = React.memo(({ libraryIsEmpty }) => {
  const { height } = useWindowDimensions();
  const noSourcesSelected = useAppSelector(
    (state) => state.library.numberOfSelectedSourcesInFilter === 0,
  );

  if (libraryIsEmpty)
    return (
      <Box height={height} p="m" flex-grow justify-content="center">
        <Text variant="header" align="center">
          Your library is empty
        </Text>
        <Text color="textSecondary" align="center">
          To add a manga to your library, navigate to a manga and press{' '}
          <Icon type="font" name="bookmark-outline" /> at the top right corner,
          or press the
        </Text>
        <Stack space="s" flex-direction="row" align-self="center">
          <Box
            background-color="secondary"
            border-radius="@theme"
            px="s"
            py={moderateScale(3)}
            align-self="center"
          >
            <Text color="secondary@contrast" variant="bottom-tab">
              <Icon
                type="font"
                name="bookmark"
                color="secondary@contrast"
                variant="bottom-tab"
              />{' '}
              Add
            </Text>
          </Box>
          <Text color="textSecondary" align="center">
            button.
          </Text>
        </Stack>
      </Box>
    );
  if (noSourcesSelected)
    return (
      <Box height={height} p="m" flex-grow justify-content="center">
        <Text variant="header" align="center">
          No sources selected
        </Text>
        <Text color="textSecondary" align="center">
          Your library is showing nothing because you did not select which
          sources to only display. Therefore, it will show no results.
        </Text>
        <Stack
          flex-direction="row"
          space="s"
          align-items="center"
          justif-content="center"
          align-self="center"
        >
          <Text color="textSecondary">A checkbox looks like this:</Text>
          <Checkbox />
        </Stack>
        <Text color="textSecondary" align="center">
          Feel free to interact with it :)
        </Text>
      </Box>
    );
  return (
    <Box height={height} p="m" flex-grow justify-content="center">
      <Text variant="header" align="center">
        No results found
      </Text>
      <Text color="textSecondary" align="center">
        There are no mangas in your library that match your desired filters.
      </Text>
    </Box>
  );
});

const LibraryWrapper: React.FC = () => {
  const { dataIsStale, syncing } = useIsDataStale();

  if (dataIsStale)
    return (
      <Stack space="s" height="100%" p="m" justify-content="center">
        <Progress />
        <Stack
          space="s"
          flex-direction="row"
          align-self="center"
          align-items="center"
        >
          <Text align="center" bold variant="header">
            {syncing.count} / {syncing.totalToSync}
          </Text>
          <Text align="center" color="textSecondary">
            mangas synced
          </Text>
        </Stack>
        <Text color="textSecondary" align="center">
          Please wait while your library syncs with your device...
        </Text>
      </Stack>
    );
  return <Library />;
};

export default LibraryWrapper;
