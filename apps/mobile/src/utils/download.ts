import blobUtil from 'react-native-blob-util';
import { joinPath } from '@/utils/helpers';
import { IMAGE_CACHE_DIR } from '@/utils/image';
import { FailedToMoveImageException } from '@/exceptions/FailedToMoveImageException';
import { FailedToDownloadImageException } from '@/exceptions/FailedToDownloadImageException';

export const download = async (url: string, path: string, fileName: string) => {
  const response = await blobUtil
    .config({
      path,
      overwrite: true,
      timeout: 1000,
    })
    .fetch('GET', url);

  switch (response.info().status) {
    case 200:
    case 304: {
      const fileCachePath = joinPath(IMAGE_CACHE_DIR, fileName);
      const success = await blobUtil.fs.mv(response.path(), fileCachePath);
      if (success) {
        return { uri: `file://${fileCachePath}` };
      }

      throw new FailedToMoveImageException(
        path,
        fileCachePath,
        new Error('Invalid http status'),
      );
    }
    default:
      throw new FailedToDownloadImageException(
        url,
        path,
        response.info().status,
      );
  }
};
