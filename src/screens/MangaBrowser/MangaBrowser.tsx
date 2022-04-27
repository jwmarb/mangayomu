import { Button, Flex, Icon, IconButton, RecyclerListViewScreen, Screen, Spacer, Typography } from '@components/core';
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
import { Keyboard, View } from 'react-native';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import { animate, withAnimatedMounting } from '@utils/Animations';

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const scrollRef = React.useRef<TextInput>(null);
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: () => (
        <Search
          additionalButtons={React.useMemo(
            () => (
              <IconButton
                icon={<Icon bundle='MaterialCommunityIcons' name='filter-outline' />}
                onPress={handleOnShowFilters}
              />
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

  const { ready, Fallback } = useLazyLoading();

  React.useEffect(() => {
    return () => {
      mangahost.resetPage();
    };
  }, []);

  React.useEffect(() => {
    if (dataProvider.getSize() === 0) setShowFooter(true);
  }, [dataProvider.getSize()]);

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
        setLoading(true);
        try {
          mangahost.resetPage();
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

  const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
    (offsetX, offsetY, windowCorrection) => {
      windowCorrection.windowShift = -collapsible.containerPaddingTop;
    },
    [collapsible.containerPaddingTop]
  );

  const handleOnEndReached = React.useCallback(async () => {
    if (!loading) {
      setShowFooter(true);
      try {
        mangahost.addPage();
        const mangas = await mangahost.search(query, filter);
        setDataProvider((prev) => prev.cloneWithRows(mangas));
      } catch (e) {
        console.error(e);
      } finally {
        setShowFooter(false);
      }
    }
  }, [filter, query, setDataProvider, loading, setLoading]);

  const handleOnItemLayout = React.useCallback(() => {
    setShowFooter(false);
  }, [setShowFooter]);

  if (ready)
    return (
      <>
        {loading ? (
          <View
            style={{
              paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
              paddingBottom: pixelToNumber(theme.spacing(3)),
            }}>
            <MangaItemsLoading />
          </View>
        ) : dataProvider.getSize() > 0 ? (
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
            renderFooter={() => (showFooter || loading ? animate(<MangaItemsLoading />, withAnimatedMounting) : null)}
          />
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
