import RecyclerListViewScreen from '@components/RecyclerListViewScreen';
import { Header } from '@components/Screen';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider, LayoutProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';
import Manga from '@components/Manga';
import {
  MangaItemContainerEven,
  MangaItemContainerOdd,
} from '@screens/Home/screens/GenericMangaList/GenericMangaList.base';
import { ApplyWindowCorrectionEventHandler, RowRenderer } from '@utils/RecyclerListView.interfaces';
const { width, height } = Dimensions.get('window');

enum Type {
  ODD,
  EVEN,
}
const rowRenderer: RowRenderer = (type, data) => {
  switch (type) {
    default:
      return null;
    case Type.EVEN:
      return (
        <MangaItemContainerEven>
          <Manga {...data} />
        </MangaItemContainerEven>
      );
    case Type.ODD: {
      return (
        <MangaItemContainerOdd>
          <Manga {...data} />
        </MangaItemContainerOdd>
      );
    }
  }
};

const GenericMangaList: React.FC<StackScreenProps<RootStackParamList, 'GenericMangaList'>> = (props) => {
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

  const theme = useTheme();

  const dataProvider = React.useRef(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(mangas)).current;
  const layoutProvider = React.useRef(
    new LayoutProvider(
      (index) => (index % 2 === 1 ? Type.ODD : Type.EVEN),
      (type, dim) => {
        dim.width = width / 2 - 1;
        dim.height = 265;
      }
    )
  ).current;

  const collapsible = useCollapsibleHeader(options);

  const applyWindowCorrection: ApplyWindowCorrectionEventHandler = React.useCallback(
    (offsetX, offsetY, windowCorrection) => {
      windowCorrection.windowShift = -collapsible.containerPaddingTop;
    },
    [collapsible.containerPaddingTop]
  );

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
};

export default GenericMangaList;
