import RecyclerListViewScreen from '@components/RecyclerListViewScreen';
import { Header } from '@components/Screen';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';
import { ApplyWindowCorrectionEventHandler } from '@utils/RecyclerListView.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import { renderItem, keyExtractor } from '../../GenericMangaList.flatlist';

import useMangaLayout from '@hooks/useMangaLayout';
import MangaList from '@components/MangaList';
import useLazyLoading from '@hooks/useLazyLoading';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';

const GenericMangaListWithMangasRLV: React.FC<{
  mangas: Manga[];
  type: string;
}> = (props) => {
  const { mangas, type } = props;
  const { ready, Fallback } = useLazyLoading();

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: type,
    },
    config: {
      useNativeDriver: true,
    },
  };

  const { layoutProvider, rowRenderer, extendedState } = useMangaLayout();
  const theme = useTheme();

  const dataProvider = React.useRef(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(mangas)).current; // may be an anti-pattern, but this screen does not need to rerender since it is required to initialize this anyways

  const collapsible = useCollapsibleHeader(options);

  const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
    (offsetX, offsetY, windowCorrection) => {
      windowCorrection.windowShift = -collapsible.containerPaddingTop;
    },
    [collapsible.containerPaddingTop]
  );

  if (ready)
    return (
      <RecyclerListViewScreen
        collapsible={collapsible}
        renderAheadOffset={1000}
        canChangeSize
        forceNonDeterministicRendering
        extendedState={extendedState}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer as any}
        applyWindowCorrection={applyWindowCorrection}
        scrollViewProps={{
          contentContainerStyle: {
            paddingTop: collapsible.containerPaddingTop + pixelToNumber(theme.spacing(3)),
            paddingBottom: pixelToNumber(theme.spacing(3)),
          },
        }}
      />
    );
  return Fallback;
};

const GenericMangaListWithMangasFlatList: React.FC<{
  mangas: Manga[];
  type: string;
}> = (props) => {
  const { mangas, type } = props;

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: type,
    },
    config: {
      useNativeDriver: true,
    },
  };

  const { ready, Fallback } = useLazyLoading();

  const collapsible = useCollapsibleHeader(options);
  if (ready)
    return <MangaList data={mangas} renderItem={renderItem} keyExtractor={keyExtractor} collapsible={collapsible} />;
  return Fallback;
};

export default function (props: { mangas: Manga[]; type: string }) {
  const useRecyclerListView = useSelector((state: AppState) => state.settings.advanced.useRecyclerListView);

  if (useRecyclerListView) return <GenericMangaListWithMangasRLV {...props} />;
  return <GenericMangaListWithMangasFlatList {...props} />;
}
