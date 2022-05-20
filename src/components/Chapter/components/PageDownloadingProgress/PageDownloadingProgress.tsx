import React from 'react';
import { PageDownloadingProgressProps, PageDownloadingProgressRef } from './PageDownloadingProgress.interfaces';
import * as FileSystem from 'expo-file-system';
import { Typography } from '@components/Typography';
import { DownloadStatus } from '@components/Chapter/Chapter';
import useMountedEffect from '@hooks/useMountedEffect';
import { Container } from '@components/Container';
import Spacer from '@components/Spacer';
import Flex from '@components/Flex';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';

const PageDownloadingProgress: React.ForwardRefRenderFunction<
  PageDownloadingProgressRef,
  PageDownloadingProgressProps
> = (props, ref) => {
  const { page, onProgress, fileUri, index } = props;
  // const [status, setStatus] = React.useState<DownloadStatus>(DownloadStatus.DOWNLOADING);
  const downloadCallback = (x: FileSystem.DownloadProgressData) => {
    const t = x.totalBytesWritten / x.totalBytesExpectedToWrite;
    onProgress(t, index);
  };
  const downloadResumable = React.useRef<FileSystem.DownloadResumable>(
    FileSystem.createDownloadResumable(page, fileUri, {}, downloadCallback)
  ).current;

  React.useEffect(() => {
    download();
  }, []);

  async function download() {
    try {
      await downloadResumable.downloadAsync();
    } catch (e) {
      // setError(e as any);
    }
  }

  async function cancel() {
    onProgress(-1, index);
    try {
      await downloadResumable.cancelAsync();
    } catch (e) {
      // setError(e as any);
    }
  }

  async function pause() {
    try {
      await downloadResumable.pauseAsync();
    } catch (e) {
      // setError(e as any);
    }
  }

  async function resume() {
    try {
      await downloadResumable.resumeAsync();
    } catch (e) {
      // setError(e as any);
    }
  }

  React.useImperativeHandle(ref, () => ({
    download,
    cancel,
    pause,
    resume,
  }));

  return null;

  // return (
  //   <Flex container horizontalPadding={3} verticalPadding={1} justifyContent='space-between' alignItems='center'>
  //     <Typography bold>Page {index + 1}</Typography>
  //     {status !== DownloadStatus.DOWNLOADED && progress !== -1 && (
  //       <Flex alignItems='center'>
  //         {progress < 1 && progress >= 0 && (
  //           <Typography variant='bottomtab' color='secondary'>
  //             {(progress * 100).toFixed(2)}%
  //           </Typography>
  //         )}
  //         {progress >= 1 && (
  //           <Typography variant='bottomtab' color='primary'>
  //             Downloaded
  //           </Typography>
  //         )}
  //         {progress === -1 && (
  //           <Typography variant='bottomtab' color='disabled'>
  //             Cancelled
  //           </Typography>
  //         )}
  //         {status === DownloadStatus.DOWNLOADING && (
  //           <IconButton
  //             icon={<Icon bundle='MaterialCommunityIcons' name='pause-circle-outline' />}
  //             onPress={download}
  //           />
  //         )}

  //         {status === DownloadStatus.PAUSED && (
  //           <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='play-circle-outline' />} onPress={resume} />
  //         )}
  //         <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='close-circle-outline' />} onPress={cancel} />
  //         <Spacer x={4} />
  //       </Flex>
  //     )}
  //   </Flex>
  // );
};

export default React.memo(React.forwardRef(PageDownloadingProgress));
