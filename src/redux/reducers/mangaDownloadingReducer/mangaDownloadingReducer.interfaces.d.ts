import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { ReadingChapterInfoRecord } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager from '@utils/DownloadManager';

export interface MangaDownloadingState {
  chapters: Record<string, null>;
  chaptersToDownload: string[]; // keys
}

export interface MangaDownloadingReducerState {
  mangas: {
    [mangaKey: string]: MangaDownloadingState | undefined;
  };
  metas: {
    [mangaKey: string]:
      | {
          [chapterKey: string]: ChapterState;
        }
      | undefined;
  };
  downloadingKeys: {
    [mangaKey: string]: string | null;
  };
}
export type ChapterState = {
  totalProgress: number;
  totalPages: number;
  downloadedPages: number;
};

export type MangaDownloadingReducerAction =
  | {
      type: 'APPEND_TO_DOWNLOAD_REDUCER';
      selected: ChaptersListReducerState['selected'];
      manga: Manga;
      chapters: ReadingChapterInfoRecord;
    }
  | { type: 'CHAPTER_DOWNLOAD_COMPLETE'; chapterKey: string; mangaKey: string }
  | {
      type: 'CHAPTER_DOWNLOAD_LISTENER';
      downloadManager: DownloadManager;
      chapterKey: string;
      mangaKey: string;
    }
  | { type: 'CANCEL_ALL_FOR_SERIES'; mangaKey: string; chapters: string[] }
  | { type: 'CANCEL_DOWNLOAD'; mangaKey: string; chapterKey: string }
  | { type: 'RERUN_DOWNLOADS' }
  | { type: 'SET_DOWNLOADING_KEY'; mangaKey: string; key: string | null }
  | { type: 'DELETE_DOWNLOADING_KEY'; mangaKey: string };
