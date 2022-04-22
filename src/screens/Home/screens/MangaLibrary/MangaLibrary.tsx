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
  const [reverse, setReverse] = React.useState<boolean>(false);

  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const { ready, Fallback } = useLazyLoading();
  const [query, setQuery] = React.useState<string>('');
  const theme = useTheme();
  const textRef = React.useRef<TextInput>();
  const handleToggleSearch = React.useCallback(() => {
    setShowSearch((prev) => !prev);
  }, [setShowSearch]);

  const [expand, setExpand] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleOnExpand = React.useCallback(() => {
    Keyboard.dismiss();
    setExpand(true);
  }, [setExpand]);
  const handleOnClose = React.useCallback(() => {
    setExpand(false);
  }, [setExpand]);

  const createSort = React.useCallback(
    (compareFn: (a: ReadingMangaInfo, b: ReadingMangaInfo) => number) => {
      return (a: LibraryManga, b: LibraryManga) => {
        const mangaA = history[a.manga.link];
        const mangaB = history[b.manga.link];
        if (reverse) return -compareFn(mangaA, mangaB);
        return compareFn(mangaA, mangaB);
      };
    },
    [history, reverse]
  );

  const sortTypes = React.useMemo(
    () => ({
      Alphabetical: createSort((a, b) => a.title.localeCompare(b.title)),
      'Chapter Count': createSort((a, b) => a.chapters.length - b.chapters.length),
      'Genres Count': createSort((a, b) => a.genres.length - b.genres.length),
      'Date Modified': createSort((a, b) => Date.parse(a.date.modified) - Date.parse(b.date.modified)),
      'Date Published': createSort((a, b) => Date.parse(a.date.published) - Date.parse(b.date.published)),
      Source: createSort((a, b) => a.source.localeCompare(b.source)),
    }),
    [createSort]
  );

  const [sort, setSort] = React.useState<keyof typeof sortTypes>('Alphabetical');

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      header: () => (
        <>
          <Search
            showSearch={showSearch}
            ref={textRef as any}
            onExpand={handleOnExpand}
            onToggleSearch={handleToggleSearch}
            setQuery={setQuery}
          />
          <FilterModal
            sort={sort}
            reverse={reverse}
            setReverse={setReverse}
            setSort={setSort as any}
            onClose={handleOnClose}
            expand={expand}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            sortTypes={Object.keys(sortTypes)}
          />
        </>
      ),
    });
  });

  React.useEffect(() => {
    if (!expand)
      setTimeout(() => {
        if (showSearch) textRef.current?.focus();
        else setQuery('');
      }, 100);
  }, [showSearch]);

  const data = React.useMemo(
    () => mangas.filter(({ manga }) => titleIncludes(query)(manga)).sort(sortTypes[sort]),
    [sortTypes, sort, query]
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
