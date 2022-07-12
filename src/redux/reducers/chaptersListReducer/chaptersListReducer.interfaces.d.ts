import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus, SavedChapterDownloadState } from '@utils/DownloadManager';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';

export interface ChaptersListReducerState {
  checkAll: boolean;
  mode: ChapterPressableMode;
  selected: Record<string, null>;
  numOfSelected: number;
  totalChapters: number;
}

export type ChaptersListReducerAction =
  | { type: 'EXIT_SELECTION_MODE' }
  | { type: 'ENTER_SELECTION_MODE' }
  | { type: 'SELECT_CHAPTER'; checked: boolean; chapter: ReadingChapterInfo }
  | { type: 'INITIALIZE_STATE'; totalChapters: number }
  | { type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER'; chapter: ReadingChapterInfo; status: DownloadStatus; manga: Manga }
  | { type: 'TOGGLE_CHECK_ALL'; checked: boolean; chapters: ReadingChapterInfo[] }
  | { type: 'SET_TOTAL_PROGRESS_OF_CHAPTER'; chapter: ReadingChapterInfo; progress: number }
  | { type: 'SELECT_CHAPTERS'; chapters: ReadingChapterInfo[] };
