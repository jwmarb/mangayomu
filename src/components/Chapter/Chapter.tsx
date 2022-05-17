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

enum DownloadStatus {
  DOWNLOADING,
  ERROR,
  DOWNLOADED,
  PAUSED,
  IDLE,
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
  const [totalProgress, setTotalProgress] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string>('');
  const source = useMangaSource(chapter.sourceName);
  const [downloaded, setDownloaded] = React.useState<boolean>(false);
  const downloadResumableRef = React.useRef<(FileSystem.DownloadResumable | undefined)[]>([]);
  const style = useAnimatedMounting();

  // async function resumeDownload() {
  //   if (downloadResumableRef.current) {
  //     try {
  //       await downloadResumableRef.current.resumeAsync();
  //     } catch (e) {
  //       setDownloadStatus(DownloadStatus.ERROR);
  //       setError(e as any);
  //     } finally {
  //       setDownloadStatus(DownloadStatus.DOWNLOADING);
  //     }
  //   }
  // }

  // async function pauseDownload() {
  //   if (downloadResumableRef.current) {
  //     try {
  //       await downloadResumableRef.current.pauseAsync();
  //     } catch (e) {
  //       setDownloadStatus(DownloadStatus.ERROR);
  //       setError(e as any);
  //     } finally {
  //       setDownloadStatus(DownloadStatus.PAUSED);
  //     }
  //   }
  // }

  // async function cancelDownload() {
  //   if (downloadResumableRef.current) {
  //     try {
  //       await downloadResumableRef.current.cancelAsync();
  //     } catch (e) {
  //       setDownloadStatus(DownloadStatus.ERROR);
  //       setError(e as any);
  //     } finally {
  //       setDownloadStatus(DownloadStatus.IDLE);
  //     }
  //   }
  // }

  const handleOnProgress = React.useCallback(
    (progress: number, index: number) => {
      setTotalProgress((prev) => {
        const p = [...prev];
        p[index] = progress;
        return p;
      });
    },
    [setTotalProgress]
  );

  // React.useEffect(() => {
  //   if (totalProgress.length > 0)
  //     console.log((totalProgress.reduce((prev, curr) => prev + curr), 0) / totalProgress.length);
  // }, [totalProgress]);

  async function handleOnDownloadChapter() {
    setDownloadStatus(DownloadStatus.DOWNLOADING);
    try {
      await FileSystem.readDirectoryAsync(dir);
    } catch (e) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } finally {
      try {
        const p = await source.getPages(chapter);
        downloadResumableRef.current = p.map(() => undefined);
        setTotalProgress(p.map(() => 0));
        setPages(p);
      } catch (e) {
        console.error(e);
      } finally {
        setDownloadStatus(DownloadStatus.IDLE);
      }

      // downloadResumableRef.current = FileSystem.createDownloadResumable(
      //   chapter.link,
      //   dir + chapter.name ?? `Chapter ${chapter.index}`,
      //   {},
      //   downloadProgressCallback
      // );
      // try {
      //   // await downloadResumableRef.current.downloadAsync();
      // } catch (e) {
      //   setDownloadStatus(DownloadStatus.ERROR);
      //   setError(e as any);
      // }
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
                {downloadStatus === DownloadStatus.DOWNLOADING && (
                  <>
                    <Typography variant='bottomtab' color='secondary'>
                      {((totalProgress.reduce((prev, curr) => prev + curr, 0) / totalProgress.length) * 100).toFixed(2)}
                      %
                    </Typography>
                    <Spacer x={1} />
                    <IconButton icon={<Icon bundle='Feather' name='pause-circle' />} />
                    <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='close-circle-outline' />} />
                  </>
                )}
                <IconButton
                  icon={
                    downloadStatus === DownloadStatus.DOWNLOADING ? (
                      <Progress />
                    ) : downloaded ? (
                      <Icon bundle='MaterialCommunityIcons' name='check-circle-outline' />
                    ) : (
                      <Icon bundle='Feather' name='download' />
                    )
                  }
                  color={downloaded ? 'secondary' : 'primary'}
                  onPress={handleOnDownloadChapter}
                  disabled={downloadStatus === DownloadStatus.DOWNLOADING}
                />
              </Flex>
            </Flex>
          </ChapterContainer>
        </ButtonBase>
        {pages.length > 0 && (
          <Flex direction='column'>
            {pages.map((x, i) => (
              <PageDownloadingProgress
                key={i}
                page={x}
                fileUri={dir + `${i + 1}.png`}
                onProgress={handleOnProgress}
                index={i}
              />
            ))}
          </Flex>
        )}
      </Animated.View>
    </>
  );
};

export default React.memo(Chapter);
