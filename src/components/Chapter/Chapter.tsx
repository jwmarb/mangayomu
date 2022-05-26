import ButtonBase from '@components/Button/ButtonBase';
import { ChapterProps, ChapterRef } from '@components/Chapter/Chapter.interfaces';
import Flex from '@components/Flex';
import { Typography } from '@components/Typography';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { format } from 'date-fns';
import { persistor } from '@redux/store';
import { Container } from '@components/Container';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import Spacer from '@components/Spacer';
import { ChapterContainer } from '@components/Chapter/Chapter.base';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import Animated from 'react-native-reanimated';
import displayMessage from '@utils/displayMessage';
import Progress from '@components/Progress';
import * as FileSystem from 'expo-file-system';
import useMountedEffect from '@hooks/useMountedEffect';
import useMangaSource from '@hooks/useMangaSource';
import PageDownloadingProgress from './components/PageDownloadingProgress';
import Button from '@components/Button';
import { DownloadStatus } from '@utils/DownloadManager/DownloadManager.interfaces';
import DownloadManager from '@utils/DownloadManager/DownloadManager';
import ChapterSkeleton from '@components/Chapter/Chapter.skeleton';
import { useChapterContext } from '@context/ChapterContext';
import Checkbox from '@components/Checkbox/Checkbox';
import connector, { ChapterReduxProps } from './Chapter.redux';
import ChapterTitle from './components/ChapterTitle';
import ChapterDownloadProgress from './components/ChapterDownloadProgress';
import ChapterDownloadStatus from './components/ChapterDownloadStatus';
import { useChapterStateFromRedux } from './Chapter.helpers';

const Chapter: React.ForwardRefRenderFunction<ChapterRef, ChapterReduxProps> = (props, ref) => {
  const {
    chapter,
    manga,
    selectionMode,
    overrideChecked,
    exitSelectionMode,
    enterSelectionMode,
    checkChapter,
    setDownloadStatusOfChapter,
  } = props;
  const source = useMangaSource(manga.source);
  function handleOnPress() {}

  function handleOnCheck(e: boolean) {
    checkChapter(e, chapter);
  }
  const dir = DownloadManager.generatePath(chapter, manga);

  const shouldBlockAction = React.useRef<boolean>(false);
  const { checked, downloadManager, status: downloadStatus } = useChapterStateFromRedux(chapter);
  const setDownloadStatus = setDownloadStatusOfChapter(chapter);
  const [totalProgress, setTotalProgress] = React.useState<number>(downloadManager.getProgress());
  // const [checked, setChecked] = React.useState<boolean>(downloadManager.getChecked());

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

  const resumeDownload = React.useCallback(() => {
    setDownloadStatus(DownloadStatus.RESUME_DOWNLOADING);
  }, []);

  const pauseDownload = React.useCallback(() => {
    setDownloadStatus(DownloadStatus.PAUSED);
  }, []);

  const cancelDownload = React.useCallback(() => {
    setDownloadStatus(DownloadStatus.CANCELLED);
  }, []);

  const startDownload = React.useCallback(() => {
    setDownloadStatus(DownloadStatus.START_DOWNLOADING);
  }, []);

  function queueForDownload() {
    if (downloadStatus !== DownloadStatus.DOWNLOADED) {
      downloadManager.queue();
      setDownloadStatus(DownloadStatus.QUEUED);
    }
  }

  React.useImperativeHandle(ref, () => ({
    getDownloadManager: () => downloadManager,
    // setChecked,
    downloadAsync: async () => {
      shouldBlockAction.current = true;
      setDownloadStatus(DownloadStatus.START_DOWNLOADING);
      await downloadManager.download();
    },
    download: startDownload,
    pause: pauseDownload,
    pauseAsync: async () => {
      shouldBlockAction.current = true;
      setDownloadStatus(DownloadStatus.PAUSED);
      await downloadManager.pause();
    },
    cancel: cancelDownload,
    cancelAsync: async () => {
      shouldBlockAction.current = true;
      setDownloadStatus(DownloadStatus.CANCELLED);
      await downloadManager.cancel();
    },
    resume: resumeDownload,
    resumeAsync: async () => {
      shouldBlockAction.current = true;
      setDownloadStatus(DownloadStatus.RESUME_DOWNLOADING);
      await downloadManager.resume();
    },
    queue: queueForDownload,
    getStatus: () => downloadStatus,
    getURL: () => chapter.link,
  }));

  React.useEffect(() => {
    switch (downloadStatus) {
      case DownloadStatus.RESUME_DOWNLOADING:
      case DownloadStatus.DOWNLOADING:
      case DownloadStatus.START_DOWNLOADING:
        listener.current = setInterval(async () => setTotalProgress(downloadManager.getProgress()), 500);
        return () => {
          clearInterval(listener.current);
        };
    }
  }, [downloadStatus]);

  useMountedEffect(() => {
    (async () => {
      switch (downloadStatus) {
        case DownloadStatus.CANCELLED:
          setTotalProgress(0);
          if (shouldBlockAction.current) await downloadManager.cancel();
          else shouldBlockAction.current = false;
          break;
        case DownloadStatus.PAUSED:
          clearTimeout(listener.current);
          if (!shouldBlockAction.current) await downloadManager.pause();
          else shouldBlockAction.current = false;
          break;
        case DownloadStatus.RESUME_DOWNLOADING:
          if (!shouldBlockAction.current) await downloadManager.resume();
          else shouldBlockAction.current = false;
          break;
        case DownloadStatus.START_DOWNLOADING:
          if (!shouldBlockAction.current) await downloadManager.download();
          else shouldBlockAction.current = false;

          return () => {
            clearInterval(listener.current);
          };
      }
    })();
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

  // React.useEffect(() => {
  //   downloadManager.setChecked(checked);
  //   return () => {
  //     downloadManager.setChecked(false);
  //   };
  // }, [checked]);

  // React.useEffect(() => {
  //   if (selectionMode === 'normal') setChecked(false);
  // }, [selectionMode]);

  return (
    <>
      <Animated.View style={style}>
        <ButtonBase square onPress={handleOnPress} onLongPress={handleOnLongPress}>
          <ChapterContainer>
            <Flex justifyContent='space-between' alignItems='center'>
              <ChapterTitle chapter={chapter} />
              {selectionMode === 'normal' ? (
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
                </Flex>
              ) : (
                <Checkbox checked={checked} onChange={handleOnCheck} />
              )}
            </Flex>
          </ChapterContainer>
        </ButtonBase>
      </Animated.View>
    </>
  );
};

export default React.memo(connector(React.forwardRef(Chapter)));
