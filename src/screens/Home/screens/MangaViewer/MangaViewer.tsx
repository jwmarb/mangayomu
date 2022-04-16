import { Typography } from '@components/Typography';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { useMangaSource } from '@services/scraper';
import React from 'react';

const MangaViewer: React.FC<StackScreenProps<RootStackParamList, 'MangaViewer'>> = (props) => {
  const {
    route: {
      params: { manga },
    },
    navigation,
  } = props;
  const source = useMangaSource(manga.source);

  console.log(source);

  return <Typography>{manga.title}</Typography>;
};

export default MangaViewer;
