import RecyclerListViewScreen from '@components/RecyclerListViewScreen';
import { Header } from '@components/Screen';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider, LayoutProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import pixelToNumber from '@utils/pixelToNumber';
import { useTheme } from 'styled-components/native';
import Manga from '@components/Manga';
import { Flex } from '@components/core';
import { MangaItemContainer } from '@screens/Home/screens/GenericMangaList/GenericMangaList.base';
const { width, height } = Dimensions.get('window');

const rowRenderer: (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object | undefined
) => JSX.Element | JSX.Element[] | null = (type, data) => (
  <MangaItemContainer>
    <Manga {...data} />
  </MangaItemContainer>
);

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
      (mapToType) => mapToType,
      (type, dim) => {
        dim.width = width / 2;
        dim.height = 200;
      }
    )
  ).current;

  const collapsible = useCollapsibleHeader(options);

  return (
    <RecyclerListViewScreen
      collapsible={collapsible}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={rowRenderer}
      forceNonDeterministicRendering
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
