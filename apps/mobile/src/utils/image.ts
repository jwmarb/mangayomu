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

/**
 * Generates a unique hash for a given URL.
 *
 * This function removes query parameters and non-alphanumeric characters from the URL,
 * then appends the file extension (if present) before encoding it as a valid URI component.
 * The result is stored in a memoization map to avoid redundant computations.
 *
 * @param url - The URL to hash.
 * @returns A unique hash string for the given URL.
 * @pre url.length > 0
 */
export function hash(url: string) {
  // Find the index of the query parameters (if any)
  const parametersIndex = url.indexOf('?');

  // Check if the hashed value is already memoized
  let hashed = hashMemo.get(
    parametersIndex !== -1 ? url : url.substring(0, parametersIndex),
  );

  // If the hash is not in the memoization map, compute it
  if (hashed == null) {
    const fileExtIdx = url.lastIndexOf('.');

    // Extract the file extension from the URL
    const fileExt = url.substring(
      fileExtIdx,
      parametersIndex === -1 ? undefined : parametersIndex,
    );

    hashed = encodeURIComponent(
      url.substring(0, fileExtIdx).replace(/[^a-zA-Z0-9]/g, '') + fileExt,
    );

    // Store the computed hash in the memoization map
    hashMemo.set(url, hashed);
  }

  return hashed;
}

/**
 * Downloads an image from a given URL and saves it to the specified path.
 *
 * @param url - The URL of the image to download.
 * @param path - The temporary path where the image will be initially saved.
 * @param fileName - The name of the file to save in the cache directory.
 * @returns An object containing the URI of the cached image.
 * @throws {FailedToMoveImageException} If there is an error moving the image from the temporary path to the cache directory.
 * @throws {FailedToDownloadImageException} If the download request fails or returns a status code other than 200 or 304.
 */
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
        return { uri: `file://${fileCachePath}` };
      } catch (e) {
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

/**
 * Downloads an image from a given URL and ensures it is available in the cache.
 *
 * This function generates a unique hash for the URL, checks if the image is currently
 * being downloaded or already exists in the cache. If not, it downloads the image,
 * moves it to the cache directory, and returns the URI of the cached image.
 *
 * @param url - The URL of the image to download.
 * @returns A Promise that resolves to an object containing the URI of the cached image.
 * @throws {FailedToMoveImageException} If there is an error moving the image from the temporary path to the cache directory.
 * @throws {FailedToDownloadImageException} If the download request fails or returns a status code other than 200 or 304.
 */
export const downloadImage = async (
  url: string,
): Promise<ImageSourcePropType> => {
  // Generate a unique hash for the URL
  const fileName = hash(url);

  // Check if this image is currently being downloaded
  let downloadingObject = downloadSync.get(fileName);
  if (downloadingObject != null) {
    return downloadingObject;
  }

  // Check if the image already exists in the cache directory
  const imageCachePath = joinPath(IMAGE_CACHE_DIR, fileName);
  const exists = await blobUtil.fs.exists(imageCachePath);
  if (exists) {
    return {
      uri: `file://${imageCachePath}`,
    };
  }

  // If the image is not in the cache, download it
  const fileDownloadPath = joinPath(DOWNLOAD_DIR, fileName);
  downloadingObject = _download(url, fileDownloadPath, fileName);

  // Uncomment this code below to run in a testing environment
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
  // Check if the download and image cache directories exist
  const [downloadDirExists, imageDirExists] = await Promise.all([
    blobUtil.fs.exists(DOWNLOAD_DIR),
    blobUtil.fs.exists(IMAGE_CACHE_DIR),
  ]);

  // Array to hold promises for creating missing directories
  const missingDirs: Promise<void>[] = [];

  // If the download directory does not exist, create it
  if (!downloadDirExists) {
    missingDirs.push(blobUtil.fs.mkdir(DOWNLOAD_DIR));
  } else {
    // If the download directory exists, clear it and recreate it to ensure a clean state
    await blobUtil.fs.unlink(DOWNLOAD_DIR);
    await blobUtil.fs.mkdir(DOWNLOAD_DIR);
  }

  // If the image cache directory does not exist, create it
  if (!imageDirExists) {
    missingDirs.push(blobUtil.fs.mkdir(IMAGE_CACHE_DIR));
  } else {
    // Load all images in the cache directory into a list and check for expiration
    const images = await blobUtil.fs.lstat(IMAGE_CACHE_DIR);
    const dateNow = Date.now();
    for (let i = 0, n = images.length; i < n; i++) {
      const { lastModified } = images[i];
      const expiration = lastModified + TTL;
      if (expiration < dateNow) {
        // If the file has passed its expiration time, delete it
        blobUtil.fs.unlink(joinPath(images[i].path, images[i].filename));
      }
    }
  }

  // Wait for all missing directories to be created
  await Promise.all(missingDirs);
}

/**
 * Retrieves the dimensions of an image from a given URL.
 *
 * This function first checks if the image is available in the cache. If it is, it retrieves the dimensions and returns them.
 * If the image is not yet downloaded or is currently being downloaded, it waits for the download to complete before
 * retrieving the dimensions.
 *
 * @param url - The URL of the image to retrieve dimensions for.
 * @returns A Promise that resolves to an object containing the width, height, and URI of the cached image.
 * @throws {Error} If the image is not available in the cache and has not been downloaded yet.
 */
export const getImageDimensions = (
  url: string,
): Promise<ResolvedImageAsset> => {
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
        // Check if the image is currently being downloaded
        const downloadObject = downloadSync.get(fileName);
        if (downloadObject == null) {
          throw new Error(
            'You must invoke `download` first before calling this method.',
          );
        }

        // Log a message indicating that we are waiting for the image to resolve
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
