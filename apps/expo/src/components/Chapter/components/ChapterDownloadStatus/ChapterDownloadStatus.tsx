import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { ChapterDownloadStatusProps } from './ChapterDownloadStatus.interfaces';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Typography } from '@components/Typography';
import Progress from '@components/Progress';
import Spacer from '@components/Spacer';
import CircularProgress from 'react-native-circular-progress-indicator';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';
import connector, {
  ConnectedChapterDownloadStatusProps,
} from '@components/Chapter/components/ChapterDownloadStatus/ChapterDownloadStatus.redux';
import { View } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MenuOption from '@components/MenuOption';
import MenuTitle from '@components/MenuTitle';

const ChapterDownloadStatus: React.FC<ConnectedChapterDownloadStatusProps> = (props) => {
  const {
    status,
    onDownload,
    progress,
    cancelDownload,
    mangaKey,
    validateFileIntegrity,
    chapterKey,
    downloadManager,
    manga,
  } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);
  function handleOnOpen() {
    setOpen(true);
  }
  function handleOnClose() {
    setOpen(false);
  }

  async function handleOnSelect(option: number) {
    handleOnClose();

    switch (option) {
      case 0:
        await cancelDownload(mangaKey, chapterKey);
        break;
      case 1:
        validateFileIntegrity(mangaKey, chapterKey);

        break;
      case 2:
        onDownload();
        break;
      case 3:
        alert(downloadManager.getError());
        console.log(downloadManager.getError());
        break;
    }
  }

  switch (status) {
    case DownloadStatus.DOWNLOADED:
      return (
        <>
          <Menu onSelect={handleOnSelect} opened={open} onBackdropPress={handleOnClose} onClose={handleOnClose}>
            <MenuTrigger>
              <IconButton
                onPress={handleOnOpen}
                icon={<Icon bundle='MaterialCommunityIcons' name='check-circle-outline' />}
                color='secondary'
              />
            </MenuTrigger>
            <MenuOptions customStyles={theme.menuOptionsStyle}>
              <MenuTitle>Actions</MenuTitle>
              <MenuOption text='Validate file integrity' value={1} icon={<Icon bundle='Feather' name='file' />} />
            </MenuOptions>
          </Menu>
        </>
      );
    case DownloadStatus.ERROR:
      return (
        <Menu onSelect={handleOnSelect} opened={open} onBackdropPress={handleOnClose} onClose={handleOnClose}>
          <MenuTrigger>
            <IconButton
              icon={<Icon bundle='MaterialCommunityIcons' name='exclamation' />}
              color='secondary'
              onPress={handleOnOpen}
            />
          </MenuTrigger>
          <MenuOptions customStyles={theme.menuOptionsStyle}>
            <MenuOption text='Restart download' value={2} />
            <MenuOption text='Display error' value={3} />
          </MenuOptions>
        </Menu>
      );
    case DownloadStatus.IDLE:
    case DownloadStatus.CANCELLED:
      return <IconButton icon={<Icon bundle='Feather' name='download' />} color='primary' onPress={onDownload} />;
    case DownloadStatus.DOWNLOADING:
    case DownloadStatus.START_DOWNLOADING:
    case DownloadStatus.RESUME_DOWNLOADING:
      return (
        <Menu onSelect={handleOnSelect} opened={open} onBackdropPress={handleOnClose} onClose={handleOnClose}>
          <MenuTrigger>
            <IconButton
              onPress={handleOnOpen}
              icon={
                <CircularProgress
                  value={progress}
                  activeStrokeColor={theme.palette.primary.main.get()}
                  progressValueColor={theme.palette.primary.main.get()}
                  inActiveStrokeColor={theme.palette.action.disabledBackground.get()}
                  maxValue={100}
                  duration={500}
                  radius={RFValue(14)}
                  valueSuffix='%'
                  activeStrokeWidth={3}
                  inActiveStrokeWidth={3}
                />
              }
            />
          </MenuTrigger>
          <MenuOptions customStyles={theme.menuOptionsStyle}>
            <MenuOption text='Cancel' color='secondary' value={0} />
          </MenuOptions>
        </Menu>
      );
    case DownloadStatus.QUEUED:
      return (
        <>
          <Menu onSelect={handleOnSelect} opened={open} onBackdropPress={handleOnClose} onClose={handleOnClose}>
            <MenuTrigger onPress={handleOnOpen}>
              <Progress native color='disabled' />
            </MenuTrigger>
            <MenuOptions customStyles={theme.menuOptionsStyle}>
              <MenuOption text='Cancel' color='secondary' value={0} />
            </MenuOptions>
          </Menu>

          <Spacer x={0.8} />
        </>
      );
    case DownloadStatus.VALIDATING:
      return <Progress color='disabled' size='small' />;
    default:
      return null;
  }
};

export default connector(React.memo(ChapterDownloadStatus));
