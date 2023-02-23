import { bookDimensions } from '@components/Book';
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { useQuery } from '@database/main';
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
import { StatusBar, useWindowDimensions } from 'react-native';
import { Stack } from '@components/Stack';
import { inPlaceSort } from 'fast-sort';
import connector, { ConnectedLibraryProps } from './Library.redux';
import { SORT_LIBRARY_BY } from '@redux/slices/library';
import { FilterState } from '@redux/slices/mainSourceSelector';
import Checkbox from '@components/Checkbox';
import Badge from '@components/Badge';
import Input from '@components/Input';
import { Portal } from '@gorhom/portal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Library: React.FC<ConnectedLibraryProps> = ({
  sortBy,
  reversed,
  filters,
  noSourcesSelectedInFilter,
  numberOfAppliedFilters,
}) => {
  const ref = React.useRef<BottomSheetMethods>(null);
  const inputRef = React.useRef<React.ElementRef<typeof Input>>(null);
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
      if (ignoreGenres.size > 0) {
        for (const genre of ignoreGenres) {
          if (manga.genres.has(genre)) return false;
        }
      }
      if (requireGenres.size > 0) {
        for (const genre of requireGenres) {
          if (!manga.genres.has(genre)) return false;
        }
      }
      if (manga.source in filters.Sources === false) return false;
      return true;
    };
  }, [filters.Genres, filters.Sources]);

  const mangasInLibrary = mangas.filtered('inLibrary == true');
  const [showSearchBar, setShowSearchBar] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>('');
  function handleOnShowSearchBar() {
    setShowSearchBar(true);
    inputRef.current?.focus();
  }

  function handleOnBack() {
    inputRef.current?.blur();
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
  const data = React.useMemo(
    () =>
      sortedData.filter((x) =>
        x.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [sortedData, query],
  );
  const { renderItem, keyExtractor, estimatedItemSize, columns, key } =
    useMangaFlashlistLayout<MangaSchema>(bookDimensions);
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
          <Stack space="s" maxWidth="80%" flex-direction="row">
            <IconButton
              icon={<Icon type="font" name="arrow-left" />}
              onPress={handleOnBack}
            />
            <Input
              defaultValue={query}
              ref={inputRef}
              onChangeText={setQuery}
              placeholder="Search for a title..."
              width="100%"
            />
          </Stack>
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
      headerRightProps: { 'flex-shrink': true },
      dependencies: [
        mangasInLibrary.length > 0,
        numberOfAppliedFilters,
        showSearchBar,
        query.length > 0,
      ],
    });

  React.useEffect(() => {
    if (showSearchBar) inputRef.current?.focus();
  }, [showSearchBar]);

  return (
    <>
      {/* <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        z-index={1000}
      >
        <Animated.View style={inputStyle}>
          
        </Animated.View>
      </Box> */}
      <FlashList
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
        ListEmptyComponent={
          <ListEmptyComponent
            libraryIsEmpty={mangasInLibrary.length === 0}
            noSourcesSelected={noSourcesSelectedInFilter}
          />
        }
      />
      <Freeze freeze={mangasInLibrary.length === 0}>
        <LibraryFilterMenu ref={ref} />
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
