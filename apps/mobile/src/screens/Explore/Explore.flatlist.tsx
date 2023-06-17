import Book from '@components/Book';
import { LoadingBook } from '@components/Book/';
import Box from '@components/Box';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';
import { ListRenderItem } from '@shopify/flash-list';
import { moderateScale } from 'react-native-size-matters';

export const keyExtractor = (i: Manga, index: number) => i.link + index;

export const renderItem: ListRenderItem<Manga> = ({ item }) => (
  <Book manga={item} />
);

export const MangaSeparator = React.memo(() => <Box m={moderateScale(4)} />);

export const MangaListLoading = (
  <Box flex-direction="row">
    {new Array(10).fill('').map((_, i) => (
      <React.Fragment key={i}>
        <LoadingBook />
        <MangaSeparator />
      </React.Fragment>
    ))}
  </Box>
);
