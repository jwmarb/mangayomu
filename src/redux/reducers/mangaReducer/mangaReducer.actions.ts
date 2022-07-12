import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';
import { Dispatch } from 'redux';
import { MangaReducerAction } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppDispatch, AppState } from '@redux/store';
import DownloadManager from '@utils/DownloadManager';

export function viewManga(meta: MangaMeta & Manga) {
  return (dispatch: Dispatch<MangaReducerAction>) => {
    dispatch({ type: 'VIEW_MANGA', payload: meta });
  };
}

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
