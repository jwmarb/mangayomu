import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { Manga, MangaChapter, MangaMeta, MangaPage } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';

export type ReadingChapterInfo = MangaChapter & {
  /**
   * The scroll position of the reader
   */
  scrollPosition: number;

  /**
   * An array of manga pages. Can be null if the user has not read the chapter yet
   */
  pages: MangaPage[] | null;

  /**
   * The index of the current page the user is on
   */
  indexPage: number;

  /**
   * The time the chapter was last read
   */
  dateRead: string | null;

  /**
   * The validation status of the chapter in the user's file system
   */
  validatedStatus: DownloadStatus;

  /**
   * The current status of the chapter in the user's file system
   */
  status: DownloadStatus;
};

export type ReadingChapterInfoRecord = Record<string, ReadingChapterInfo>;

export interface ReadingMangaInfo extends MangaMeta, Manga {
  /**
   * The chapters of the manga which include user data with the chapter
   */
  chapters: ReadingChapterInfoRecord;

  /**
   * Determines whether or not the user has the manga added in their library
   */
  inLibrary: boolean;

  /**
   * The current chapter the user is reading
   */
  currentlyReadingChapter: ReadingChapterInfo | null;
}

export type MangaReducerState = Record<string, ReadingMangaInfo>;

export type MangaReducerAction =
  | {
      type: 'VIEW_MANGA';
      payload: Manga & MangaMeta;
    }
  | { type: 'TOGGLE_LIBRARY'; payload: Manga }
  | { type: 'VALIDATE_CHAPTERS'; payload: Manga }
  | {
      type: 'APPEND_TO_DOWNLOAD_REDUCER';
      selected: ChaptersListReducerState['selected'];
      chapters: ReadingChapterInfoRecord;
      manga: Manga;
    }
  | { type: 'CHAPTER_DOWNLOAD_COMPLETE'; mangaKey: string; chapterKey: string }
  | {
      type: 'CHAPTER_DOWNLOAD_LISTENER';

      chapterKey: string;
      mangaKey: string;
    }
  | { type: 'CANCEL_ALL_FOR_SERIES'; mangaKey: string; chapters: string[] }
  | { type: 'VALIDATE_FILE_INTEGRITY'; mangaKey: string; chapterKey: string; stage: 'prepare' | 'finish' };
