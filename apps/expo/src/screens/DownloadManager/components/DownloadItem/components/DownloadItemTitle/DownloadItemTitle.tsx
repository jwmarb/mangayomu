import ButtonBase from '@components/Button/ButtonBase';
import { Typography } from '@components/core';
import React from 'react';
import { DownloadItemTitleProps } from './DownloadItemTitle.interfaces';

const DownloadItemTitle: React.FC<DownloadItemTitleProps> = (props) => {
  const { onCoverPress, title } = props;
  return (
    <ButtonBase opacity onPress={onCoverPress}>
      <Typography variant='subheader' numberOfLines={2}>
        {title}
      </Typography>
    </ButtonBase>
  );
};

export default React.memo(DownloadItemTitle);
