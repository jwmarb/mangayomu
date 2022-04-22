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
} from '@components/core';
import { FlatListScreen } from '@components/core';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import useLazyLoading from '@hooks/useLazyLoading';
import { useFocusEffect } from '@react-navigation/native';
import { LibraryManga } from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { ExpandedSortContainer } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useTheme } from 'styled-components/native';

const Spacing = () => <Spacer y={4} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas, navigation, history } = props;
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const [reverse, setReverse] = React.useState<boolean>(false);
  const { ready, Fallback } = useLazyLoading();
  const [query, setQuery] = React.useState<string>('');
  const theme = useTheme();
  const textRef = React.useRef<TextInput>();
  const handleToggleSearch = React.useCallback(() => {
    setShowSearch((prev) => !prev);
  }, [setShowSearch]);
  const handleOnSubmitEditing = React.useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      console.log(`searching for: ${e.nativeEvent.text}`);
    },
    [query]
  );
  const [expand, setExpand] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleOnExpand = React.useCallback(() => {
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

  const header = React.useCallback(
    () => (
      <>
        <HeaderBuilder horizontalPadding paper>
          <Flex shrink alignItems='center'>
            {showSearch ? (
              <>
                <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={handleToggleSearch} />
                <Spacer x={1} />
                <TextField
                  placeholder='Search for a title'
                  ref={textRef}
                  onChangeText={setQuery}
                  onSubmitEditing={handleOnSubmitEditing}
                />
              </>
            ) : (
              <>
                <MangaSource />
                <Spacer x={1} />
                <Typography variant='subheader'>Library</Typography>
              </>
            )}
          </Flex>
          <Flex spacing={1} grow justifyContent='flex-end' alignItems='center'>
            {!showSearch && <IconButton icon={<Icon bundle='Feather' name='search' />} onPress={handleToggleSearch} />}
            <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} onPress={handleOnExpand} />
          </Flex>
        </HeaderBuilder>
        <Modal onClose={handleOnClose} visible={expand}>
          <Tabs onTabChange={setTabIndex} tabIndex={tabIndex}>
            <Tab name='Filter'></Tab>
            <Tab name='Sort'>
              {Object.keys(sortTypes).map((sortBy) => (
                <Typography key={sortBy}>{sortBy}</Typography>
              ))}
            </Tab>
          </Tabs>
        </Modal>
      </>
    ),
    [
      showSearch,
      setQuery,
      handleToggleSearch,
      handleOnSubmitEditing,
      handleOnExpand,
      expand,
      handleOnClose,
      tabIndex,
      setTabIndex,
      sortTypes,
    ]
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      header: header,
    });
  }, [showSearch, setQuery, handleToggleSearch, handleOnSubmitEditing, handleOnExpand, expand, tabIndex, setTabIndex]);

  React.useEffect(() => {
    setTimeout(() => {
      if (showSearch) textRef.current?.focus();
      else setQuery('');
    }, 100);
  }, [showSearch]);

  if (!ready) return Fallback;

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: pixelToNumber(theme.spacing(3)) }}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      ItemSeparatorComponent={Spacing}
      numColumns={2}
      renderItem={renderItem}
      data={mangas.filter(({ manga }) => titleIncludes(query)(manga))}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
