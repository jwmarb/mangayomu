import React from 'react';
import { Typography } from '@components/Typography';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimatedDownloadingChapterBar } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.base';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import connector, {
  ConnectedDownloadingChapterProps,
} from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.redux';

const DownloadingChapter: React.FC<ConnectedDownloadingChapterProps> = (props) => {
  const { manga, chapter, downloadState, downloadAllSelected, pauseAllSelected, cancelAllSelected, mangaCursor } =
    props;
  const downloadManager = DownloadManager.ofWithManga(chapter, manga);
  const [progress, setProgress] = React.useState<number>(
    Number.isNaN(downloadManager.getProgress()) ? 0 : downloadManager.getProgress() * 100
  );
  const width = useSharedValue(progress);
  async function handleOnPausePress() {
    await pauseAllSelected(manga);
  }
  async function handleOnCancelPress() {
    await cancelAllSelected(manga);
  }

  async function handleOnDownloadPress() {
    if (mangaCursor) await downloadAllSelected(mangaCursor.chapters, manga);
  }

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!Number.isNaN(downloadManager.getProgress())) {
  //       setProgress(downloadManager.getProgress() * 100);
  //       width.value = withTiming(downloadManager.getProgress() * 100, { duration: 500, easing: Easing.ease });
  //       if (downloadManager.getProgress() >= 1) clearInterval(interval);
  //     }
  //   }, 500);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: width.value + '%',
  }));
  // const counter = React.useRef(0);

  // React.useEffect(() => {
  //   console.log(`${chapter.name}: ${counter.current}`);
  //   counter.current++;
  // });

  return (
    <Typography>
      {chapter.name} {downloadState.totalProgress}
    </Typography>
  );

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
