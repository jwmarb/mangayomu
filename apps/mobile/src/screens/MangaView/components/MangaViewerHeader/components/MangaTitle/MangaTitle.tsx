import Text from '@components/Text';
import copyTextToClipboard from '@helpers/copyTextToClipboard';
import React from 'react';
import { MangaTitleProps } from './';

const MangaTitle: React.FC<MangaTitleProps> = (props) => {
  const { title } = props;
  function handleOnLongPress() {
    copyTextToClipboard(title);
  }
  return (
    <Text variant="header" align="center" bold onLongPress={handleOnLongPress}>
      {title}
    </Text>
  );
};

export default React.memo(MangaTitle);
