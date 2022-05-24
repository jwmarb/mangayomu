import Flex from '@components/Flex';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import ChapterDownloadActions from '../ChapterDownloadActions';
import { ChapterDownloadProgressProps } from './ChapterDownloadProgress.interfaces';

const ChapterDownloadProgress: React.FC<ChapterDownloadProgressProps> = (props) => {
  const { totalProgress, ...rest } = props;
  if (totalProgress > 0 && totalProgress < 1)
    return (
      <>
        <Typography variant='bottomtab' color='secondary'>
          {(totalProgress * 100).toFixed(2)}%
        </Typography>
        <ChapterDownloadActions {...rest} />
      </>
    );
  return null;
};

export default React.memo(ChapterDownloadProgress);
