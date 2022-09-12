import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { TitleProps } from '@screens/MangaViewer/components/Title/Title.interfaces';
import { GRADIENT_COLOR } from '@screens/MangaViewer/MangaViewer.shared';
import { Color } from '@theme/core';
import displayMessage from '@utils/displayMessage';
import React from 'react';
import * as Clipboard from 'expo-clipboard';

const Title: React.FC<TitleProps> = (props) => {
  const { title, isAdult } = props;
  async function handleOnLongPress() {
    await Clipboard.setStringAsync(title);
    displayMessage('Copied to clipboard.');
  }
  return (
    <>
      {isAdult && (
        <>
          <Typography color='secondary' variant='body2' bold lockTheme='dark'>
            18+ NSFW
          </Typography>
          <Spacer y={1} />
        </>
      )}
      <Typography bold numberOfLines={3} lockTheme='dark' onLongPress={handleOnLongPress}>
        {title}
      </Typography>
    </>
  );
};

export default React.memo(Title);
