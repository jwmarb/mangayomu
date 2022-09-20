import {
  Badge,
  Flex,
  FloatingActionButton,
  Icon,
  IconButton,
  MangaList,
  RecyclerListViewScreen,
  Typography,
} from '@components/core';
import useLazyLoading from '@hooks/useLazyLoading';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import useMangaSource from '@hooks/useMangaSource';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import React from 'react';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { Manga } from '@services/scraper/scraper.interfaces';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';
import { MangaItemsLoading } from '@screens/GenericMangaList/GenericMangaList.base';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions, View } from 'react-native';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import { animate, withAnimatedMounting } from '@utils/Animations';
import useMangaLayout from '@hooks/useMangaLayout';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { ApplyWindowCorrectionEventHandler } from '@utils/RecyclerListView.interfaces';
import { keyExtractor, renderItem } from '@screens/GenericMangaList/GenericMangaList.flatlist';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const MangaBrowser: React.FC<StackScreenProps<RootStackParamList, 'MangaBrowser'>> = (props) => {
  const {
    navigation,
    route: {
      params: { mangas, source, initialQuery },
    },
  } = props;
  const theme = useTheme();
  const [mangaList, setMangaList] = React.useState<Manga[] | undefined>(mangas);
  const [showFooter, setShowFooter] = React.useState<boolean>(true);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [reachedEnd, setReachedEnd] = React.useState<boolean>(false);
  const mangahost = useMangaSource(source) as MangaHostWithFilters<Record<string, unknown>>;
  const { FilterModal, schema } = mangahost.getFilterSchema();
  const [filter, setFilters] = React.useState<typeof schema>(schema);
  const [loading, setLoading] = React.useState<boolean>(true);
  const textInputRef = React.useRef<TextInput>(null);
  const scrollRef = React.useRef<FlatList>(null);
  const floatingRef = React.useRef<React.ElementRef<typeof FloatingActionButton>>(null);
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);
  const [showBadge, setShowBadge] = React.useState<boolean>(false);
  const isFocused = useIsFocused();
  function resetSearchOptions() {
    mangahost.resetPage();
    setReachedEnd(false);
  }

  React.useEffect(() => {
    if (filter != schema) setShowBadge(true);
    else setShowBadge(false);
  }, [filter]);

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {
        nativeEvent: {
          contentOffset: { y: offsetY },
        },
      } = event;
      if (offsetY > 100) floatingRef.current?.expand();
      else floatingRef.current?.collapse();
    },
    [floatingRef.current]
  );

  const { ready, Fallback } = useLazyLoading();

  React.useEffect(() => {
    return resetSearchOptions;
  }, []);

  React.useEffect(() => {
    if (mangaList && mangaList.length === 0) setShowFooter(true);
  }, [mangaList]);

  const handleOnShowFilters = React.useCallback(() => {
    setShow(true);
    Keyboard.dismiss();
  }, [setShow]);

  function handleOnScrollToTop() {
    scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  function handleOnCloseFilters() {
    setShow(false);
  }
  const handleOnSubmitEditing = React.useCallback(
    async (text: string) => {
      if (query !== text) {
        setLoading(true);
        try {
          resetSearchOptions();
          const mangas = await mangahost.search(text, filter);
          setMangaList(mangas);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    },
    [filter, mangahost, setMangaList, query]
  );

  React.useEffect(() => {
    if (mangas == null) {
      mangahost
        .search('')
        .then((mangas) => {
          if (mangas.length > 0) setMangaList(mangas);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleOnApplyFilter = React.useCallback(
    async (state: typeof schema) => {
      setLoading(true);
      try {
        mangahost.resetPage();
        setFilters(state);
        const mangas = await mangahost.search(query, state);
        setMangaList(mangas);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [query, mangahost, setFilters, setMangaList, setLoading]
  );

  const handleOnEndReached = React.useCallback(async () => {
    if (!loading && !reachedEnd) {
      setShowFooter(true);
      try {
        mangahost.addPage();
        const mangas = await mangahost.search(query, filter);
        if (mangaList && mangaList[mangaList.length - 1]?.title !== mangas[mangas.length - 1].title)
          setMangaList((prev) => [...(prev as Manga[]), ...mangas]);
        else setReachedEnd(true);
      } catch (e) {
        console.error(e);
      } finally {
        setShowFooter(false);
      }
    }
  }, [filter, query, setMangaList, mangaList, loading, setLoading, reachedEnd, setReachedEnd]);

  const handleOnItemLayout = React.useCallback(() => {
    setShowFooter(false);
  }, [setShowFooter]);

  useStatefulHeader(
    <Search
      additionalButtons={
        <Badge show={showBadge}>
          <IconButton
            icon={<Icon bundle='MaterialCommunityIcons' name='filter-outline' />}
            onPress={handleOnShowFilters}
          />
        </Badge>
      }
      ref={textInputRef}
      title={source}
      showSearchBar={true}
      onChangeText={setQuery}
      defaultText={initialQuery}
      onExitSearch={handleOnExitSearch}
      onSubmitEditing={handleOnSubmitEditing}
    />,
    [showBadge]
  );

  if (ready)
    return (
      <>
        {loading && (
          <View
            style={{
              paddingBottom: pixelToNumber(theme.spacing(3)),
            }}>
            <MangaItemsLoading />
          </View>
        )}
        {!loading && mangaList == null && (
          <Flex container horizontalPadding={3} justifyContent='center' alignItems='center' grow direction='column'>
            <Typography variant='subheader' align='center'>
              Search for a manga
            </Typography>
            <Typography color='textSecondary' align='center'>
              Search for manga using {mangahost.getName()}
            </Typography>
          </Flex>
        )}
        {mangaList &&
          (mangaList.length > 0 ? (
            <>
              {isFocused && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <FloatingActionButton
                    title='Scroll to top'
                    icon={<Icon bundle='Feather' name='chevron-up' />}
                    ref={floatingRef}
                    onPress={handleOnScrollToTop}
                  />
                </Animated.View>
              )}
              <MangaList
                ref={scrollRef}
                data={mangaList}
                onEndReachedThreshold={0.1}
                onScroll={onScroll}
                renderItem={renderItem}
                onEndReached={handleOnEndReached}
                onLayout={handleOnItemLayout}
                ListFooterComponent={showFooter ? <MangaItemsLoading /> : null}
              />
            </>
          ) : (
            <Flex container horizontalPadding={3} justifyContent='center' alignItems='center' grow direction='column'>
              <Typography variant='subheader' align='center'>
                No items found
              </Typography>
              <Typography color='textSecondary' align='center'>
                {mangahost.getName()} does not have the manga you are looking for
              </Typography>
            </Flex>
          ))}
        <FilterModal show={show} onClose={handleOnCloseFilters} onApplyFilter={handleOnApplyFilter} />
      </>
    );

  return Fallback;
};

export default MangaBrowser;
