import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';

export type ChapterState = {
  downloadManager: DownloadManager;
  status: DownloadStatus;
  checked: boolean;
  totalProgress: number;
  hasCursor: boolean;
};

export interface ChaptersListReducerState {
  checkAll: boolean;
  mode: ChapterPressableMode;
  chapters: Record<string, ChapterState>;
  mangasInDownloading: Record<string, string[]>;
}

export type ChaptersListReducerAction =
  | { type: 'EXIT_SELECTION_MODE' }
  | { type: 'ENTER_SELECTION_MODE' }
  | { type: 'SELECT_CHAPTER'; checked: boolean; chapter: ReadingChapterInfo }
  | { type: 'INITIALIZE_CHAPTER_STATES'; chapters: ReadingChapterInfo[]; manga: Manga }
  | { type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER'; chapter: ReadingChapterInfo; status: DownloadStatus }
  | { type: 'TOGGLE_CHECK_ALL'; checked: boolean }
  | { type: 'UPDATE_CHAPTER_STATUS'; key: string; status?: DownloadStatus }
  | { type: 'SET_TOTAL_PROGRESS_OF_CHAPTER'; chapter: ReadingChapterInfo; progress: number }
  | { type: 'RESUME_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[] }
  | { type: 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[] }
  | { type: 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[]; manga: Manga }
  | { type: 'QUEUE_ALL_SELECTED'; keys: string[]; manga: Manga }
  | { type: 'VALIDATE_CHAPTER'; chapter: ReadingChapterInfo }
  | { type: 'SELECT_CHAPTERS'; chapters: ReadingChapterInfo[] }
  | { type: 'CURSOR_FINISH_DOWNLOADING'; manga: Manga };
