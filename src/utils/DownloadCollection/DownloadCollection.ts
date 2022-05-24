import { ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import * as FileSystem from 'expo-file-system';
import pLimit, { LimitFunction } from 'p-limit';

export default class DownloadCollection {
  private static downloadCollections: Record<string, DownloadCollection> = {};
  private key: string;
  private dir: string;
  private source: MangaHost;
  private concurrencyLimit: LimitFunction;
  private status: DownloadStatus;
  private limitDownload: number;
  private queuedChapters: ReadingChapterInfo[];
  private shouldDownloadChapters: boolean;
  public constructor(
    dir: string,
    chapters: ReadingChapterInfo[],
    source: MangaHost,
    limitDownload: number = chapters.length,
    concurrencyLimit: number = 1
  ) {
    this.dir = dir;
    this.queuedChapters = chapters;
    this.shouldDownloadChapters = false;
    this.concurrencyLimit = pLimit(concurrencyLimit);
    this.limitDownload = limitDownload;
    this.key = `${dir}_${limitDownload}_${concurrencyLimit}`;
    this.source = source;
    this.status = DownloadStatus.IDLE;
    DownloadCollection.downloadCollections[this.key] = this;
  }

  public static of(
    dir: string,
    chapters: ReadingChapterInfo[],
    source: MangaHost,
    limitDownload?: number,
    concurrencyLimit?: number
  ) {
    return (
      this.downloadCollections[`${dir}_${limitDownload}_${concurrencyLimit}`] ??
      new DownloadCollection(dir, chapters, source, limitDownload, concurrencyLimit)
    );
  }

  private getDownloadableObject(dl: ReadingChapterInfo) {
    return DownloadManager.of(
      dl,
      this.dir + `${dl.name ?? `Chapter ${dl.index}`}/`,
      this.source
    ).getDownloadableObject();
  }

  public isDownloading() {
    return this.status === DownloadStatus.DOWNLOADING;
  }

  public isQueued() {
    return this.status === DownloadStatus.QUEUED;
  }

  public isIdle() {
    return this.status === DownloadStatus.IDLE;
  }

  public isPaused() {
    return this.status === DownloadStatus.PAUSED;
  }

  public isCancelled() {
    return this.status === DownloadStatus.CANCELLED;
  }

  public async queueAll() {
    for (let i = 0; i < this.limitDownload; i++) {
      const dl = this.getDownloadableObject(this.queuedChapters[i]);

      const { ref } = dl;
      if (ref != null) ref.queue();
      else dl.downloadManager.queue();
    }

    this.shouldDownloadChapters = true;
    this.status = DownloadStatus.QUEUED;
  }

  public async downloadAll(): Promise<void> {
    if (this.shouldDownloadChapters === false)
      return console.error(
        'Tried to download when chapters are not queued for download. Use queue() method to queue chapters for download then run downloadAll() again'
      );

    this.status = DownloadStatus.DOWNLOADING;

    await Promise.all(
      this.queuedChapters.map((x) =>
        this.concurrencyLimit(async () => {
          if (this.shouldDownloadChapters) {
            const dl = this.getDownloadableObject(x);
            const { ref } = dl;
            if (ref != null) {
              console.log(`Downloading ${x.link} through Ref`);
              await ref.downloadAsync();
            } else {
              console.log(`Downloading ${x.link} through DownloadManager`);
              await dl.downloadManager.download();
            }
          } else console.log(`Skipped ${x.link}`);
        })
      )
    );
  }

  public async pauseAll(): Promise<void> {
    this.shouldDownloadChapters = false;
    this.status = DownloadStatus.PAUSED;
    for (let i = 0; i < this.queuedChapters.length; i++) {
      const dl = this.getDownloadableObject(this.queuedChapters[i]);
      const { ref } = dl;
      console.log(`Pausing ${this.queuedChapters[i].link}`);
      if (ref != null) await ref.pauseAsync();
      else await dl.downloadManager.pause();
    }
  }

  public async resumeAll() {
    this.shouldDownloadChapters = true;
    this.status = DownloadStatus.DOWNLOADING;
    await Promise.all(
      this.queuedChapters.map((x) =>
        this.concurrencyLimit(async () => {
          if (this.shouldDownloadChapters) {
            const dl = this.getDownloadableObject(x);
            const { ref } = dl;
            if (ref != null) {
              console.log(`Resuming download for ${x.link} through Ref`);
              await ref.resumeAsync();
            } else {
              console.log(`Resuming download for ${x.link} through DownloadManager`);
              await dl.downloadManager.resume();
            }
          } else console.log(`Skipped ${x.link}`);
        })
      )
    );
  }

  public async cancelAll() {
    this.shouldDownloadChapters = false;
    this.status = DownloadStatus.CANCELLED;
    for (let i = 0; i < this.queuedChapters.length; i++) {
      const dl = this.getDownloadableObject(this.queuedChapters[i]);
      const { ref } = dl;
      if (ref != null) await ref.cancelAsync();
      else await dl.downloadManager.cancel();
    }
    delete DownloadCollection.downloadCollections[this.key];
  }
}
