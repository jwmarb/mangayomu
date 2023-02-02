import Book from '@components/Book';
import Box from '@components/Box';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const keyExtractor = (i: Manga) => i.link + i.index;

export const renderItem: ListRenderItem<Manga> = ({ item }) => (
  <Book manga={item} />
);

export const MangaSeparator = React.memo(() => <Box mx={moderateScale(4)} />);
