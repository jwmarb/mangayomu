import React from 'react';
import { Flex, Typography } from '@components/core';

import connector, {
  ConnectedDownloadItemProps,
} from '@screens/DownloadManager/components/DownloadItem/DownloadItem.redux';

import { useRootNavigation } from '@navigators/Root';
import ExpoStorage from '@utils/ExpoStorage';

import DownloadItemTitle from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemTitle';
import DownloadItemCover from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemCover';
import DownloadItemButton from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemButton';

const DownloadItem: React.FC<ConnectedDownloadItemProps> = (props) => {
  const { mangaKey, manga, downloadingManga, pauseAllSelected, cancelAllSelected } = props;
  const navigation = useRootNavigation();

  const handleOnCoverPress = React.useCallback(async () => {
    navigation.navigate('MangaViewer', { manga });
  }, [manga]);

  const handleOnPress = React.useCallback(() => {
    navigation.navigate('ChapterDownloads', { mangaKey });
  }, [mangaKey]);

  return (
    <Flex container horizontalPadding={2} justifyContent='space-between' alignItems='center'>
      <Flex justifyContent='space-between'>
        <Flex shrink>
          <DownloadItemCover uri={manga.imageCover} onCoverPress={handleOnCoverPress} />
          <Flex direction='column' shrink>
            <DownloadItemTitle title={manga.title} onCoverPress={handleOnCoverPress} />
            <Typography color='textSecondary'>
              Downloaded {downloadingManga.numDownloadCompleted} of {downloadingManga.numToDownload}
            </Typography>
          </Flex>
        </Flex>
        <DownloadItemButton onPress={handleOnPress} />
      </Flex>
    </Flex>
  );
};

export default connector(React.memo(DownloadItem));
