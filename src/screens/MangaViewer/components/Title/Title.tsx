import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { TitleProps } from '@screens/MangaViewer/components/Title/Title.interfaces';
import React from 'react';

const Title: React.FC<TitleProps> = (props) => {
  const { title, isAdult } = props;
  return (
    <>
      {isAdult && (
        <>
          <Typography color='secondary' variant='body2' bold>
            18+ NSFW
          </Typography>
          <Spacer y={1} />
        </>
      )}
      <Typography bold numberOfLines={3}>
        {title}{' '}
      </Typography>
    </>
  );
};

export default React.memo(Title);
