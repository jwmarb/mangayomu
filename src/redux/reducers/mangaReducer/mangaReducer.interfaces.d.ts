import { MangaChapter, MangaMeta, MangaPage } from '@services/scraper/scraper.interfaces';

export interface ReadingChapterInfo extends MangaChapter {
  /**
   * The scroll position of the reader
   */
  scrollPosition: number;

  /**
   * An array of manga pages
   */
  pages: MangaPage[];

  /**
   * The index of the current page the user is on
   */
  indexPage: number;
}

export interface ReadingMangaInfo extends MangaMeta {
  /**
   * Determines whether or not the user has the manga added in their library
   */
  inLibrary: boolean;

  /**
   * The chapters of the manga
   */
  chapters: MangaChapter[];

  /**
   * The current chapter the user is reading
   */
  currentlyReadingChapter: MangaChapter | null;
}

export type MangaReducerState = Record<string, MangaMeta>;

export type MangaReducerAction = {
  type: 'VIEW_MANGA';
  payload: MangaMeta;
};
