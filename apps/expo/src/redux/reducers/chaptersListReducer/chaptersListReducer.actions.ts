import { AppDispatch, AppState } from '@redux/store';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { getKey } from './chaptersListReducer';
import pLimit from 'p-limit';
import StorageManager from '@utils/StorageManager';
import MangaHost from '@services/scraper/scraper.abstract';

type StateGetter = () => AppState;

const limit = pLimit(1);
export const cursors: StorageManager<
  Record<
    string,
    {
      shouldDownload: boolean;
    }
  >
> = StorageManager.manage('downloadCursors', {});

export const hideFloatingModal = (payload: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SHOULD_HIDE_FLOATING_MODAL', payload });
  };
};

export const exitSelectionMode = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'EXIT_SELECTION_MODE' });
  };
};

export const enterSelectionMode = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'ENTER_SELECTION_MODE' });
  };
};

export const checkChapter = (val: boolean, ch: ReadingChapterInfo) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SELECT_CHAPTER', checked: val, chapter: ch });
  };
};

export const initializeChapters = (chapters: MangaChapter[], manga: Manga) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    dispatch({ type: 'INITIALIZE_STATE', totalChapters: chapters.length });
    try {
      for (const key in getState().mangas[manga.link].chapters) {
        await DownloadManager.ofWithManga(getState().mangas[manga.link].chapters[key], manga).validate();
      }
    } finally {
      dispatch({ type: 'VALIDATE_CHAPTERS', payload: manga }); // in mangaReducer.ts
    }
  };
};

export const checkAll = (val: boolean, chapters: ReadingChapterInfo[]) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_CHECK_ALL', checked: val, chapters });
  };
};

export const checkAllChapters = (chapters: ReadingChapterInfo[]) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SELECT_CHAPTERS', chapters });
  };
};

export const setDownloadStatusOfChapter = (chapter: ReadingChapterInfo, manga: Manga) => {
  return (dispatch: AppDispatch) => {
    return (status: DownloadStatus) => {
      dispatch({ type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER', chapter, status, manga });
    };
  };
};

export const setTotalProgressOfChapter = (chapter: ReadingChapterInfo) => {
  return (dispatch: AppDispatch) => {
    return (progress: number) => {
      dispatch({ type: 'SET_TOTAL_PROGRESS_OF_CHAPTER', chapter, progress });
    };
  };
};
