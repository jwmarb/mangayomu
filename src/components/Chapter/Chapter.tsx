import ButtonBase from '@components/Button/ButtonBase';
import { ChapterProps } from '@components/Chapter/Chapter.interfaces';
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

export enum DownloadStatus {
  START_DOWNLOADING = 'Start',
  RESUME_DOWNLOADING = 'Resume',
  DOWNLOADING = 'Downloading',
  ERROR = 'Error',
  DOWNLOADED = 'Downloaded',
  PAUSED = 'Paused',
  CANCELLED = 'Cancelled',
  IDLE = 'Idle',
}

const displayChapterInfo = (chapter: any) => {
  if (MangaValidator.hasDate(chapter)) {
    return (
      <>
        <Spacer y={1} />
        <Typography variant='body2' color='textSecondary'>
          {format(Date.parse(chapter.date), 'MM/dd/yyyy')}
        </Typography>
      </>
    );
  }
  return null;
};

const Chapter: React.FC<ChapterProps> = (props) => {
  const { chapter } = props;
  function handleOnPress() {}
  const dir =
    FileSystem.documentDirectory + `Mangas/${chapter.mangaName}/${chapter.name ?? `Chapter ${chapter.index}`}/`;

  const [downloadStatus, setDownloadStatus] = React.useState<DownloadStatus>(DownloadStatus.IDLE);
  const [pages, setPages] = React.useState<string[]>([]);
  const [totalProgress, setTotalProgress] = React.useState<number>(0);
  const totalProgressRef = React.useRef<number[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const source = useMangaSource(chapter.sourceName);
  const downloadResumableRef = React.useRef<
    {
      status: DownloadStatus;
      downloadResumable: FileSystem.DownloadResumable;
    }[]
  >([]);
  const listener = React.useRef<NodeJS.Timer>();
  const style = useAnimatedMounting();
  const isDownloading = React.useMemo(
    () => downloadStatus === DownloadStatus.RESUME_DOWNLOADING || downloadStatus === DownloadStatus.START_DOWNLOADING,
    [downloadStatus]
  );

  async function resumeDownload() {
    setDownloadStatus(DownloadStatus.RESUME_DOWNLOADING);
  }

  async function pauseDownload() {
    setDownloadStatus(DownloadStatus.PAUSED);
  }

  async function cancelDownload() {
    setDownloadStatus(DownloadStatus.CANCELLED);
  }

  React.useLayoutEffect(() => {
    (async () => {
      try {
        const info = await FileSystem.getInfoAsync(dir);

        setDownloadStatus(info.exists && info.isDirectory ? DownloadStatus.DOWNLOADED : DownloadStatus.IDLE);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useMountedEffect(() => {
    (async () => {
      switch (downloadStatus) {
        case DownloadStatus.CANCELLED:
          setPages([]);
          setTotalProgress(0);
          for (const { downloadResumable } of downloadResumableRef.current) {
            try {
              await downloadResumable.cancelAsync();
            } catch (e) {
              setDownloadStatus(DownloadStatus.ERROR);
              setErrors((prev) => [...prev, e as any]);
            }
          }
          downloadResumableRef.current = [];
          break;
        case DownloadStatus.PAUSED:
          clearTimeout(listener.current);
          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            if (downloadResumableRef.current[i].status !== DownloadStatus.DOWNLOADED)
              downloadResumableRef.current[i].status = DownloadStatus.PAUSED;
          }

          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            const { downloadResumable } = downloadResumableRef.current[i];
            if (downloadResumableRef.current[i].status === DownloadStatus.DOWNLOADING)
              try {
                await downloadResumable.pauseAsync();
              } catch (e) {
                setDownloadStatus(DownloadStatus.ERROR);
                setErrors((prev) => [...prev, e as any]);
              }
          }
          break;
        case DownloadStatus.RESUME_DOWNLOADING:
          listener.current = setInterval(
            () =>
              setTotalProgress(
                totalProgressRef.current.reduce((prev, curr) => prev + curr, 0) / totalProgressRef.current.length
              ),
            300
          );

          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            if (downloadResumableRef.current[i].status !== DownloadStatus.DOWNLOADED)
              downloadResumableRef.current[i].status = DownloadStatus.DOWNLOADING;
          }

          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            const { downloadResumable } = downloadResumableRef.current[i];
            if (
              downloadResumableRef.current[i].status !== DownloadStatus.PAUSED &&
              downloadResumableRef.current[i].status !== DownloadStatus.DOWNLOADED
            )
              try {
                await downloadResumable.resumeAsync();
              } catch (e) {
                setDownloadStatus(DownloadStatus.ERROR);
                setErrors((prev) => [...prev, e as any]);
              }
          }
          return () => {
            clearInterval(listener.current);
          };
        case DownloadStatus.START_DOWNLOADING:
          listener.current = setInterval(
            () =>
              setTotalProgress(
                totalProgressRef.current.reduce((prev, curr) => prev + curr, 0) / totalProgressRef.current.length
              ),
            300
          );

          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            downloadResumableRef.current[i].status = DownloadStatus.DOWNLOADING;
          }

          for (let i = 0; i < downloadResumableRef.current.length; i++) {
            const { downloadResumable } = downloadResumableRef.current[i];
            if (downloadResumableRef.current[i].status !== DownloadStatus.PAUSED)
              try {
                await downloadResumable.downloadAsync();
              } catch (e) {
                setDownloadStatus(DownloadStatus.ERROR);
                setErrors((prev) => [...prev, e as any]);
              }
          }

          return () => {
            clearInterval(listener.current);
          };
      }
    })();
  }, [downloadStatus]);

  const handleOnProgress = (progress: number, index: number) => {
    totalProgressRef.current[index] = progress;
    if (progress >= 1) downloadResumableRef.current[index].status = DownloadStatus.DOWNLOADED;
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(listener.current);
    };
  }, []);

  useMountedEffect(() => {
    if (totalProgress >= 1) {
      setDownloadStatus(DownloadStatus.DOWNLOADED);
      setTotalProgress(0);
      setPages([]);
      downloadResumableRef.current = [];
      clearInterval(listener.current);
    }
  }, [totalProgress]);

  async function handleOnDownloadChapter() {
    try {
      await FileSystem.readDirectoryAsync(dir);
    } catch (e) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } finally {
      try {
        const p = await source.getPages(chapter);
        downloadResumableRef.current = p.map((x, i) => ({
          status: DownloadStatus.IDLE,
          downloadResumable: FileSystem.createDownloadResumable(
            x,
            dir + `${i + 1}.png`,
            {},
            ({ totalBytesExpectedToWrite, totalBytesWritten }) =>
              handleOnProgress(totalBytesWritten / totalBytesExpectedToWrite, i)
          ),
        }));
        totalProgressRef.current = p.map(() => 0);
        setTotalProgress(0);
        setPages(p);
        setDownloadStatus(DownloadStatus.START_DOWNLOADING);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <>
      <Animated.View style={style}>
        <ButtonBase square onPress={handleOnPress}>
          <ChapterContainer>
            <Flex justifyContent='space-between' alignItems='center'>
              <Flex direction='column'>
                <Typography bold>{chapter.name}</Typography>
                {displayChapterInfo(chapter)}
              </Flex>
              <Flex alignItems='center'>
                {pages.length > 0 && (
                  <>
                    <Typography variant='bottomtab' color='secondary'>
                      {(totalProgress * 100).toFixed(2)}%
                    </Typography>
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
                )}
                {downloadStatus === DownloadStatus.DOWNLOADED && (
                  <>
                    <Icon bundle='MaterialCommunityIcons' name='check-circle-outline' color='secondary' size='small' />
                    <Spacer x={1.3} />
                  </>
                )}
                {downloadStatus === DownloadStatus.IDLE && (
                  <IconButton
                    icon={<Icon bundle='Feather' name='download' />}
                    color='primary'
                    onPress={handleOnDownloadChapter}
                  />
                )}
                {isDownloading && (
                  <>
                    <Spacer x={1} />
                    <Progress color='disabled' />
                    <Spacer x={1.1} />
                  </>
                )}
              </Flex>
            </Flex>
          </ChapterContainer>
        </ButtonBase>
      </Animated.View>
    </>
  );
};

export default React.memo(Chapter);
