import Book from '@components/Book';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import useMountedEffect from '@hooks/useMountedEffect';
import { Manga } from '@mangayomu/mangascraper';
import { ListRenderItemInfo } from '@shopify/flash-list';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

const Item: React.FC<{ item: Omit<Manga, 'index'> }> = React.memo(
  ({ item }) => (
    <Box my="s" align-items="center" flex-grow>
      <Book manga={item} />
    </Box>
  ),
);
function keyExtractor<T extends Omit<Manga, 'index'>>(i: T, index: number) {
  return i.link + index;
}
function renderItem<T extends Omit<Manga, 'index'>>({
  item,
}: ListRenderItemInfo<T>) {
  return <Item item={item} />;
}

export default function useMangaFlashlistLayout(
  bookDimensions: { width: number; height: number },
  dataLength: number,
) {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const padding = 2 * theme.style.spacing.s;
  const estimatedItemSize = bookDimensions.height + padding;
  const estimatedListSize = React.useMemo(
    () => ({
      width,
      height: Math.min(
        (bookDimensions.height + padding) *
          (dataLength / (width / (bookDimensions.width + padding))),
        height,
      ),
    }),
    [
      width,
      height,
      bookDimensions.height,
      padding,
      dataLength,
      bookDimensions.width,
    ],
  );
  const [columns, setColumns] = React.useState<number>(
    Math.round(width / (bookDimensions.width + padding)),
  );
  useMountedEffect(() => {
    setColumns(Math.round(width / (bookDimensions.width + padding)));
  }, [bookDimensions.width]);
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

  function overrideItemLayout(layout: {
    span?: number | undefined;
    size?: number | undefined;
  }) {
    layout.size = estimatedItemSize;
  }

  return {
    columns,
    key: columns,
    estimatedItemSize,
    overrideItemLayout,
    keyExtractor,
    drawDistance: height * 0.5,
    renderItem,
    estimatedListSize,
  };
}
