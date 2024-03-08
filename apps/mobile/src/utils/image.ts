import blobUtil from 'react-native-blob-util';

// All images that are in the "downloading" state are stored here
const DOWNLOAD_DIR = `${blobUtil.fs.dirs.DownloadDir}/images`;

// All images that are completely downloaded are stored here
const IMAGE_CACHE_DIR = `${blobUtil.fs.dirs.CacheDir}/images`;

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
  }

  await Promise.all(missingDirs);
}
