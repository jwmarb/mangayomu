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

import { useLibraryData } from '@screens/Library/Library.hooks';
import { AnimatedFlashList } from '@components/animated';
import Progress from '@components/Progress';
import { useUser } from '@realm/react';
import useAppSelector from '@hooks/useAppSelector';
import { LibraryMethods, useLibrarySetRefreshing } from '@screens/Library';
import { useIsLibrarySynced } from '../../context/SyncData';

const _Library: React.ForwardRefRenderFunction<
  LibraryMethods,
  ReturnType<typeof useCollapsibleTabHeader>
> = ({ onScroll, contentContainerStyle, scrollViewStyle }, ref) => {
  const bottomSheet = React.useRef<BottomSheetMethods>(null);
  const user = useUser();
  const { data, mangasInLibrary, updateQuerifiedData } = useLibraryData();
  React.useImperativeHandle(ref, () => ({
    openFilters() {
      bottomSheet.current?.snapToIndex(1);
    },
    updateQuerifiedData,
  }));
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
  const setRefreshing = useLibrarySetRefreshing();

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
        <LibraryFilterMenu ref={bottomSheet} filtered={mangasInLibrary} />
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

const Library = React.forwardRef(_Library);

const LibraryWrapper: React.ForwardRefRenderFunction<
  LibraryMethods,
  ReturnType<typeof useCollapsibleTabHeader>
> = (props, ref) => {
  const { isSynced, syncing, total, error } = useIsLibrarySynced();

  if (!isSynced && !error)
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
            {syncing} / {total}
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
  if (!isSynced && error)
    return (
      <Stack space="s" height="100%" p="m" justify-content="center">
        <Text align="center" bold variant="header">
          Syncing failed
        </Text>
        <Text align="center" color="textSecondary">
          {error}
        </Text>
      </Stack>
    );
  return <Library ref={ref} {...props} />;
};

export default React.forwardRef(LibraryWrapper);
