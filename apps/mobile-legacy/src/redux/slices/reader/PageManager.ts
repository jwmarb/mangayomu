import CacheManager from '@components/ImprovedImage/CacheManager';
import { Manga, MangaHost } from '@mangayomu/mangascraper/src';
import getFileExtension from '@screens/Reader/components/ChapterPage/helpers/getFileExtension';
import removeURLParams from '@screens/Reader/components/ChapterPage/helpers/removeURLParams';
import { isToday } from 'date-fns';
import { READER_CACHE_DIR } from 'env';
import { Image } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

/**
 * Keys are page uris without params. Values are downloaded file uris
 */
export const pageDownloadQueue: Map<string, Promise<string>> = new Map();

function getImageSizeAsync(
  uri: string,
): Promise<{ width: number; height: number }> {
  return new Promise((res, rej) => {
    Image.getSize(
      `file://${uri}`,
      (width, height) => res({ width, height }),
      (err) => rej(err),
    );
  });
}

export default class PageManager {
  private readonly dir: string;
  private pageUris: string[];
  public constructor(manga: Manga) {
    this.dir = `${READER_CACHE_DIR}/${manga.source}/${manga.title.replace(
      /[^a-zA-Z0-9]/g,
      '',
    )}`;
    this.pageUris = [];
  }
  public setPageURIS(pageUris: string[]) {
    this.pageUris = pageUris;
  }
  public async validateDirs() {
    const doesPathExist = await RNFetchBlob.fs.exists(this.dir); // asserting that manga.source exists
    if (!doesPathExist) await RNFetchBlob.fs.mkdir(this.dir);
  }
  public static async deleteOldCache() {
    const paths = MangaHost.sources.map((x) => `${READER_CACHE_DIR}/${x}`);
    const series = (
      await Promise.all(
        paths.map(async (x) => {
          const ls = await RNFetchBlob.fs.ls(x);
          return Promise.all(
            ls.map((title) => RNFetchBlob.fs.stat(`${x}/${title}`)),
          );
        }),
      )
    ).flat();
    try {
      await Promise.all(
        series.map((stat) => {
          if (!isToday(stat.lastModified)) {
            console.log(`Deleted ${stat.filename}`);

            return RNFetchBlob.fs.unlink(stat.path);
          } else Promise.resolve();
        }),
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  private toFileURI(pageUri: string) {
    return `${this.dir}/${removeURLParams(pageUri).replace(
      /[^a-zA-Z0-9]/g,
      '',
    )}.${getFileExtension(pageUri)}`;
  }
  public static toFileURI(manga: Manga, pageUri: string) {
    return `${READER_CACHE_DIR}/${manga.source}/${manga.title.replace(
      /[^a-zA-Z0-9]/g,
      '',
    )}/${removeURLParams(pageUri).replace(
      /[^a-zA-Z0-9]/g,
      '',
    )}.${getFileExtension(pageUri)}`;
  }

  /**
   * Immediately starts the download queue for these files
   */
  public async startDownload() {
    const fileUris = this.pageUris.map((uri) =>
      this.toFileURI(removeURLParams(uri)),
    );
    const allExists = await Promise.all(fileUris.map(RNFetchBlob.fs.exists));
    for (let i = 0; i < this.pageUris.length; i++) {
      const path = fileUris[i];
      const exists = allExists[i];
      const key = removeURLParams(this.pageUris[i]);
      if (!exists) {
        pageDownloadQueue.set(
          key,
          new Promise((resolve, reject) =>
            RNFetchBlob.config({ path })
              .fetch('GET', this.pageUris[i])
              .then((result) => {
                console.log(result.info());
                pageDownloadQueue.delete(key);
                if (result.info().status !== 200)
                  RNFetchBlob.fs
                    .unlink(path)
                    .then(() =>
                      reject(`Failed to download ${this.pageUris[i]}`),
                    );
                else {
                  CacheManager.add(key);
                  resolve(result.path());
                }
              }),
          ),
        );
      } else CacheManager.add(key);
    }
  }

  public async getImageDimensions(): Promise<
    { width: number; height: number }[]
  > {
    return Promise.all(
      this.pageUris.map(async (uri) => {
        const fileUri = await this.getFileURI(uri);
        return getImageSizeAsync(fileUri);
      }),
    );
  }

  public async getImageDimension(pageUri: string) {
    const fileUri = await this.getFileURI(pageUri);
    return getImageSizeAsync(fileUri);
  }

  public async getFileURI(pageUri: string) {
    const key = removeURLParams(pageUri);
    const value = pageDownloadQueue.get(key);
    if (CacheManager.has(key)) return this.toFileURI(key);
    if (value == null)
      throw Error(
        `Tried getting a download Promise for ${key}, but it does not exist`,
      );
    return value;
  }

  /**
   * Gets file uri from memory cache, and if it does not exist, falls back to awaiting on an existing download Promise
   * @param manga The manga object
   * @param pageUri The page uri (not file uri)
   * @returns Returns the file uri
   */
  public static async getFileURI(manga: Manga, pageUri: string) {
    const key = removeURLParams(pageUri);
    const value = pageDownloadQueue.get(key);
    if (CacheManager.has(key)) return PageManager.toFileURI(manga, key);
    if (value == null)
      throw Error(
        `Tried getting a download Promise for ${key}, but it does not exist`,
      );
    return value;
  }
  /**
   * Gets file uri if it exists directly from memory cache
   * @param manga The manga object
   * @param pageUri The page uri (not file uri)
   * @returns Returns the file uri if it exists
   */
  public static getCachedFileURI(manga: Manga, pageUri: string) {
    const key = removeURLParams(pageUri);
    if (CacheManager.has(key)) return PageManager.toFileURI(manga, key);
    return null;
  }
}
