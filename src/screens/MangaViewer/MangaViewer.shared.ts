import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import { Constants } from '@theme/core';
import DownloadManager from '@utils/DownloadManager';

export const GRADIENT_COLOR = Constants.GRAY['13'];

export class ChaptersIterator implements Iterable<DownloadManager> {
  private maxIndex: number;
  private arr: ReadingChapterInfo[];
  private manga: Manga;
  private source: MangaHost;

  constructor(arr: ReadingChapterInfo[], manga: Manga, source: MangaHost) {
    this.arr = arr;
    this.maxIndex = this.arr.length - 1;
    this.manga = manga;
    this.source = source;
  }

  public setChapters(chapters: ReadingChapterInfo[]) {
    this.arr = chapters;
    this.maxIndex = chapters.length - 1;
  }

  public [Symbol.iterator](): Iterator<DownloadManager> {
    let i = 0;
    return {
      next: () => {
        if (this.maxIndex === -1) return { value: undefined, done: true };
        if (i >= this.maxIndex) return { value: undefined, done: true };
        const dl = DownloadManager.of(this.arr[i], DownloadManager.generatePath(this.arr[i], this.manga), this.source);
        i++;
        return { value: dl, done: false };
      },
    };
  }

  forEach(fn: ((el: DownloadManager, i: number) => void) | ((el: DownloadManager, i: number) => Promise<void>)) {
    for (let i = 0; i < this.arr.length; i++) {
      fn(DownloadManager.of(this.arr[i], DownloadManager.generatePath(this.arr[i], this.manga), this.source), i);
    }
  }
}
