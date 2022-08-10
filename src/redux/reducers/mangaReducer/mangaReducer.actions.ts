import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';
import { Dispatch } from 'redux';
import { MangaReducerAction } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppDispatch, AppState } from '@redux/store';
import DownloadManager from '@utils/DownloadManager';
import pLimit from 'p-limit';

export function viewManga(meta: MangaMeta & Manga) {
  return (dispatch: Dispatch<MangaReducerAction>) => {
    dispatch({ type: 'VIEW_MANGA', payload: meta });
  };
}

export const validateChapters = (chapters: Record<string, null>, mangaKey: string) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const chapterKeys = Object.keys(chapters);
    dispatch({ type: 'VALIDATE_FILE_INTEGRITIES', mangaKey, chapterKeys, stage: 'prepare' });
    const limit = pLimit(1);
    try {
      for (const key of chapterKeys) {
        // console.log(`${key} -> VERIFYING... INITIATED BY USER`);
        const downloadManager = DownloadManager.ofWithManga(
          getState().mangas[mangaKey].chapters[key],
          getState().mangas[mangaKey]
        );
        await limit(() => downloadManager.validateFileIntegrity());
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: 'VALIDATE_FILE_INTEGRITIES', mangaKey, chapterKeys, stage: 'finish' });
    }
  };
};

export const prepareForValidation = (mangaKey: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'VALIDATE_WHOLE_MANGA_FILE_INTEGRITY', mangaKey, stage: 'prepare' });
  };
};

export const validateManga = (mangaKey: string) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch({ type: 'VALIDATE_WHOLE_MANGA_FILE_INTEGRITY', mangaKey, stage: 'prepare' });
    const limit = pLimit(1);

    try {
      for (const key in getState().mangas[mangaKey].chapters) {
        const downloadManager = DownloadManager.ofWithManga(
          getState().mangas[mangaKey].chapters[key],
          getState().mangas[mangaKey]
        );
        // console.log(`${key} -> VERIFYING... INITIATED BY USER`);

        await limit(() => downloadManager.validateFileIntegrity());
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.log(`Fully validated ${mangaKey}`);
      dispatch({ type: 'VALIDATE_WHOLE_MANGA_FILE_INTEGRITY', mangaKey, stage: 'finish' });
    }
  };
};

export const validateFileIntegrity = (mangaKey: string, chapterKey: string) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const downloadManager = DownloadManager.ofWithManga(
      getState().mangas[mangaKey].chapters[chapterKey],
      getState().mangas[mangaKey]
    );
    dispatch({ type: 'VALIDATE_FILE_INTEGRITY', mangaKey, chapterKey, stage: 'prepare' });
    try {
      await downloadManager.validateFileIntegrity();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: 'VALIDATE_FILE_INTEGRITY', mangaKey, chapterKey, stage: 'finish' });
    }
  };
};

export const toggleLibrary = (manga: Manga) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_LIBRARY', payload: manga });
  };
};

export const setIndexPage = (mangaKey: string, chapterKey: string, indexPage: number) => {
  return (dispatch: AppDispatch) => {
    if (!Number.isNaN(indexPage)) dispatch({ type: 'SET_INDEX_PAGE', mangaKey, chapterKey, indexPage });
  };
};

export const simulateNewChapters = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SIMULATE_NEW_CHAPTERS' });
  };
};

export const appendNewChapters = (payload: Manga & MangaMeta) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CHAPTER_UPDATES', payload });
  };
};
