import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';

export type ChapterState = {
  downloadManager: DownloadManager;
  status: DownloadStatus;
  checked: boolean;
};

export interface ChaptersListReducerState {
  mode: ChapterPressableMode;
  chapters: Record<string, ChapterState>;
}

export type ChaptersListReducerAction =
  | { type: 'EXIT_SELECTION_MODE' }
  | { type: 'ENTER_SELECTION_MODE' }
  | { type: 'SELECT_CHAPTER'; checked: boolean; chapter: ReadingChapterInfo }
  | { type: 'INITIALIZE_CHAPTER_STATES'; chapters: ReadingChapterInfo[]; manga: Manga }
  | { type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER'; chapter: ReadingChapterInfo; status: DownloadStatus };
