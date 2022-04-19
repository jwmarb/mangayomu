import { Screen, Container, Typography, IconButton, Icon, Spacer } from '@components/core';
import { FlatListScreen } from '@components/core';
import { useFocusEffect } from '@react-navigation/native';
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useTheme } from 'styled-components/native';

const Spacing = () => <Spacer y={4} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas } = props;
  const theme = useTheme();

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: pixelToNumber(theme.spacing(3)) }}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      ItemSeparatorComponent={Spacing}
      numColumns={2}
      renderItem={renderItem}
      data={mangas}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
