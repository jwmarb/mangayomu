import blobutil from 'react-native-blob-util';
import fs from 'fs/promises';
import * as ImageUtil from '@/utils/image';
import {
  DOWNLOAD_DIR,
  FailedToDownloadImageException,
  FailedToMoveImageException,
  IMAGE_CACHE_DIR,
  downloadImage,
  downloadSync,
  hash,
  initialize,
} from '@/utils/image';
import { joinPath } from '@/utils/helpers';

const LARGE_SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1546180147-af9074ff24aa';
const SMALL_SAMPLE_IMAGE = 'https://via.placeholder.com/120x120';
const INVALID_SAMPLE_IMAGE = 'https://svp.icu/placeholder/8192x10932.png';

const largeHashedKey = hash(LARGE_SAMPLE_IMAGE);
const smallHashedKey = hash(SMALL_SAMPLE_IMAGE);
const invalidHashedKey = hash(INVALID_SAMPLE_IMAGE);

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

beforeEach(async () => {
  await initialize();
});

afterEach(async () => {
  await Promise.all([
    blobutil.fs.unlink(IMAGE_CACHE_DIR),
    blobutil.fs.unlink(DOWNLOAD_DIR),
  ]);
});

test('initializes necessary directories', async () => {
  expect(blobutil.fs.exists(IMAGE_CACHE_DIR)).toBeTruthy();
  expect(blobutil.fs.exists(DOWNLOAD_DIR)).toBeTruthy();
});

test('deletes old downloads directory', async () => {
  jest.spyOn(blobutil.fs, 'mkdir');
  jest.spyOn(blobutil.fs, 'unlink');
  const files = [
    joinPath(DOWNLOAD_DIR, '1'),
    joinPath(DOWNLOAD_DIR, '2'),
    joinPath(DOWNLOAD_DIR, '3'),
  ];
  for (const file of files) {
    await fs.writeFile(file, 'Hello World!', { flag: 'w' });
  }

  for (const file of files) {
    expect(blobutil.fs.exists(file)).toBeTruthy();
  }

  await initialize();

  expect(blobutil.fs.mkdir).toHaveBeenCalledWith(DOWNLOAD_DIR);
  expect(blobutil.fs.unlink).toHaveBeenCalledWith(DOWNLOAD_DIR);

  for (const file of files) {
    expect(blobutil.fs.exists(file)).resolves.toBeFalsy();
  }
});

describe('downloads images', () => {
  beforeEach(() => void 0);
  afterEach(() => void 0);
  it('image download', async () => {
    jest.spyOn(downloadSync, 'delete');
    jest.spyOn(blobutil.fs, 'mv');
    expect(fs.readdir(joinPath(IMAGE_CACHE_DIR))).resolves.toEqual([]);

    const a = await downloadImage(LARGE_SAMPLE_IMAGE);
    expect(downloadSync.delete).toHaveBeenCalledWith(largeHashedKey);
    expect(blobutil.fs.cp).toHaveBeenCalledWith(
      joinPath(DOWNLOAD_DIR, largeHashedKey),
      joinPath(IMAGE_CACHE_DIR, largeHashedKey),
    );
    expect(downloadSync.size).toBe(0);
    expect(fs.readdir(IMAGE_CACHE_DIR)).resolves.toEqual([
      hash(LARGE_SAMPLE_IMAGE),
    ]);
    expect(fs.readdir(DOWNLOAD_DIR)).resolves.toEqual([]);
    expect(a).toEqual({
      uri: `file://${joinPath(IMAGE_CACHE_DIR, largeHashedKey)}`,
    });
  });

  it('uses existing image that have been downloaded', async () => {
    jest.spyOn(ImageUtil, '_download');
    // download again just in case
    await downloadImage(LARGE_SAMPLE_IMAGE);
    expect(fs.readdir(IMAGE_CACHE_DIR)).resolves.toEqual([largeHashedKey]); // ensure it exists

    const b = await downloadImage(LARGE_SAMPLE_IMAGE);

    expect(ImageUtil._download).toHaveBeenCalledTimes(1);
    expect(b).toEqual({
      uri: `file://${joinPath(IMAGE_CACHE_DIR, largeHashedKey)}`,
    });
  });

  it('downloads another image', async () => {
    const a = await downloadImage(SMALL_SAMPLE_IMAGE);
    expect(a).toEqual({
      uri: `file://${joinPath(IMAGE_CACHE_DIR, smallHashedKey)}`,
    });
  });

  it('fails to download unaccessible image', async () => {
    try {
      await downloadImage(INVALID_SAMPLE_IMAGE);
    } catch (e) {
      expect(e).toEqual(
        new FailedToDownloadImageException(
          INVALID_SAMPLE_IMAGE,
          joinPath(DOWNLOAD_DIR, invalidHashedKey),
          404,
        ),
      );
      expect(downloadSync.size).toEqual(0);
    }
  });
});

test('downloadSync remove download after failing to move', async () => {
  jest
    .spyOn(blobutil.fs, 'mv')
    .mockImplementation(() => Promise.resolve(false));

  jest.spyOn(blobutil.fs, 'unlink');
  jest.spyOn(downloadSync, 'delete');
  try {
    await downloadImage(LARGE_SAMPLE_IMAGE);
  } catch (e) {
    expect(e).toEqual(
      new FailedToMoveImageException(
        joinPath(DOWNLOAD_DIR, largeHashedKey),
        joinPath(IMAGE_CACHE_DIR, largeHashedKey),
        e,
      ),
    );

    expect(downloadSync.delete).toHaveBeenCalledWith(largeHashedKey);
    expect(blobutil.fs.unlink).toHaveBeenCalledWith(
      joinPath(DOWNLOAD_DIR, largeHashedKey),
    );
  }
});

test('returns existing promise while downloading existing image', async () => {
  jest.spyOn(downloadSync, 'get');
  jest
    .spyOn(blobutil.fs, 'exists')
    .mockImplementationOnce(() => Promise.resolve(false))
    .mockImplementationOnce(() => Promise.resolve(false));

  jest
    .spyOn(ImageUtil, '_download')
    .mockImplementationOnce(
      () => new Promise((res) => setTimeout(() => res({ uri: 'mocked' }), 0)),
    )
    .mockImplementationOnce(
      () => new Promise((res) => setTimeout(() => res({ uri: 'mocked' }), 0)),
    );
  const handler = jest.fn((a) => a);

  const a = downloadImage(SMALL_SAMPLE_IMAGE).then(handler);

  jest.advanceTimersByTime(50);
  await Promise.resolve();

  expect(downloadSync.size).toEqual(1);

  expect(ImageUtil._download).toHaveBeenCalledWith(
    SMALL_SAMPLE_IMAGE,
    joinPath(DOWNLOAD_DIR, smallHashedKey),
    smallHashedKey,
  );

  downloadImage(SMALL_SAMPLE_IMAGE).then(handler);

  jest.advanceTimersByTime(50);
  await Promise.resolve();

  expect(downloadSync.get).toHaveReturnedWith(a);

  jest.runOnlyPendingTimers();
  await a;
  expect(handler).toHaveBeenCalled();
});

test('returns existing image when it exists in file system', async () => {
  jest.spyOn(blobutil.fs, 'exists');
  jest.spyOn(ImageUtil, '_download');

  await blobutil
    .config({
      path: joinPath(IMAGE_CACHE_DIR, smallHashedKey),
      overwrite: true,
      timeout: 1000,
    })
    .fetch('GET', SMALL_SAMPLE_IMAGE);

  expect(fs.readdir(IMAGE_CACHE_DIR)).resolves.toEqual([smallHashedKey]);

  const a = downloadImage(SMALL_SAMPLE_IMAGE);
  jest.runOnlyPendingTimers();
  await a;

  expect(blobutil.fs.exists).toHaveReturnedWith(Promise.resolve(true));
  expect(a).resolves.toEqual({
    uri: `file://${joinPath(IMAGE_CACHE_DIR, smallHashedKey)}`,
  });
});
