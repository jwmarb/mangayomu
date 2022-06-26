import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import React from 'react';
import { ChapterContainer } from '@components/Chapter/Chapter.base';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import Animated from 'react-native-reanimated';
import useMountedEffect from '@hooks/useMountedEffect';
import useMangaSource from '@hooks/useMangaSource';
import { DownloadStatus } from '@utils/DownloadManager/DownloadManager.interfaces';
import Checkbox from '@components/Checkbox/Checkbox';
import connector, { ChapterReduxProps } from './Chapter.redux';
import ChapterTitle from './components/ChapterTitle';
import ChapterDownloadProgress from './components/ChapterDownloadProgress';
import ChapterDownloadStatus from './components/ChapterDownloadStatus';
import { useChapterStateFromRedux } from './Chapter.helpers';
import { cursors } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import Spacer from '@components/Spacer';
import StorageManager from '@utils/StorageManager';
import DownloadManager from '@utils/DownloadManager';

const Chapter: React.FC<ChapterReduxProps> = (props) => {
  const {
    chapter,
    manga,
    selectionMode,
    overrideChecked,
    exitSelectionMode,
    enterSelectionMode,
    checkChapter,
    setDownloadStatusOfChapter,
    setTotalProgressOfChapter,
    downloadAllSelected,
    pauseAllSelected,
    cancelAllSelected,
  } = props;

  function handleOnCheck(e: boolean) {
    checkChapter(e, chapter);
  }

  const {
    checked,
    downloadManager,
    status: downloadStatus,
    totalProgress,
    hasCursor,
  } = useChapterStateFromRedux(chapter);
  const setDownloadStatus = setDownloadStatusOfChapter(chapter);
  const setTotalProgress = setTotalProgressOfChapter(chapter);
  // const [checked, setChecked] = React.useState<boolean>(downloadManager.getChecked());
  async function handleOnPress() {
    switch (selectionMode) {
      case 'normal':
        // const availableSpace = await FileSystem.getFreeDiskStorageAsync();
        // const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
        console.log(downloadManager.getStatus(), downloadManager.getProgress());
        break;
      case 'selection':
        checkChapter(!checked, chapter);
        break;
    }
  }

  const listener = React.useRef<NodeJS.Timer>();
  const style = useAnimatedMounting();
  const isDownloading = React.useMemo(
    () => downloadStatus === DownloadStatus.RESUME_DOWNLOADING || downloadStatus === DownloadStatus.START_DOWNLOADING,
    [downloadStatus]
  );

  function handleOnLongPress() {
    switch (selectionMode) {
      case 'normal':
        // setChecked(true);
        enterSelectionMode();
        break;
      case 'selection':
        exitSelectionMode();
        break;
    }
  }

  const resumeDownload = React.useCallback(async () => {
    const obj = cursors.get();
    if (hasCursor) await downloadAllSelected(obj[manga.link].chapters, manga);
    else {
      console.log(`Resumed ${chapter.link}`);
      setDownloadStatus(DownloadStatus.RESUME_DOWNLOADING);
      await downloadManager.resume();
    }
  }, [downloadManager, setDownloadStatus, hasCursor]);

  const pauseDownload = React.useCallback(async () => {
    if (hasCursor) await pauseAllSelected(manga);
    else {
      console.log(`Paused ${chapter.link}`);
      setDownloadStatus(DownloadStatus.PAUSED);
      await downloadManager.pause();
    }
  }, [downloadManager, setDownloadStatus, hasCursor]);

  const cancelDownload = React.useCallback(async () => {
    if (hasCursor) {
      console.log(`Cancelling cursor...`);
      cancelAllSelected(manga);
    } else {
      console.log(`Cancelled ${chapter.link}`);
      setDownloadStatus(DownloadStatus.CANCELLED);
      await downloadManager.cancel();
    }
  }, [downloadManager, setDownloadStatus, hasCursor]);

  const startDownload = React.useCallback(async () => {
    setDownloadStatus(DownloadStatus.START_DOWNLOADING);
    console.log(`Downloading ${chapter.link}`);
    await downloadManager.download();
  }, [downloadManager, setDownloadStatus]);

  React.useEffect(() => {
    switch (downloadStatus) {
      case DownloadStatus.RESUME_DOWNLOADING:
      case DownloadStatus.DOWNLOADING:
      case DownloadStatus.START_DOWNLOADING:
        listener.current = setInterval(() => setTotalProgress(downloadManager.getProgress()), 500);
        return () => {
          setTotalProgress(downloadManager.getProgress());
          clearInterval(listener.current);
        };
    }
  }, [downloadStatus]);

  React.useEffect(() => {
    return () => {
      clearTimeout(listener.current);
    };
  }, []);

  useMountedEffect(() => {
    if (totalProgress >= 1) {
      setDownloadStatus(DownloadStatus.DOWNLOADED);
      setTotalProgress(0);
      clearInterval(listener.current);
    }
  }, [totalProgress]);

  useMountedEffect(() => {
    if (hasCursor) {
      console.log(`A cursor has been assigned to ${chapter.link}`);
    }
  }, [hasCursor]);

  return (
    <>
      <Animated.View style={style}>
        <ButtonBase square onPress={handleOnPress} onLongPress={handleOnLongPress}>
          <ChapterContainer>
            <Flex justifyContent='space-between' alignItems='center'>
              <ChapterTitle chapter={chapter} />
              <Flex alignItems='center'>
                <ChapterDownloadProgress
                  totalProgress={totalProgress}
                  downloadStatus={downloadStatus}
                  isDownloading={isDownloading}
                  pauseDownload={pauseDownload}
                  cancelDownload={cancelDownload}
                  resumeDownload={resumeDownload}
                />
                <ChapterDownloadStatus
                  downloadStatus={downloadStatus}
                  isDownloading={isDownloading}
                  startDownload={startDownload}
                />
                <Spacer x={1} />
                {selectionMode === 'selection' && <Checkbox checked={checked} onChange={handleOnCheck} />}
              </Flex>
            </Flex>
          </ChapterContainer>
        </ButtonBase>
      </Animated.View>
    </>
  );
};

export default connector(React.memo(Chapter));
