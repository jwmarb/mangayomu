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
import { ScrollView } from 'react-native-gesture-handler';

const MangaBrowser: React.FC<StackScreenProps<RootStackParamList, 'MangaBrowser'>> = (props) => {
  const {
    navigation,
    route: {
      params: { mangas, source, initialQuery },
    },
  } = props;
  const theme = useTheme();
  const [dataProvider, setDataProvider] = React.useState(
    new DataProvider((r1: Manga, r2: Manga) => r1.title !== r2.title).cloneWithRows(mangas)
  );
  const [showFooter, setShowFooter] = React.useState<boolean>(true);
  const mangahost = useMangaSource(source) as MangaHostWithFilters<Record<string, unknown>>;
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);
  function handleOnShowFilters() {
    setShow(true);
  }
  function handleOnCloseFilters() {
    setShow(false);
  }
  const { query, header } = useSearchBar({
    title: source,
    initialQuery,
    alwaysShowSearchBar: true,
    onExitSearch: handleOnExitSearch,
    event: 'onSubmitEditing',
    additionalButtons: <IconButton icon={<Icon bundle='Feather' name='filter' />} onPress={handleOnShowFilters} />,
  });
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: () => header,
    },
    config: {
      useNativeDriver: true,
    },
  };
  const collapsible = useCollapsibleHeader(options);
  const { FilterModal, schema } = mangahost.getFilterSchema();
  const [filter, setFilters] = React.useState<typeof schema>(schema);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { ready, Fallback } = useLazyLoading();
  async function handleOnApplyFilter(state: typeof schema) {
    setFilters(state);
    const mangas = await mangahost.search(query, state);
    setDataProvider((prev) => prev.newInstance((r1: Manga, r2: Manga) => r1.title !== r2.title).cloneWithRows(mangas));
  }

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

  useMountedEffect(() => {
    handleOnApplyFilter(filter);
  }, [query]);

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
