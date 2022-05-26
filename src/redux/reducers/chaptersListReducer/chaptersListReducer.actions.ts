import { AppDispatch } from '@redux/store';
import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChapterState } from './chaptersListReducer.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';
import { DownloadStatus } from '@utils/DownloadManager';
import store from '@redux/store';
import { getKey } from './chaptersListReducer';

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

export const initializeChapterStates = (chapters: ReadingChapterInfo[], manga: Manga) => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: 'INITIALIZE_CHAPTER_STATES', chapters, manga });
    await Promise.all(
      chapters.map(async (x) => {
        const downloadManager = store.getState().chaptersList.chapters[getKey(x)].downloadManager;
        const downloaded = await downloadManager.isDownloaded();
        const initialStatus = downloaded ? DownloadStatus.DOWNLOADED : downloadManager.getStatus();
        dispatch({ type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER', chapter: x, status: initialStatus });
      })
    );
  };
};

export const setDownloadStatusOfChapter = (chapter: ReadingChapterInfo) => {
  return (dispatch: AppDispatch) => {
    return (status: DownloadStatus) => {
      dispatch({ type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER', chapter, status });
    };
  };
};
