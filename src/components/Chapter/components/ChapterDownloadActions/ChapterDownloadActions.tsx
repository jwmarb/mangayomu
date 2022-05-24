import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Spacer from '@components/Spacer';
import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { ChapterDownloadActionsProps } from './ChapterDownloadActions.interfaces';

const ChapterDownloadActions: React.FC<ChapterDownloadActionsProps> = (props) => {
  const { isDownloading, downloadStatus, pauseDownload, cancelDownload, resumeDownload } = props;
  return (
    <>
      <Spacer x={1} />
      {isDownloading && (
        <IconButton
          icon={<Icon bundle='MaterialCommunityIcons' name='pause-circle-outline' />}
          onPress={pauseDownload}
        />
      )}

      {downloadStatus === DownloadStatus.PAUSED && (
        <IconButton
          icon={<Icon bundle='MaterialCommunityIcons' name='play-circle-outline' />}
          onPress={resumeDownload}
        />
      )}
      <IconButton
        icon={<Icon bundle='MaterialCommunityIcons' name='close-circle-outline' />}
        onPress={cancelDownload}
      />
    </>
  );
};

export default React.memo(ChapterDownloadActions);
