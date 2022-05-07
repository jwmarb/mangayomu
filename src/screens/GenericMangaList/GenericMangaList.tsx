import RecyclerListViewScreen from '@components/RecyclerListViewScreen';
import Screen, { Header } from '@components/Screen';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider } from 'recyclerlistview';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';

import { ApplyWindowCorrectionEventHandler } from '@utils/RecyclerListView.interfaces';
import useMangaSource from '@hooks/useMangaSource';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { ExclusiveInclusiveFilter, Manga, WithGenresFilter } from '@services/scraper/scraper.interfaces';
import useAPICall from '@hooks/useAPICall';
import { MangaItemsLoading } from './GenericMangaList.base';
import useLazyLoading from '@hooks/useLazyLoading';
import { animate, withAnimatedMounting } from '@utils/Animations';
import { Container } from '@components/Container';
import { View } from 'react-native';
import useMangaLayout from '@hooks/useMangaLayout';

const GenericMangaList: React.FC<StackScreenProps<RootStackParamList, 'GenericMangaList'>> = (props) => {
  if ('mangas' in props.route.params && 'type' in props.route.params) {
    const {
      route: {
        params: { mangas, type },
      },
    } = props;

    const options: UseCollapsibleOptions = {
      navigationOptions: {
        header: Header,
        headerTitle: type,
      },
      config: {
        useNativeDriver: true,
      },
    };

    const { layoutProvider, rowRenderer } = useMangaLayout();

    const theme = useTheme();

    const dataProvider = React.useRef(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(mangas)).current; // may be an anti-pattern, but this screen does not need to rerender since it is required to initialize this anyways

    const collapsible = useCollapsibleHeader(options);

    const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
      (offsetX, offsetY, windowCorrection) => {
        windowCorrection.windowShift = -collapsible.containerPaddingTop;
      },
      [collapsible.containerPaddingTop]
    );

    const { ready } = useLazyLoading();

    if (ready)
      return (
        <RecyclerListViewScreen
          collapsible={collapsible}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          applyWindowCorrection={applyWindowCorrection}
          scrollViewProps={{
            contentContainerStyle: {
              paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
              paddingBottom: pixelToNumber(theme.spacing(3)),
            },
          }}
        />
      );
    return (
      <Screen scrollable={options}>
        <MangaItemsLoading />
      </Screen>
    );
  } else {
    const {
      route: {
        params: { genre, source },
      },
    } = props;
    const mangaSource = useMangaSource(source) as MangaHostWithFilters<{ Genres: ExclusiveInclusiveFilter<string> }>;
    const {
      state: [mangas],
      loading,
      error,
      refresh,
    } = useAPICall(() => mangaSource.search('', { Genres: { include: [genre], exclude: [] } }));
    const [dataProvider, setDataProvider] = React.useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));
    const { layoutProvider, rowRenderer } = useMangaLayout();
    const [showFooter, setShowFooter] = React.useState<boolean>(true);
    const { ready, Fallback } = useLazyLoading();
    const options: UseCollapsibleOptions = {
      navigationOptions: {
        header: Header,
        headerTitle: genre,
      },
      config: {
        useNativeDriver: true,
      },
    };
    const collapsible = useCollapsibleHeader(options);

    const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
      (offsetX, offsetY, windowCorrection) => {
        windowCorrection.windowShift = -collapsible.containerPaddingTop;
      },
      [collapsible.containerPaddingTop]
    );

    const handleOnItemLayout = () => {
      setShowFooter(false);
    };

    const theme = useTheme();

    React.useEffect(() => {
      if (!loading && mangas) setDataProvider((prev) => prev.cloneWithRows(mangas));
    }, [mangas, loading]);
    if (ready) {
      if (loading || !mangas)
        return (
          <View
            style={{
              paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
              paddingBottom: pixelToNumber(theme.spacing(3)),
            }}>
            {animate(<MangaItemsLoading />, withAnimatedMounting)}
          </View>
        );
      return (
        <RecyclerListViewScreen
          collapsible={collapsible}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          onItemLayout={handleOnItemLayout}
          rowRenderer={rowRenderer}
          applyWindowCorrection={applyWindowCorrection}
          scrollViewProps={{
            contentContainerStyle: {
              paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
              paddingBottom: pixelToNumber(theme.spacing(3)),
            },
          }}
          renderFooter={() => (showFooter ? <MangaItemsLoading /> : null)}
        />
      );
    }
    return Fallback;
  }
};

export default GenericMangaList;
