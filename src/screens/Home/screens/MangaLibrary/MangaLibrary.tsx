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
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import useLazyLoading from '@hooks/useLazyLoading';
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
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { Keyboard, NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useTheme } from 'styled-components/native';

const Spacing = () => <Spacer y={4} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas, navigation, history } = props;

  const { ready, Fallback } = useLazyLoading();
  const theme = useTheme();
  const textRef = React.useRef<TextInput>();
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

  const { sortOptions, selectedSortOption } = useSort((_createSort) => {
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
      'Date Modified': createSort((a, b) => Date.parse(a.date.modified) - Date.parse(b.date.modified)),
      'Date Published': createSort((a, b) => Date.parse(a.date.published) - Date.parse(b.date.published)),
      Source: createSort((a, b) => a.source.localeCompare(b.source)),
    };
  });

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

  const data = React.useMemo(
    () => mangas.filter(({ manga }) => titleIncludes(query)(manga)).sort(selectedSortOption),
    [selectedSortOption, query]
  );

  if (!ready) return Fallback;

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: pixelToNumber(theme.spacing(3)) }}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      ItemSeparatorComponent={Spacing}
      numColumns={2}
      renderItem={renderItem}
      data={data}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
