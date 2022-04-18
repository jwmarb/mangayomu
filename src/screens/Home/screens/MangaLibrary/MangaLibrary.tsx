import { Screen, Container, Typography, IconButton, Icon, Spacer } from '@components/core';
import { FlatListScreen } from '@components/core';
import { useFocusEffect } from '@react-navigation/native';
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';

const Spacing = () => <Spacer y={4} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas } = props;
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      headerRight: () => <IconButton icon={<Icon bundle='Feather' name='search' />} />,
    },
  };

  const collapsible = useCollapsibleHeader(options);

  return (
    <FlatListScreen
      padding
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      ItemSeparatorComponent={Spacing}
      numColumns={2}
      collapsible={collapsible}
      renderItem={renderItem}
      data={mangas}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
