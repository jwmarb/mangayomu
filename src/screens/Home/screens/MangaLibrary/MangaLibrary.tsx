import { Screen, Container, Typography, IconButton, Icon, Spacer } from '@components/core';
import { FlatListScreen } from '@components/core';
import { useFocusEffect } from '@react-navigation/native';
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';

const Spacing = () => <Spacer x={2} y={2} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas } = props;
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      headerRight: () => <IconButton icon={<Icon bundle='Feather' name='search' />} />,
    },
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log(mangas);
    }, [mangas])
  );

  const collapsible = useCollapsibleHeader(options);

  return (
    <FlatListScreen
      padding
      contentContainerStyle={{ alignItems: 'center' }}
      ItemSeparatorComponent={Spacing}
      numColumns={3}
      collapsible={collapsible}
      renderItem={renderItem}
      data={mangas}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
