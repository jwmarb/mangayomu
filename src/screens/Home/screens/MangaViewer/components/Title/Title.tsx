import { Typography } from '@components/Typography';
import { TitleProps } from '@screens/Home/screens/MangaViewer/components/Title/Title.interfaces';
import React from 'react';

const Title: React.FC<TitleProps> = (props) => {
  const { title } = props;
  return <Typography variant='subheader'>{title}</Typography>;
};

export default React.memo(Title);
