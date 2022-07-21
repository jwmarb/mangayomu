import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { Manga, MangaChapter, MangaMeta, MangaPage } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import SortedList from '@utils/SortedList';

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
   * A list of chapters in an ascending order. This variable is meant to know which chapter is next or previous of the currently reading chapter.
   */
  orderedChapters: SortedList<MangaChapter>;

  /**
   * Determines whether or not the user has the manga added in their library
   */
  inLibrary: boolean;

  /**
   * The date when the manga was added into the library. It is null if the manga is not in the library
   */
  dateAddedInLibrary: string | null;

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
  | { type: 'VALIDATE_FILE_INTEGRITY'; mangaKey: string; chapterKey: string; stage: 'prepare' | 'finish' }
  | { type: 'VALIDATE_FILE_INTEGRITIES'; mangaKey: string; chapterKeys: string[]; stage: 'prepare' | 'finish' }
  | { type: 'VALIDATE_WHOLE_MANGA_FILE_INTEGRITY'; mangaKey: string; stage: 'prepare' | 'finish' }
  | { type: 'CANCEL_DOWNLOAD'; mangaKey: string; chapterKey: string };
