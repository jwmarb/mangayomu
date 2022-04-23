import { Typography } from '@components/Typography';
import { TitleProps } from '@screens/MangaViewer/components/Title/Title.interfaces';
import React from 'react';

const Title: React.FC<TitleProps> = (props) => {
  const { title, isAdult } = props;
  return (
    <Typography variant='subheader' numberOfLines={2}>
      {title}{' '}
      {isAdult && (
        <Typography color='secondary' variant='body2'>
          18+
        </Typography>
      )}
    </Typography>
  );
};

export default React.memo(Title);
