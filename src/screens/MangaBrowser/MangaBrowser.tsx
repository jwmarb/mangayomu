import { Icon, IconButton, RecyclerListViewScreen } from '@components/core';
import useLazyLoading from '@hooks/useLazyLoading';
import useSearchBar from '@hooks/useSearchBar';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import useMangaSource from '@hooks/useMangaSource';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { FilterState } from '@utils/MangaFilters/schema';
import React from 'react';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { Manga } from '@services/scraper/scraper.interfaces';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { layoutProvider, rowRenderer } from '@screens/GenericMangaList/GenericMangaList.recycler';
import { ApplyWindowCorrectionEventHandler } from '@utils/RecyclerListView.interfaces';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';
import { MangaItemsLoading } from '@screens/GenericMangaList/GenericMangaList.base';
import useMountedEffect from '@hooks/useMountedEffect';
import { TextInput } from 'react-native-gesture-handler';
import { Keyboard } from 'react-native';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';

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
  const [showFooter, setShowFooter] = React.useState<boolean>(true);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const mangahost = useMangaSource(source) as MangaHostWithFilters<Record<string, unknown>>;
  const { FilterModal, schema } = mangahost.getFilterSchema();
  const [filter, setFilters] = React.useState<typeof schema>(schema);
  const scrollRef = React.useRef<TextInput>(null);
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);
  const handleOnShowFilters = React.useCallback(() => {
    setShow(true);
    Keyboard.dismiss();
  }, [setShow]);
  function handleOnCloseFilters() {
    setShow(false);
  }
  const handleOnSubmitEditing = React.useCallback(
    async (text: string) => {
      if (query !== text) {
        mangahost.resetPage();
        const mangas = await mangahost.search(text, filter);
        setDataProvider((prev) => prev.newInstance(dataProviderFn).cloneWithRows(mangas));
      }
    },
    [filter, mangahost, setDataProvider, query]
  );

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: () => (
        <Search
          additionalButtons={React.useMemo(
            () => (
              <IconButton icon={<Icon bundle='Feather' name='filter' />} onPress={handleOnShowFilters} />
            ),
            [handleOnShowFilters]
          )}
          ref={scrollRef}
          title={source}
          showSearchBar={true}
          onChangeText={setQuery}
          defaultText={initialQuery}
          onExitSearch={handleOnExitSearch}
          onSubmitEditing={handleOnSubmitEditing}
        />
      ),
    },
    config: {
      useNativeDriver: true,
    },
  };

  const collapsible = useCollapsibleHeader(options);

  const [loading, setLoading] = React.useState<boolean>(false);
  const { ready, Fallback } = useLazyLoading();
  const handleOnApplyFilter = React.useCallback(
    async (state: typeof schema) => {
      mangahost.resetPage();
      setFilters(state);
      const mangas = await mangahost.search(query, state);
      setDataProvider((prev) => prev.newInstance(dataProviderFn).cloneWithRows(mangas));
    },
    [query, mangahost, setFilters, setDataProvider]
  );

  const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
    (offsetX, offsetY, windowCorrection) => {
      windowCorrection.windowShift = -collapsible.containerPaddingTop;
    },
    [collapsible.containerPaddingTop]
  );

  const handleOnEndReached = React.useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        mangahost.addPage();
        const mangas = await mangahost.search(query, filter);
        setDataProvider((prev) => prev.cloneWithRows(mangas));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  }, [filter, query, setDataProvider, loading, setLoading]);

  React.useEffect(() => {
    return () => {
      mangahost.resetPage();
    };
  }, []);

  const handleOnItemLayout = React.useCallback(() => {
    setShowFooter(false);
  }, [setShowFooter]);

  React.useEffect(() => {
    if (dataProvider.getSize() === 0) setShowFooter(true);
  }, [dataProvider.getSize()]);

  if (ready)
    return (
      <>
        {dataProvider.getSize() > 0 && (
          <RecyclerListViewScreen
            dataProvider={dataProvider}
            collapsible={collapsible}
            applyWindowCorrection={applyWindowCorrection}
            rowRenderer={rowRenderer}
            onItemLayout={handleOnItemLayout}
            forceNonDeterministicRendering
            onEndReached={handleOnEndReached}
            scrollViewProps={{
              contentContainerStyle: {
                paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
                paddingBottom: pixelToNumber(theme.spacing(3)),
              },
            }}
            layoutProvider={layoutProvider}
            renderFooter={() => (showFooter || loading ? <MangaItemsLoading /> : null)}
          />
        )}
        <FilterModal show={show} onClose={handleOnCloseFilters} onApplyFilter={handleOnApplyFilter} />
      </>
    );

  return Fallback;
};

export default MangaBrowser;
