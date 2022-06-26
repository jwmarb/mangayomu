import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus, SavedChapterDownloadState } from '@utils/DownloadManager';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';

export type ChapterState = {
  downloadManager: DownloadManager;
  status: DownloadStatus;
  checked: boolean;
  totalProgress: number;
  hasCursor: boolean;
  link: string;
};

export interface ChaptersListReducerState {
  checkAll: boolean;
  mode: ChapterPressableMode;
  chapters: Record<string, ChapterState>;
  downloadStates: Record<string, SavedChapterDownloadState>;
  mangasInDownloading: Record<string, DownloadingManga>;
}

export interface DownloadingManga {
  chapters: string[];
  cursorPosition?: string;
  numToDownload: number;
  numDownloadCompleted: number;
}

export type ChaptersListReducerAction =
  | { type: 'EXIT_SELECTION_MODE' }
  | { type: 'ENTER_SELECTION_MODE' }
  | { type: 'SELECT_CHAPTER'; checked: boolean; chapter: ReadingChapterInfo }
  | { type: 'INITIALIZE_CHAPTER_STATES'; chapters: ReadingChapterInfo[]; manga: Manga }
  | { type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER'; chapter: ReadingChapterInfo; status: DownloadStatus }
  | { type: 'TOGGLE_CHECK_ALL'; checked: boolean }
  | { type: 'UPDATE_CHAPTER_STATUS'; key: string; status?: DownloadStatus; manga: Manga }
  | { type: 'SET_TOTAL_PROGRESS_OF_CHAPTER'; chapter: ReadingChapterInfo; progress: number }
  | { type: 'RESUME_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[] }
  | { type: 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[] }
  | { type: 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS'; keys: string[]; manga: Manga }
  | { type: 'QUEUE_ALL_SELECTED'; keys: string[]; manga: Manga }
  | { type: 'VALIDATE_CHAPTER'; chapter: ReadingChapterInfo }
  | { type: 'SELECT_CHAPTERS'; chapters: ReadingChapterInfo[] }
  | { type: 'CURSOR_FINISH_DOWNLOADING'; manga: Manga }
  | { type: 'CURSOR_DOWNLOADING_ITEM'; manga: Manga; key: string }
  | { type: 'CHAPTER_DOWNLOADED'; manga: Manga }
  | { type: 'INITIALIZE_FULLY_VALIDATED_STATUS'; chapters: ReadingChapterInfo[]; manga: Manga }
  | { type: 'SET_SAVED_DOWNLOAD_STATE'; downloadState: SavedChapterDownloadState; key: string }
  | { type: 'DELETE_SAVED_DOWNLOAD_STATE'; key: string };
