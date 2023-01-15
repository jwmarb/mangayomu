import React from 'react';
import { Flex, MenuOption, Progress, Spacer, Typography } from '@components/core';

import connector, {
  ConnectedDownloadItemProps,
} from '@screens/DownloadManager/components/DownloadItem/DownloadItem.redux';

import { useRootNavigation } from '@navigators/Root';
import ExpoStorage from '@utils/ExpoStorage';

import DownloadItemTitle from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemTitle';
import DownloadItemCover from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemCover';
import DownloadItemButton from '@screens/DownloadManager/components/DownloadItem/components/DownloadItemButton';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';

const DownloadItem: React.FC<ConnectedDownloadItemProps> = (props) => {
  const { mangaKey, manga, chapter, cancelAllForSeries } = props;
  const navigation = useRootNavigation();
  const [visible, setVisible] = React.useState<boolean>();

  const handleOnCoverPress = React.useCallback(async () => {
    navigation.navigate('MangaViewer', { manga });
  }, [manga]);

  const handleOnPress = React.useCallback(() => {
    setVisible(true);
  }, [mangaKey]);

  const theme = useTheme();

  const handleOnSelect = async (option: string) => {
    setVisible(false);
    switch (option) {
      case 'View downloads':
        navigation.navigate('ChapterDownloads', { mangaKey });
        break;
      case 'Cancel all downloads':
        await cancelAllForSeries(mangaKey);
        break;
    }
  };

  return (
    <Flex container horizontalPadding={2} justifyContent='space-between' alignItems='center'>
      <Flex justifyContent='space-between' grow>
        <Flex shrink>
          <DownloadItemCover uri={manga.imageCover} onCoverPress={handleOnCoverPress} />
          <Flex direction='column' shrink>
            <DownloadItemTitle title={manga.title} onCoverPress={handleOnCoverPress} />
            <Flex alignItems='center'>
              <Typography color='textSecondary'>
                {chapter ? `Downloading ${chapter?.name ?? `Chapter ${chapter.index + 1}`}` : 'Pending...'}
              </Typography>
              <Spacer x={1} />
              <Progress size='small' />
            </Flex>
          </Flex>
        </Flex>
        <Menu
          onSelect={handleOnSelect}
          opened={visible}
          onOpen={() => setVisible(true)}
          onClose={() => setVisible(false)}
          onBackdropPress={() => setVisible(false)}>
          <MenuTrigger>
            <DownloadItemButton onPress={handleOnPress} />
          </MenuTrigger>
          <MenuOptions customStyles={theme.menuOptionsStyle}>
            <MenuOption text='View downloads' />
            <MenuOption text='Cancel all downloads' color='secondary' />
          </MenuOptions>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default connector(React.memo(DownloadItem));
