import React from 'react';
import { PageDownloadingProgressProps, PageDownloadingProgressRef } from './PageDownloadingProgress.interfaces';
import * as FileSystem from 'expo-file-system';
import { Typography } from '@components/Typography';

const PageDownloadingProgress: React.ForwardRefRenderFunction<
  PageDownloadingProgressRef,
  PageDownloadingProgressProps
> = (props, ref) => {
  const { page, onProgress, fileUri, index } = props;
  const [progress, setProgress] = React.useState<number>(0);
  const downloadCallback = (x: FileSystem.DownloadProgressData) => {
    const t = x.totalBytesWritten / x.totalBytesExpectedToWrite;
    setProgress(t);
    onProgress(t, index);
  };
  const downloadResumable = React.useRef<FileSystem.DownloadResumable>();
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    download();
  }, []);

  async function download() {
    const t = FileSystem.createDownloadResumable(page, fileUri, {}, downloadCallback);
    const p = await t.downloadAsync();
    console.log(p);
    // try {
    //   await t.downloadAsync();
    // } catch (e) {
    //   console.error(e);
    //   setError(e as any);
    // }
  }
  return <Typography>{progress}</Typography>;
};

export default React.memo(React.forwardRef(PageDownloadingProgress));
