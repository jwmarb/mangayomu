import {
  Screen,
  Container,
  Typography,
  IconButton,
  Icon,
  Spacer,
  TextField,
  Flex,
  Modal,
  Tabs,
  Tab,
  ListItem,
  List,
  Button,
} from '@components/core';
import { FlatListScreen } from '@components/core';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import useLazyLoading from '@hooks/useLazyLoading';
import useMountedEffect from '@hooks/useMountedEffect';
import useSearchBar from '@hooks/useSearchBar';
import useSort from '@hooks/useSort';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import FilterModal from '@screens/Home/screens/MangaLibrary/components/FilterModal';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import { ExpandedSortContainer } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import {
  ReverseContext,
  SetReverseContext,
  SetSortContext,
  SortContext,
} from '@screens/Home/screens/MangaLibrary/MangaLibrary.context';
import {
  dataProviderFn,
  generateNewLayout,
  rowRenderer,
} from '@screens/Home/screens/MangaLibrary/components/MangaLibraryRLV/MangaLibraryRLV.recycler';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { FlatList, Keyboard, RefreshControl, useWindowDimensions } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useTheme } from 'styled-components/native';
import LibraryIsEmpty from '../../components/LibraryIsEmpty';
import NoItemsFound from '../../components/NoItemsFound';
import PropTypes from 'prop-types';
import { renderItem, keyExtractor } from './MangaLibraryFlatList.flatlist';
import { Orientation } from 'expo-screen-orientation';
import displayMessage from '@utils/displayMessage';
import MangaHost from '@services/scraper/scraper.abstract';
import pLimit from 'p-limit';
const limit = pLimit(1);

const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const {
    mangas: recordMangas,
    navigation,
    history,
    cols,
    fontSize,
    searchInLibrary,
    query,
    orientation,
    appendNewChapters,
    type,
    sort: initialSort,
    setSortMethod,
    reversed: initialReversed,
    toggleReverseSort,
  } = props;
  const mangas = React.useMemo(() => Object.keys(recordMangas), [recordMangas]);
  const [mangaList, setMangaList] = React.useState<string[]>(mangas);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (refreshing) {
      displayMessage('Fetching updates...');
      setRefreshing(false);
      for (const mangaKey in recordMangas) {
        limit(async () => {
          const meta = await MangaHost.availableSources.get(history[mangaKey].source)!.getMeta(history[mangaKey]);
          appendNewChapters({ ...history[mangaKey], ...meta });
        });
      }
    }
  }, [refreshing]);

  const { width, height } = useWindowDimensions();
  const numOfColumnsPortrait = React.useMemo(() => {
    switch (orientation) {
      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const numOfColumnsLandscape = React.useMemo(() => {
    switch (orientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));

      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const [expand, setExpand] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleOnRefresh = () => {
    setRefreshing(true);
  };
  const handleOnExpand = React.useCallback(() => {
    Keyboard.dismiss();
    setExpand(true);
  }, [setExpand]);
  const handleOnClose = React.useCallback(() => {
    setExpand(false);
  }, [setExpand]);

  const { header } = useSearchBar({
    title: 'Library',
    focusCondition: !expand,
    additionalButtons: (
      <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='filter-menu' />} onPress={handleOnExpand} />
    ),
    stateSetter: [query, searchInLibrary as any],
  });
  const theme = useTheme();
  const { sortOptions, selectedSortOption, reverse, sort } = useSort(
    (_createSort) => {
      const createSort = (compareFn: (a: ReadingMangaInfo, b: ReadingMangaInfo) => number) => {
        return _createSort((a: string, b: string) => {
          const mangaA = history[a];
          const mangaB = history[b];
          return compareFn(mangaA, mangaB);
        });
      };
      return {
        'Age in library': createSort((a, b) => Date.parse(a.dateAddedInLibrary!) - Date.parse(b.dateAddedInLibrary!)),
        Alphabetical: createSort((a, b) => a.title.localeCompare(b.title)),
        'Chapter count': createSort((a, b) => Object.keys(a.chapters).length - Object.keys(b.chapters).length),
        'Genres count': createSort((a, b) => a.genres.length - b.genres.length),
        Source: createSort((a, b) => a.source.localeCompare(b.source)),
        'Number of updates': createSort((a, b) => a.newChapters - b.newChapters),
      };
    },
    initialSort,
    setSortMethod,
    initialReversed,
    toggleReverseSort
  );

  useStatefulHeader(
    <>
      {header}
      <FilterModal
        sortOptions={sortOptions}
        onClose={handleOnClose}
        expand={expand}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
    </>
  );
  useMountedEffect(() => {
    setMangaList(mangas.filter((x) => titleIncludes(query)(history[x])).sort(selectedSortOption));
  }, [mangas.length, query, sort, reverse]);

  if (mangas.length === 0) return <LibraryIsEmpty />;

  if (query && mangas.length > 0 && mangaList.length === 0) return <NoItemsFound query={query} />;

  return (
    <FlatList
      key={orientation}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={
        orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN
          ? numOfColumnsPortrait
          : numOfColumnsLandscape
      }
      data={mangaList}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}
      contentContainerStyle={{
        paddingTop: pixelToNumber(theme.spacing(2)),
        paddingBottom: pixelToNumber(theme.spacing(24)),
        alignItems: 'center',
      }}
    />
  );
};

export default connector(MangaLibrary);
