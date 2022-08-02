import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';

import GenericMangaListWithMangas from '@screens/GenericMangaList/components/GenericMangaListWithMangas';
import InfiniteMangaList from '@screens/GenericMangaList/components/InfiniteMangaList';

const GenericMangaList: React.FC<StackScreenProps<RootStackParamList, 'GenericMangaList'>> = (props) => {
  if ('mangas' in props.route.params && 'type' in props.route.params)
    return <GenericMangaListWithMangas {...props.route.params} />;

  return <InfiniteMangaList {...props.route.params} />;
};

export default GenericMangaList;
