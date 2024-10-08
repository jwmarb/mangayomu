import blobUtil from 'react-native-blob-util';
import {
  Image,
  ImageResolvedAssetSource,
  ImageSourcePropType,
} from 'react-native';
import { joinPath } from '@/utils/helpers';
import { FailedToMoveImageException } from '@/exceptions/FailedToMoveImageException';
import { FailedToDownloadImageException } from '@/exceptions/FailedToDownloadImageException';

// Uncomment for testing
// import * as self from '@/utils/image'; // jest is bad at mocking functions dependent on private functions

export type ResolvedImageAsset = Omit<ImageResolvedAssetSource, 'scale'>;

// how long the image should be in storage before it is marked as expired
// note: in React Native components, memory caching should be handled by react query
export const TTL = 1000 * 60 * 60 * 24 * 3; // 3 days

// All images that are in the "downloading" state are stored here
export const DOWNLOAD_DIR = joinPath(blobUtil.fs.dirs.DownloadDir, 'images');

// All images that are completely downloaded are stored here
export const IMAGE_CACHE_DIR = joinPath(blobUtil.fs.dirs.CacheDir, 'images');

// Holds all Promises so that there are no duplicate Promises resolving for the same thing
export const downloadSync = new Map<string, Promise<ImageSourcePropType>>();

// stores all mapping of hashes to prevent expensive computations
const hashMemo = new Map<string, string>();
export function hash(url: string) {
  const parametersIndex = url.indexOf('?');
  let hashed = hashMemo.get(
    parametersIndex !== -1 ? url : url.substring(0, parametersIndex),
  );
  if (hashed == null) {
    const fileExtIdx = url.lastIndexOf('.');
    const fileExt = url.substring(
      fileExtIdx,
      parametersIndex === -1 ? undefined : parametersIndex,
    );

    hashed = encodeURIComponent(
      url.substring(0, fileExtIdx).replace(/[^a-zA-Z0-9]/g, '') + fileExt,
    );
    hashMemo.set(url, hashed);
  }

  return hashed;
}

export const _download = async (
  url: string,
  path: string,
  fileName: string,
) => {
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
      try {
        await blobUtil.fs.cp(response.path(), fileCachePath);
        // console.log(`Success ${url}...`);
        return { uri: `file://${fileCachePath}` };
      } catch (e) {
        // console.error(e);
        throw new FailedToMoveImageException(path, fileCachePath, e);
      }
    }
    default:
      throw new FailedToDownloadImageException(
        url,
        path,
        response.info().status,
      );
  }
};

export const downloadImage = async (
  url: string,
): Promise<ImageSourcePropType> => {
  const fileName = hash(url);

  // Checks if this is downloading
  let downloadingObject = downloadSync.get(fileName);
  if (downloadingObject != null) {
    return downloadingObject;
  }

  // Check if this is in the cache directory
  const imageCachePath = joinPath(IMAGE_CACHE_DIR, fileName);
  const exists = await blobUtil.fs.exists(imageCachePath);
  if (exists) {
    return {
      uri: `file://${imageCachePath}`,
    };
  }

  // Otherwise download the file
  const fileDownloadPath = joinPath(DOWNLOAD_DIR, fileName);
  downloadingObject = _download(url, fileDownloadPath, fileName);

  // Uncomment this code below for testing
  // downloadingObject = self._download(url, fileDownloadPath, fileName);
  downloadSync.set(fileName, downloadingObject);
  try {
    const result = await downloadingObject;
    downloadSync.delete(fileName);
    await blobUtil.fs.unlink(fileDownloadPath);
    return result;
  } catch (e) {
    downloadSync.delete(fileName);
    await blobUtil.fs.unlink(fileDownloadPath);
    throw e;
  }
};

export async function initialize() {
  const [downloadDirExists, imageDirExists] = await Promise.all([
    blobUtil.fs.exists(DOWNLOAD_DIR),
    blobUtil.fs.exists(IMAGE_CACHE_DIR),
  ]);

  // creates directories if missing
  const missingDirs: Promise<void>[] = [];

  if (!downloadDirExists) {
    missingDirs.push(blobUtil.fs.mkdir(DOWNLOAD_DIR));
  } else {
    await blobUtil.fs.unlink(DOWNLOAD_DIR);
    await blobUtil.fs.mkdir(DOWNLOAD_DIR);
  }
  if (!imageDirExists) {
    missingDirs.push(blobUtil.fs.mkdir(IMAGE_CACHE_DIR));
  } else {
    // load all into a hashmap
    const images = await blobUtil.fs.lstat(IMAGE_CACHE_DIR);
    const dateNow = Date.now();
    for (let i = 0, n = images.length; i < n; i++) {
      const { lastModified } = images[i];
      const expiration = lastModified + TTL;
      if (expiration < dateNow) {
        // the file past expiration
        blobUtil.fs.unlink(joinPath(images[i].path, images[i].filename));
      }
    }
  }

  await Promise.all(missingDirs);
}

/**
 * Resolves an image that is locally cached
 * @param url The url of the image
 * @param onImageResolved Callback when the image is resolved
 * @returns Returns a unsubscription callback to clean up the listener
 */
export const getImageDimensions = (url: string) => {
  return new Promise<ResolvedImageAsset>((resolve) => {
    const fileName = hash(url);
    const imageCachePath = joinPath(IMAGE_CACHE_DIR, fileName);
    const src = `file://${imageCachePath}`;
    Image.getSize(
      src,
      (width, height) => {
        resolve({ width, height, uri: src });
      },
      () => {
        const downloadObject = downloadSync.get(fileName);
        if (downloadObject == null) {
          throw new Error(
            'You must invoke `download` first before calling this method.',
          );
        }

        // console.log(`Waiting for ${url} to resolve...`);

        downloadObject.then(() => {
          Image.getSize(
            src,
            (width, height) => {
              resolve({ width, height, uri: src });
            },
            () => {
              throw new Error(
                'Failed to resolve image because the download failed',
              );
            },
          );
        });
      },
    );

    return null;
  });
};
