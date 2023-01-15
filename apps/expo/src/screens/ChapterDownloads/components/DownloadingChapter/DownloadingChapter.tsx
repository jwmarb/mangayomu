import React from 'react';
import { Typography } from '@components/Typography';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  AnimatedDownloadingChapterBar,
  EmptyDownloadingChapterBar,
} from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.base';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import connector, {
  ConnectedDownloadingChapterProps,
} from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.redux';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';
import MenuOption from '@components/MenuOption';
import useStatefulHeader from '@hooks/useStatefulHeader';

const DownloadingChapter: React.FC<ConnectedDownloadingChapterProps> = (props) => {
  const { chapterDownloadingState, chapter, downloadedPages, totalPages, cancelDownload, mangaKey, chapterKey } = props;

  const width = useSharedValue(0);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    width.value = withTiming(chapterDownloadingState ? chapterDownloadingState.totalProgress : 0, {
      duration: 50,
      easing: Easing.linear,
    });
  }, [chapterDownloadingState?.totalProgress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: width.value + '%',
  }));
  const theme = useTheme();

  const handleOnSelect = async (option: string) => {
    switch (option) {
      case 'Cancel':
        await cancelDownload(mangaKey, chapterKey);
        break;
    }
  };

  return (
    <Flex container verticalPadding={1} horizontalPadding={3} justifyContent='space-between' alignItems='center'>
      <Flex direction='column' grow>
        <Flex alignItems='center'>
          <Typography>{chapter.name ?? `Chapter ${chapter.index + 1}`}</Typography>
          <Spacer x={1} />
          {totalPages !== 0 && (
            <Typography color='textSecondary' variant='body2'>
              {downloadedPages} / {totalPages}
            </Typography>
          )}
        </Flex>
        <Spacer y={1} />
        {totalPages !== 0 && (
          <Flex direction='column'>
            <AnimatedDownloadingChapterBar style={progressStyle} />
            <EmptyDownloadingChapterBar />
          </Flex>
        )}
      </Flex>
      <Flex>
        <Spacer x={2} />
        <Menu
          opened={visible}
          onClose={() => setVisible(false)}
          onSelect={handleOnSelect}
          onBackdropPress={() => setVisible(false)}>
          <MenuTrigger>
            <IconButton icon={<Icon bundle='Feather' name='more-vertical' />} onPress={() => setVisible(true)} />
          </MenuTrigger>
          <MenuOptions customStyles={theme.menuOptionsStyle}>
            <MenuOption text='Cancel' />
          </MenuOptions>
        </Menu>
      </Flex>
    </Flex>
  );

  // return (
  //   <Typography>
  //     {chapter.name} {downloadState.totalProgress}
  //   </Typography>
  // );

  // switch (downloadManager.getStatus()) {
  //   case DownloadStatus.DOWNLOADED:
  //     return null;
  //   case DownloadStatus.QUEUED:
  //     return (
  //       <Flex grow container verticalPadding={2} horizontalPadding={3} direction='column'>
  //         <Flex alignItems='center'>
  //           <Typography bold>{chapter.name}</Typography>
  //           <Spacer x={1} />
  //           <Typography variant='body2' color='secondary'>
  //             Queued
  //           </Typography>
  //         </Flex>
  //       </Flex>
  //     );
  //   default:
  //     return (
  //       <Flex grow container verticalPadding={2} horizontalPadding={3}>
  //         <Flex grow direction='column'>
  //           <Flex alignItems='center'>
  //             <Typography bold>{chapter.name}</Typography>
  //             <Spacer x={1} />
  //             <Typography variant='body2' color='textSecondary'>
  //               ({downloadManager.getDownloadedPages()} / {downloadManager.getTotalPages()}) {progress.toFixed(2)}%
  //             </Typography>
  //           </Flex>
  //           <Spacer y={1} />
  //           <AnimatedDownloadingChapterBar style={progressBarStyle} />
  //         </Flex>
  //         <Flex>
  //           {(downloadManager.getStatus() === DownloadStatus.DOWNLOADING ||
  //             downloadManager.getStatus() === DownloadStatus.START_DOWNLOADING ||
  //             downloadManager.getStatus() === DownloadStatus.RESUME_DOWNLOADING) && (
  //             <IconButton icon={<Icon bundle='Feather' name='pause-circle' />} onPress={handleOnPausePress} />
  //           )}
  //           {downloadManager.getStatus() === DownloadStatus.PAUSED && (
  //             <IconButton icon={<Icon bundle='Feather' name='play-circle' />} onPress={handleOnDownloadPress} />
  //           )}
  //           <IconButton icon={<Icon bundle='Feather' name='x-circle' />} onPress={handleOnCancelPress} />
  //         </Flex>
  //       </Flex>
  //     );
  // }
};

export default connector(React.memo(DownloadingChapter));
