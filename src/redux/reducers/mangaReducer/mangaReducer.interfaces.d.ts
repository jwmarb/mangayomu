import { Manga, MangaChapter, MangaMeta, MangaPage } from '@services/scraper/scraper.interfaces';

export interface ReadingChapterInfo extends MangaChapter {
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
}

export interface ReadingMangaInfo extends MangaMeta, Manga {
  /**
   * The chapters of the manga which include user data with the chapter
   */
  chapters: ReadingChapterInfo[];

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
  | { type: 'TOGGLE_LIBRARY'; payload: Manga };
