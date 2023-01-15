import ButtonBase from '@components/Button/ButtonBase';
import { Spacer } from '@components/core';
import Cover from '@components/Manga/Cover';
import React from 'react';
import { DownloadItemCoverProps } from './DownloadItemCover.interfaces';

const DownloadItemCover: React.FC<DownloadItemCoverProps> = (props) => {
  const { onCoverPress, uri } = props;
  return (
    <>
      <ButtonBase opacity onPress={onCoverPress}>
        <Cover uri={uri} fixedSize='small' />
      </ButtonBase>
      <Spacer x={2} />
    </>
  );
};

export default React.memo(DownloadItemCover);
