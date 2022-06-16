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
import { useFocusEffect } from '@react-navigation/native';
import { LibraryManga } from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
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
} from '@screens/Home/screens/MangaLibrary/MangaLibrary.recycler';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { Keyboard } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useTheme } from 'styled-components/native';
import LibraryIsEmpty from './components/LibraryIsEmpty';
import NoItemsFound from './components/NoItemsFound';
import PropTypes from 'prop-types';
(RecyclerListView.propTypes as { externalScrollView: {} }).externalScrollView = PropTypes.object;

const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas, navigation, history, cols, fontSize } = props;
  const { ready, Fallback } = useLazyLoading();
  const [dataProvider, setDataProvider] = React.useState<DataProvider>(
    new DataProvider(dataProviderFn).cloneWithRows(mangas)
  );
  const [layoutProvider, setLayoutProvider] = React.useState<LayoutProvider>(generateNewLayout(cols, fontSize));

  const [expand, setExpand] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleOnExpand = React.useCallback(() => {
    Keyboard.dismiss();
    setExpand(true);
  }, [setExpand]);
  const handleOnClose = React.useCallback(() => {
    setExpand(false);
  }, [setExpand]);

  const { query, header } = useSearchBar({
    title: 'Library',
    focusCondition: !expand,
    additionalButtons: (
      <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='filter-menu' />} onPress={handleOnExpand} />
    ),
  });

  const { sortOptions, selectedSortOption, sort, reverse } = useSort((_createSort) => {
    const createSort = (
      compareFn: (a: ReadingMangaInfo & LibraryManga, b: ReadingMangaInfo & LibraryManga) => number
    ) => {
      return _createSort((a: LibraryManga, b: LibraryManga) => {
        const mangaA = history[a.manga.link];
        const mangaB = history[b.manga.link];
        return compareFn({ ...mangaA, ...a }, { ...mangaB, ...b });
      });
    };
    return {
      'Age in Library': createSort((a, b) => Date.parse(a.dateAdded) - Date.parse(b.dateAdded)),
      Alphabetical: createSort((a, b) => a.title.localeCompare(b.title)),
      'Chapter Count': createSort((a, b) => a.chapters.length - b.chapters.length),
      'Genres Count': createSort((a, b) => a.genres.length - b.genres.length),
      Source: createSort((a, b) => a.source.localeCompare(b.source)),
    };
  });

  useStatefulHeader(
    ready ? (
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
    ) : (
      Fallback
    )
  );

  useMountedEffect(() => {
    setLayoutProvider(generateNewLayout(cols, fontSize));
  }, [cols]);

  useMountedEffect(() => {
    setDataProvider((prev) =>
      prev
        .newInstance(dataProviderFn)
        .cloneWithRows(mangas.filter((x) => titleIncludes(query)(x.manga)).sort(selectedSortOption))
    );
  }, [mangas.length, query, sort, reverse]);

  if (!ready) return Fallback;

  if (dataProvider.getSize() === 0 && mangas.length === 0) return <LibraryIsEmpty />;

  if (dataProvider.getSize() === 0 && mangas.length > 0) return <NoItemsFound query={query} />;

  return (
    <RecyclerListView
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={rowRenderer}
      // forceNonDeterministicRendering
      scrollViewProps={{ contentContainerStyle: { paddingTop: 24, paddingBottom: 64 } }}
    />
  );
};

export default connector(MangaLibrary);
