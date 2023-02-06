import connector, {
  ConnectedBasicMangaListProps,
} from './BasicMangaList.redux';
import React from 'react';
import Animated from 'react-native-reanimated';
import {
  keyExtractor,
  MangaSeparator,
} from '@screens/Explore/Explore.flatlist';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { Manga } from '@mangayomu/mangascraper';
import Book, { bookDimensions } from '@components/Book';
import {
  Dimensions,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import Box from '@components/Box';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

const BasicMangaList: React.FC<ConnectedBasicMangaListProps> = (props) => {
  const { mangas, title } = props;
  const { width } = useWindowDimensions();
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: title });
  const theme = useTheme();
  const padding = 2 * theme.style.spacing.s;
  // const getItemLayout = React.useCallback(
  //   (data: Manga[] | null | undefined, index: number) => ({
  //     length: bookDimensions.height + padding,
  //     offset: (bookDimensions.height + padding) * index,
  //     index,
  //   }),
  //   [padding],
  // );
  const [columns, setColumns] = React.useState<number>(
    Math.round(
      (width - 2 * theme.style.spacing.m) / (bookDimensions.width + padding),
    ),
  );
  React.useLayoutEffect(() => {
    const p = Dimensions.addEventListener('change', ({ window: { width } }) => {
      setColumns(
        Math.round(
          (width - 2 * theme.style.spacing.m) /
            (bookDimensions.width + padding),
        ),
      );
    });
    return () => {
      p.remove();
    };
  }, []);

  return (
    <FlashList
      estimatedItemSize={bookDimensions.height + padding}
      // windowSize={7}
      // maxToRenderPerBatch={8}
      // initialNumToRender={0}
      // updateCellsBatchingPeriod={100}
      // getItemLayout={getItemLayout}

      data={mangas}
      key={columns}
      numColumns={columns}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={<Box style={scrollViewStyle} />}
      ListFooterComponent={<Box style={contentContainerStyle} />}
      {...{
        onScroll,
        onMomentumScrollEnd: onScroll,
      }}
    />
  );
};

const renderItem: ListRenderItem<Manga> = ({ item }) => <Item item={item} />;

const Item: React.FC<{ item: Manga }> = React.memo(({ item }) => (
  <Box my="s" align-items="center" flex-grow>
    <Book manga={item} />
  </Box>
));

export default connector(BasicMangaList);
