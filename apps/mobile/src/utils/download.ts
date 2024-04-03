import blobUtil from 'react-native-blob-util';
import { joinPath } from '@/utils/helpers';
import {
  FailedToDownloadImageException,
  FailedToMoveImageException,
  IMAGE_CACHE_DIR,
} from '@/utils/image';

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

      throw new FailedToMoveImageException(path, fileCachePath);
    }
    default:
      throw new FailedToDownloadImageException(
        url,
        path,
        response.info().status,
      );
  }
};
