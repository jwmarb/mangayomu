import MangaHost from '@services/scraper/scraper.abstract';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';
import {
  DownloadStatus,
  RecordDownload,
  SavedChapterDownloadState,
} from '@utils/DownloadManager/DownloadManager.interfaces';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageManager from '../StorageManager';
import { ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { DownloadableObject } from '.';
import React from 'react';

export default class DownloadManager {
  private static fetchedPages: StorageManager<Record<string, string[]>> = StorageManager.manage('@downloaded');
  private static downloadStates: StorageManager<Record<string, SavedChapterDownloadState>> =
    StorageManager.manage('@downloadStates');
  private static downloads: RecordDownload = {};
  private status: DownloadStatus;
  private downloadResumablePages: { downloadResumable: FileSystem.DownloadResumable; status: DownloadStatus }[];
  private progress: number[];
  private pages: string[];
  private chapter: MangaChapter;
  private dir: string;
  private source: MangaHost;
  private checked: boolean;

  public static getDownloads(): RecordDownload {
    return this.downloads;
  }

  public static generatePath(chapter: MangaChapter, manga: Manga) {
    return (
      FileSystem.documentDirectory +
      `Mangas/${manga.source}/${manga.title}/${chapter.name ?? `Chapter ${chapter.index}`}/`
    );
  }

  /**
   * Manage a chapter download
   * @param chapter The chapter
   * @param pathToDownload The path to download to
   * @param source The source that is used to download the pages
   * @returns Returns an instance of DownloadManager
   */
  public static of(
    chapter: MangaChapter,
    pathToDownload: string,
    source: MangaHost,
    ref?: ChapterRef | null
  ): DownloadManager {
    return (
      DownloadManager.downloads[chapter.link]?.downloadManager ??
      new DownloadManager(chapter, pathToDownload, source, undefined, ref)
    );
  }

  /**
   * Same as of() method except a ref is addable
   * @param chapter The chapter
   * @param pathToDownload The path to download to
   * @param source The source that is used to download the pages
   * @param ref The ref of the chapter component
   */
  public static setRef(chapter: ReadingChapterInfo, pathToDownload: string, source: MangaHost, ref: ChapterRef | null) {
    this.downloads[chapter.link] = {
      ref,
      downloadManager: this.of(chapter, pathToDownload, source, ref),
    };
  }

  public static clearRefs() {
    for (const key of Object.keys(this.downloads)) {
      this.downloads[key] = {
        ref: null,
        downloadManager: this.downloads[key]!.downloadManager,
      };
    }
  }

  public getChecked() {
    return this.checked;
  }

  public setChecked(bool: boolean) {
    this.checked = bool;
  }

  public getStatus(): DownloadStatus {
    return this.status;
  }
  private setStatus(status: DownloadStatus) {
    this.status = status;
  }
  public getProgress(): number {
    return this.progress.reduce((prev, curr) => prev + curr, 0) / this.progress.length;
  }

  public isDownloading(): boolean {
    return (
      this.getStatus() === DownloadStatus.START_DOWNLOADING || this.getStatus() === DownloadStatus.RESUME_DOWNLOADING
    );
  }

  public isPaused(): boolean {
    return this.getStatus() === DownloadStatus.PAUSED;
  }

  public isCancelled(): boolean {
    return this.getStatus() === DownloadStatus.CANCELLED;
  }

  public isIdle(): boolean {
    return this.getStatus() === DownloadStatus.IDLE;
  }

  public isQueued(): boolean {
    return this.getStatus() === DownloadStatus.QUEUED;
  }

  private async downloadProgressCallback({
    totalBytesExpectedToWrite,
    totalBytesWritten,
    index: i,
  }: FileSystem.DownloadProgressData & { index: number }) {
    this.progress[i] = totalBytesWritten / totalBytesExpectedToWrite;
    // console.log(`${i} = ${this.progress[i]}`);
    if (this.progress[i] >= 1) this.downloadResumablePages[i].status = DownloadStatus.DOWNLOADED;
    if (this.getProgress() >= 1) {
      this.setStatus(DownloadStatus.DOWNLOADED);
      await this.removeFromStorage();
    }
  }

  /**
   * Check if there are any missing pages
   */
  public async verifyPages(): Promise<boolean> {
    const state = await DownloadManager.fetchedPages.get();
    if (state == null) return false;
    const pages = state[this.chapter.link];
    if (pages == null) return false;

    for (let i = 0; i < pages.length; i++) {
      const info = await FileSystem.getInfoAsync(this.dir + `${i + 1}.png`);
      if (!info.exists) return false;
    }

    return true;
  }

  public getChapter() {
    return this.chapter;
  }

  public getDownloadableObject() {
    if (this.chapter == null) console.log(this.chapter);
    return DownloadManager.downloads[this.chapter.link]!;
  }

  /**
   * Queue the chapter for download.
   */
  public queue() {
    switch (this.getStatus()) {
      case DownloadStatus.IDLE:
        this.setStatus(DownloadStatus.QUEUED);
        break;
    }
  }

  /**
   * Download the pages of the chapter
   */
  public async download() {
    if (this.getStatus() !== DownloadStatus.START_DOWNLOADING) {
      try {
        await FileSystem.readDirectoryAsync(this.dir);
      } catch (e) {
        await FileSystem.makeDirectoryAsync(this.dir, { intermediates: true });
      } finally {
        const savedState = (await DownloadManager.fetchedPages.get()) ?? {};
        const p =
          this.pages.length > 0
            ? this.pages
            : savedState[this.chapter.link] ?? (await this.source.getPages(this.chapter));
        this.pages = p;
        const existingFiles = await Promise.all(
          p.map(async (x, i) => {
            return await FileSystem.getInfoAsync(this.dir + `${i + 1}.png`);
          })
        );
        this.downloadResumablePages = p.map((x, i) => ({
          status: existingFiles[i].exists ? DownloadStatus.DOWNLOADED : DownloadStatus.IDLE,
          downloadResumable: FileSystem.createDownloadResumable(x, this.dir + `${i + 1}.png`, {}, (x) =>
            this.downloadProgressCallback({ index: i, ...x })
          ),
        }));
        this.progress = existingFiles.map((x, i) => (x.exists ? 1 : 0));
        await DownloadManager.fetchedPages.set({ ...savedState, [this.chapter.link]: this.pages });
        this.setStatus(DownloadStatus.START_DOWNLOADING);
        for (let i = 0; i < this.downloadResumablePages.length; i++) {
          const { downloadResumable, status } = this.downloadResumablePages[i];

          if (
            this.getStatus() === DownloadStatus.START_DOWNLOADING &&
            this.downloadResumablePages[i].status === DownloadStatus.IDLE
          )
            try {
              // console.log(`Starting download for page ${i + 1}. Called by download()`);
              this.downloadResumablePages[i].status = DownloadStatus.DOWNLOADING;
              await downloadResumable.downloadAsync();
            } catch (e) {
              console.error(e);
              this.setStatus(DownloadStatus.ERROR);
            }
          else continue;
        }
      }
    }
  }

  /**
   * Pause the download
   */
  public async pause() {
    if (this.getStatus() !== DownloadStatus.PAUSED) {
      this.setStatus(DownloadStatus.PAUSED);
      for (let i = 0; i < this.downloadResumablePages.length; i++) {
        if (this.downloadResumablePages[i].status === DownloadStatus.DOWNLOADING)
          this.downloadResumablePages[i].status = DownloadStatus.PAUSED;
      }

      for (let i = 0; i < this.downloadResumablePages.length; i++) {
        const { downloadResumable } = this.downloadResumablePages[i];
        if (this.downloadResumablePages[i].status === DownloadStatus.PAUSED)
          try {
            await downloadResumable.pauseAsync();
          } catch (e) {
            this.setStatus(DownloadStatus.ERROR);
            console.error(e);
          }
      }
      await this.addToStorage();
    }
  }

  public async resume() {
    if (this.getStatus() !== DownloadStatus.RESUME_DOWNLOADING) {
      this.setStatus(DownloadStatus.RESUME_DOWNLOADING);
      for (let i = 0; i < this.downloadResumablePages.length; i++) {
        if (this.downloadResumablePages[i].status === DownloadStatus.PAUSED)
          this.downloadResumablePages[i].status = DownloadStatus.DOWNLOADING;
      }
      for (let i = 0; i < this.downloadResumablePages.length; i++) {
        const { downloadResumable, status } = this.downloadResumablePages[i];
        if (status === DownloadStatus.DOWNLOADED) {
          // console.log(`Page ${i + 1} is already downloaded. Skipping...`);
          continue;
        }
        if (this.getStatus() === DownloadStatus.RESUME_DOWNLOADING)
          switch (status) {
            case DownloadStatus.DOWNLOADING:
              try {
                // console.log(`Resuming download for page ${i + 1}`);
                await downloadResumable.resumeAsync();
              } catch (e) {
                this.setStatus(DownloadStatus.ERROR);
                console.error(e);
              }
              break;
            case DownloadStatus.IDLE:
              try {
                // console.log(`Starting download for page ${i + 1}. Called by resume()`);
                this.downloadResumablePages[i].status = DownloadStatus.DOWNLOADING;
                await downloadResumable.downloadAsync();
              } catch (e) {
                this.setStatus(DownloadStatus.ERROR);
                console.error(e);
              }
          }
      }
      await this.removeFromStorage();
    }
  }

  public async cancel() {
    this.setStatus(DownloadStatus.CANCELLED);

    try {
      for (let i = 0; i < this.downloadResumablePages.length; i++) {
        const { downloadResumable, status } = this.downloadResumablePages[i];
        if (status !== DownloadStatus.CANCELLED) {
          await downloadResumable.cancelAsync();
          this.downloadResumablePages[i].status = DownloadStatus.CANCELLED;
        }
      }
    } catch (e) {
      this.setStatus(DownloadStatus.ERROR);
      console.error(e);
    } finally {
      this.downloadResumablePages = [];
      await this.removeFromStorage();
    }
  }

  public async isDownloaded(): Promise<boolean> {
    try {
      const info = await FileSystem.getInfoAsync(this.dir);
      if (
        this.getStatus() === DownloadStatus.RESUME_DOWNLOADING ||
        this.getStatus() === DownloadStatus.START_DOWNLOADING ||
        this.getStatus() === DownloadStatus.PAUSED
      )
        return false;
      return info.exists && info.isDirectory && (await this.verifyPages());
    } catch (e) {
      this.setStatus(DownloadStatus.ERROR);
      console.error(e);
    }
    return false;
  }

  private async removeFromStorage() {
    const p = (await DownloadManager.downloadStates.get()) ?? {};
    delete p[this.chapter.link];
    await DownloadManager.downloadStates.set(p);
  }

  private async addToStorage() {
    const p = (await DownloadManager.downloadStates.get()) ?? {};
    await DownloadManager.downloadStates.set({
      ...p,
      [this.chapter.link]: {
        chapter: this.chapter,
        dir: this.dir,
        pages: this.pages,
        progress: this.progress,
        sourceName: this.source.getName(),
        status: this.getStatus(),
        state: this.downloadResumablePages.map(({ status, downloadResumable }) => ({
          status,
          downloadState: downloadResumable.savable(),
        })),
      },
    });
  }

  public static async initialize() {
    // console.log('Initializing Download Manager');
    try {
      const existingState = (await this.downloadStates.get()) ?? {};
      for (const [key, value] of Object.entries(existingState)) {
        new DownloadManager(undefined, undefined, undefined, value);
      }
    } catch (e) {
      // console.log('Failed to find existing state');
    }
  }

  public constructor(
    chapter?: MangaChapter,
    pathToDownload?: string,
    source?: MangaHost,
    existingState?: SavedChapterDownloadState,
    ref?: ChapterRef | null
  ) {
    this.checked = false;
    if (chapter && pathToDownload && source) {
      this.source = source;
      this.dir = pathToDownload;
      this.chapter = chapter;
      this.status = DownloadStatus.IDLE;
      this.progress = [];
      this.downloadResumablePages = [];
      this.pages = [];

      DownloadManager.downloads[chapter.link] = { ref: ref ?? null, downloadManager: this };
    } else if (existingState) {
      this.source = MangaHost.getAvailableSources().get(existingState.sourceName)!;
      this.dir = existingState.dir;
      this.chapter = existingState.chapter;
      this.status = existingState.status;
      this.progress = existingState.progress;
      this.pages = existingState.pages;
      this.downloadResumablePages = existingState.pages.map((x, i) => ({
        status: existingState.state[i].status,
        downloadResumable: FileSystem.createDownloadResumable(
          x,
          existingState.state[i].downloadState.fileUri,
          undefined,
          (x) => this.downloadProgressCallback({ index: i, ...x }),
          existingState.state[i].downloadState.resumeData
        ),
      }));
      // console.log(`Existing download state for ${existingState.chapter.link}`);
      DownloadManager.downloads[existingState.chapter.link] = { ref: ref ?? null, downloadManager: this };
    } else throw Error('No args passed in constructor of DownloadManager');
  }
}
