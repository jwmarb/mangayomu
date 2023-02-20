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
import { useWindowDimensions } from 'react-native';
import { Stack } from '@components/Stack';
import { inPlaceSort } from 'fast-sort';
import connector, { ConnectedLibraryProps } from './Library.redux';
import { SORT_LIBRARY_BY } from '@redux/slices/library';
import { FilterState } from '@redux/slices/mainSourceSelector';

const Library: React.FC<ConnectedLibraryProps> = ({
  sortBy,
  reversed,
  filters,
}) => {
  const ref = React.useRef<BottomSheetMethods>(null);
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
  const data = React.useMemo(
    () =>
      inPlaceSort(mangasInLibrary.filter(applyFilters)).by(
        reversed
          ? { desc: SORT_LIBRARY_BY[sortBy] }
          : { asc: SORT_LIBRARY_BY[sortBy] },
      ),
    [sortBy, reversed, mangasInLibrary, applyFilters],
  );
  const { renderItem, keyExtractor, estimatedItemSize, columns, key } =
    useMangaFlashlistLayout<MangaSchema>(bookDimensions);
  const { scrollViewStyle, contentContainerStyle, onScroll } =
    useCollapsibleTabHeader({
      headerTitle: 'Library',
      headerRight:
        data.length > 0 ? (
          <IconButton
            icon={<Icon type="font" name="filter-menu" />}
            onPress={handleOnPress}
          />
        ) : null,
      dependencies: [data.length > 0],
    });
  return (
    <>
      <FlashList
        onScroll={onScroll}
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
        ListEmptyComponent={ListEmptyComponent}
      />
      <Freeze freeze={data.length === 0}>
        <LibraryFilterMenu ref={ref} />
      </Freeze>
    </>
  );
};

const ListEmptyComponent = React.memo(() => {
  const { height } = useWindowDimensions();

  return (
    <Box height={height} p="m" flex-grow justify-content="center">
      <Text variant="header" align="center">
        Your library is empty
      </Text>
      <Text color="textSecondary" align="center">
        To add a manga to your library, navigate to a manga and press{' '}
        <Icon type="font" name="bookmark-outline" /> at the top right corner, or
        press the
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
});

export default connector(Library);
