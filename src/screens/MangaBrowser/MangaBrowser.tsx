import {
  Badge,
  Flex,
  FloatingActionButton,
  Icon,
  IconButton,
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
import { TextInput } from 'react-native-gesture-handler';
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions, View } from 'react-native';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import { animate, withAnimatedMounting } from '@utils/Animations';
import useMangaLayout from '@hooks/useMangaLayout';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { ApplyWindowCorrectionEventHandler } from '@utils/RecyclerListView.interfaces';

const dataProviderFn = (r1: Manga, r2: Manga) => r1.title !== r2.title;

const MangaBrowser: React.FC<StackScreenProps<RootStackParamList, 'MangaBrowser'>> = (props) => {
  const {
    navigation,
    route: {
      params: { mangas, source, initialQuery },
    },
  } = props;
  const theme = useTheme();
  const [dataProvider, setDataProvider] = React.useState(new DataProvider(dataProviderFn).cloneWithRows(mangas));
  const { layoutProvider, rowRenderer, extendedState } = useMangaLayout();
  const [showFooter, setShowFooter] = React.useState<boolean>(true);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [reachedEnd, setReachedEnd] = React.useState<boolean>(false);
  const mangahost = useMangaSource(source) as MangaHostWithFilters<Record<string, unknown>>;
  const { FilterModal, schema } = mangahost.getFilterSchema();
  const [filter, setFilters] = React.useState<typeof schema>(schema);
  const [loading, setLoading] = React.useState<boolean>(false);
  const textInputRef = React.useRef<TextInput>(null);
  const scrollRef = React.useRef<React.ElementRef<typeof RecyclerListViewScreen>>(null);
  const floatingRef = React.useRef<React.ElementRef<typeof FloatingActionButton>>(null);
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);
  const [showBadge, setShowBadge] = React.useState<boolean>(false);
  function resetSearchOptions() {
    mangahost.resetPage();
    setReachedEnd(false);
  }

  React.useEffect(() => {
    if (filter != schema) setShowBadge(true);
    else setShowBadge(false);
  }, [filter]);

  const onScroll = React.useCallback(
    (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => {
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
    if (dataProvider.getSize() === 0) setShowFooter(true);
  }, [dataProvider.getSize()]);

  const handleOnShowFilters = React.useCallback(() => {
    setShow(true);
    Keyboard.dismiss();
  }, [setShow]);

  function handleOnScrollToTop() {
    scrollRef.current?.scrollToTop(true);
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
          setDataProvider((prev) => prev.newInstance(dataProviderFn).cloneWithRows(mangas));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    },
    [filter, mangahost, setDataProvider, query]
  );

  const handleOnApplyFilter = React.useCallback(
    async (state: typeof schema) => {
      setLoading(true);
      try {
        mangahost.resetPage();
        setFilters(state);
        const mangas = await mangahost.search(query, state);
        setDataProvider((prev) => prev.newInstance(dataProviderFn).cloneWithRows(mangas));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [query, mangahost, setFilters, setDataProvider, setLoading]
  );

  const handleOnEndReached = React.useCallback(async () => {
    if (!loading && !reachedEnd) {
      setShowFooter(true);
      try {
        mangahost.addPage();
        const mangas = await mangahost.search(query, filter);
        if (
          (dataProvider.getAllData() as Manga[])[dataProvider.getSize() - 1]?.title !== mangas[mangas.length - 1].title
        )
          setDataProvider((prev) => prev.cloneWithRows([...prev.getAllData(), ...mangas]));
        else setReachedEnd(true);
      } catch (e) {
        console.error(e);
      } finally {
        setShowFooter(false);
      }
    }
  }, [filter, query, setDataProvider, dataProvider, loading, setLoading, reachedEnd, setReachedEnd]);

  const handleOnItemLayout = React.useCallback(() => {
    setShowFooter(false);
  }, [setShowFooter]);

  const applyWindowCorrection: ApplyWindowCorrectionEventHandler = (_, __, windowCorrection) => {
    windowCorrection.startCorrection = -pixelToNumber(theme.spacing(3));
  };

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
        {loading ? (
          <View
            style={{
              paddingBottom: pixelToNumber(theme.spacing(3)),
            }}>
            <MangaItemsLoading />
          </View>
        ) : dataProvider.getSize() > 0 ? (
          <>
            <FloatingActionButton
              title='Scroll to top'
              icon={<Icon bundle='Feather' name='chevron-up' />}
              ref={floatingRef}
              onPress={handleOnScrollToTop}
            />
            <RecyclerListView
              dataProvider={dataProvider}
              rowRenderer={rowRenderer as any}
              onItemLayout={handleOnItemLayout}
              onEndReached={handleOnEndReached}
              extendedState={extendedState}
              ref={scrollRef}
              scrollViewProps={{
                contentContainerStyle: {
                  paddingBottom: pixelToNumber(theme.spacing(3)),
                },
              }}
              onScroll={onScroll}
              applyWindowCorrection={applyWindowCorrection}
              layoutProvider={layoutProvider}
              forceNonDeterministicRendering
              canChangeSize
              renderAheadOffset={2000}
              renderFooter={() => (
                <>{showFooter || loading ? animate(<MangaItemsLoading />, withAnimatedMounting) : null}</>
              )}
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
        )}
        <FilterModal show={show} onClose={handleOnCloseFilters} onApplyFilter={handleOnApplyFilter} />
      </>
    );

  return Fallback;
};

export default MangaBrowser;
