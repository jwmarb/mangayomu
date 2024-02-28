import Book from '@components/Book';
import Box from '@components/Box';
import { MangaSchema } from '@database/schemas/Manga';
import { useTheme } from '@emotion/react';
import assertIsManga from '@helpers/assertIsManga';
import assertIsMangaSchema from '@helpers/assertIsMangaSchema';
import useAppSelector from '@hooks/useAppSelector';
import useMountedEffect from '@hooks/useMountedEffect';
import { Manga } from '@mangayomu/mangascraper/src';
import { ListRenderItemInfo } from '@shopify/flash-list';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { shallowEqual } from 'react-redux';

const Item: React.FC<{ item: Manga | MangaSchema }> = React.memo(({ item }) => {
  const manga = React.useMemo(() => {
    if (assertIsMangaSchema(item))
      return item.isValid()
        ? {
            link: item.link,
            imageCover: item.imageCover,
            source: item.source,
            title: item.title,
          }
        : null;
    return item;
  }, [item.source, item.title, item.imageCover]);
  if (manga == null) return null;
  return (
    <Box my="s" align-items="center" flex-grow>
      <Book manga={manga} />
    </Box>
  );
});
function keyExtractor(i: Manga | MangaSchema, index: number) {
  return assertIsMangaSchema(i)
    ? (i.isValid() ? i.link : '') + index
    : i.link + index;
}
function renderItem<T extends Manga | MangaSchema>({
  item,
}: ListRenderItemInfo<T>) {
  if (assertIsMangaSchema(item)) {
    if (item.isValid()) return <Item item={item} />;
    return null;
  } else {
    return <Item item={item} />;
  }
}

export default function useMangaFlashlistLayout(dataLength: number) {
  const { width, height } = useWindowDimensions();
  const bookDimensions = useAppSelector((state) => state.settings.book);
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
