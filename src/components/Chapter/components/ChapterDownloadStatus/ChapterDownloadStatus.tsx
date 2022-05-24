import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { ChapterDownloadStatusProps } from './ChapterDownloadStatus.interfaces';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Typography } from '@components/Typography';
import Progress from '@components/Progress';
import Spacer from '@components/Spacer';

const ChapterDownloadStatus: React.FC<ChapterDownloadStatusProps> = (props) => {
  const { downloadStatus, isDownloading, startDownload } = props;
  return (
    <>
      {downloadStatus === DownloadStatus.DOWNLOADED && (
        <>
          <Icon bundle='MaterialCommunityIcons' name='check-circle-outline' color='secondary' size='small' />
          <Spacer x={1.3} />
        </>
      )}
      {(downloadStatus === DownloadStatus.IDLE || downloadStatus === DownloadStatus.CANCELLED) && (
        <IconButton icon={<Icon bundle='Feather' name='download' />} color='primary' onPress={startDownload} />
      )}
      {downloadStatus === DownloadStatus.QUEUED && (
        <>
          <Typography color='secondary' variant='bottomtab'>
            Queued
          </Typography>
        </>
      )}
      {(isDownloading || downloadStatus === DownloadStatus.VALIDATING) && (
        <>
          <Spacer x={1} />
          <Progress color='disabled' />
          <Spacer x={1.1} />
        </>
      )}
    </>
  );
};

export default React.memo(ChapterDownloadStatus);
