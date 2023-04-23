import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { useQuery, useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import LibraryFilterMenu from '@screens/Library/components/LibraryFilterMenu';
import { Freeze } from 'react-freeze';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import { useWindowDimensions } from 'react-native';
import Stack from '@components/Stack';
import { inPlaceSort } from 'fast-sort';
import connector, { ConnectedLibraryProps } from './Library.redux';
import { SORT_LIBRARY_BY } from '@redux/slices/library';
import { FilterState } from '@redux/slices/mainSourceSelector';
import Checkbox from '@components/Checkbox';
import Badge from '@components/Badge';
import Input from '@components/Input';
import { MangaHost } from '@mangayomu/mangascraper';
import useMountedEffect from '@hooks/useMountedEffect';
import { RefreshControl } from 'react-native-gesture-handler';
import useBoolean from '@hooks/useBoolean';

import { useUser } from '@realm/react';
import pLimit from 'p-limit';
import integrateSortedList from '@helpers/integrateSortedList';
import displayMessage from '@helpers/displayMessage';
import { useIsFocused } from '@react-navigation/native';
const limit = pLimit(1);

const Library: React.FC<ConnectedLibraryProps> = ({
  sortBy,
  reversed,
  filters,
  noSourcesSelectedInFilter,
  numberOfAppliedFilters,
  bookHeight,
  bookWidth,
}) => {
  const ref = React.useRef<BottomSheetMethods>(null);
  const [refreshing, setRefreshing] = useBoolean();
  const realm = useRealm();
  const currentUser = useUser();
  const mangas = useQuery(MangaSchema);
  function handleOnPress() {
    ref.current?.snapToIndex(1);
  }
  const applyFilters = React.useMemo(() => {
    const ignoreGenres = new Set<string>();
    const requireGenres = new Set<string>();
    for (const x in filters.Genres) {
      switch (filters.Genres[x]) {
        case FilterState.EXCLUDE:
          ignoreGenres.add(x);
          break;
        case FilterState.INCLUDE:
          requireGenres.add(x);
      }
    }
    return (manga: MangaSchema) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const source = MangaHost.getAvailableSources().get(manga.source)!;
      if (ignoreGenres.size > 0) {
        for (const genre of ignoreGenres) {
          if (
            source.getGenre(genre) != null &&
            manga.genres.has(source.getGenre(genre))
          )
            return false;
        }
      }
      if (requireGenres.size > 0) {
        for (const genre of requireGenres) {
          if (source.getGenre(genre) == null) return false;
          else if (!manga.genres.has(source.getGenre(genre))) return false;
        }
      }
      return filters.Sources[manga.source];
    };
  }, [filters.Genres, filters.Sources]);

  const mangasInLibrary = mangas.filtered('inLibrary == true');
  const isFocused = useIsFocused();
  const [showSearchBar, setShowSearchBar] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>('');
  function handleOnShowSearchBar() {
    setShowSearchBar(true);
  }

  function handleOnBack() {
    setShowSearchBar(false);
  }

  const sortedData = React.useMemo(
    () =>
      inPlaceSort(mangasInLibrary.filter(applyFilters)).by(
        reversed
          ? { desc: SORT_LIBRARY_BY[sortBy] }
          : { asc: SORT_LIBRARY_BY[sortBy] },
      ),
    [sortBy, reversed, mangasInLibrary.length, applyFilters],
  );
  const [data, setData] = React.useState(sortedData);
  useMountedEffect(() => {
    if (query.length > 0) {
      const timeout = setTimeout(
        () =>
          setData(
            sortedData.filter((x) =>
              x.title.toLowerCase().includes(query.toLowerCase()),
            ),
          ),
        300,
      );
      return () => {
        clearTimeout(timeout);
      };
    } else setData(sortedData);
  }, [sortedData, query]);

  const {
    renderItem,
    keyExtractor,
    estimatedItemSize,
    estimatedListSize,
    columns,
    key,
    overrideItemLayout,
    drawDistance,
  } = useMangaFlashlistLayout(
    {
      width: bookWidth,
      height: bookHeight,
    },
    data.length,
  );
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
            onChangeText={setQuery}
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

  React.useEffect(() => {
    (async () => {
      if (refreshing) {
        displayMessage('Fetching updates...');
        let numberOfUpdates = 0;
        const updates = mangasInLibrary.map((manga) =>
          limit(async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const host = MangaHost.getAvailableSources().get(manga.source)!;
            const meta = await host.getMeta(manga);
            if (meta.chapters.length !== manga.chapters.length) {
              numberOfUpdates++;
              realm.write(() => {
                realm.create<MangaSchema>(
                  MangaSchema,
                  {
                    _id: meta.link,
                    _realmId: currentUser?.id,
                    notifyNewChaptersCount:
                      manga.notifyNewChaptersCount +
                      (meta.chapters.length - manga.chapters.length),
                    description: meta.description,
                    genres: meta.genres as unknown as Set<string>,
                    imageCover: meta.imageCover,
                    index: meta.index,
                    source: meta.source,
                    title: meta.title,
                    chapters: meta.chapters.map((x) => x.link),
                  },
                  Realm.UpdateMode.Modified,
                );
              });
              if (
                sortBy === 'Number of updates' ||
                sortBy === 'Number of available chapters (multilingual)'
              )
                setData((prev) => {
                  integrateSortedList(
                    prev,
                    SORT_LIBRARY_BY[sortBy],
                  ).insertionSort();
                  return [...prev];
                });
            }
          }),
        );
        try {
          await Promise.all(updates);
        } finally {
          setRefreshing(false);
          if (numberOfUpdates > 0)
            displayMessage(
              `Successfully updated ${numberOfUpdates} manga${
                numberOfUpdates !== 1 ? 's' : ''
              }.`,
            );
          else displayMessage('No updates were found.');
        }
      }
    })();
  }, [refreshing]);

  return (
    <>
      <FlashList
        extraData={isFocused}
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
        key={key}
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
          <ListEmptyComponent
            libraryIsEmpty={mangasInLibrary.length === 0}
            noSourcesSelected={noSourcesSelectedInFilter}
          />
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
  noSourcesSelected: boolean;
}> = React.memo(({ libraryIsEmpty, noSourcesSelected }) => {
  const { height } = useWindowDimensions();

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

export default connector(Library);
