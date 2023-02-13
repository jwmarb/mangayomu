import Book from '@components/Book';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import { Manga } from '@mangayomu/mangascraper';
import { ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

const Item: React.FC<{ item: Omit<Manga, 'index'> }> = React.memo(
  ({ item }) => (
    <Box my="s" align-items="center" flex-grow>
      <Book manga={item} />
    </Box>
  ),
);

export default function useMangaFlashlistLayout<
  T extends Omit<Manga, 'index'> = Manga,
>(bookDimensions: { width: number; height: number }) {
  const keyExtractor = React.useCallback(
    (i: T, index: number) => i.link + index,
    [],
  );

  const renderItem: ListRenderItem<T> = React.useCallback(
    ({ item }) => <Item item={item} />,
    [],
  );

  const { width } = useWindowDimensions();
  const theme = useTheme();
  const padding = 2 * theme.style.spacing.s;
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

  return {
    columns,
    key: columns,
    estimatedItemSize: bookDimensions.height + padding,
    keyExtractor,
    renderItem,
  };
}
