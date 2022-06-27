import { AppDispatch, AppState } from '@redux/store';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChapterState } from './chaptersListReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
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
    if (chapters.length > 0)
      try {
        for (const x of chapters) {
          await DownloadManager.ofWithManga(x, manga).validate();
        }
      } catch (e) {
        console.error(e);
      } finally {
        console.log('Fully initialized validated states');
        dispatch({ type: 'INITIALIZE_FULLY_VALIDATED_STATUS', chapters, manga });
      }
  };
};

export const downloadAllSelected = (selected: Record<string, ChapterState>, manga: Manga) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const keys = Object.values(selected).map((x) => x.link);
    const obj = cursors.get();
    obj[manga.link] = {
      shouldDownload: true,
    };
    cursors.set(obj);
    try {
      for (const key of keys) {
        await DownloadManager.ofWithManga(getState().mangas[manga.link].chapters[key], manga).queue();
      }
    } finally {
      dispatch({
        type: 'QUEUE_ALL_SELECTED',
        chapters: keys.map((x) => getState().mangas[manga.link].chapters[x]),
        manga,
      });
    }

    await Promise.all(
      keys.map((key) =>
        limit(async () => {
          if (cursors.get()[manga.link]?.shouldDownload) {
            dispatch({ type: 'CURSOR_DOWNLOADING_ITEM', manga, key });
            const downloadManager = DownloadManager.ofWithManga(getState().mangas[manga.link].chapters[key], manga);
            try {
              switch (getState().chaptersList.chapters[key].status) {
                case DownloadStatus.QUEUED:
                  dispatch({
                    type: 'UPDATE_CHAPTER_STATUS',
                    key,
                    status: DownloadStatus.START_DOWNLOADING,
                    manga,
                    chapter: getState().mangas[manga.link].chapters[key],
                  });
                  await downloadManager.download();
                  break;
                case DownloadStatus.PAUSED:
                  dispatch({
                    type: 'UPDATE_CHAPTER_STATUS',
                    key,
                    status: DownloadStatus.RESUME_DOWNLOADING,
                    manga,
                    chapter: getState().mangas[manga.link].chapters[key],
                  });
                  await downloadManager.resume();
                  break;
              }
            } finally {
              if (downloadManager.getStatus() === DownloadStatus.DOWNLOADED)
                dispatch({ type: 'CHAPTER_DOWNLOADED', manga });
            }
          }
        })
      )
    );

    if (
      obj[manga.link] &&
      Object.values(getState().chaptersList.mangasInDownloading[manga.link].chapters).every(
        (x) => x.status === DownloadStatus.DOWNLOADED
      )
    ) {
      dispatch({ type: 'CURSOR_FINISH_DOWNLOADING', manga });
      delete obj[manga.link];
      cursors.set(obj);
    }
  };
};

export const pauseAllSelected = (manga: Manga) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    const obj = cursors.get();
    const keys = Object.keys(getState().chaptersList.mangasInDownloading[manga.link].chapters);
    obj[manga.link].shouldDownload = false;
    cursors.set(obj);

    for (const key of keys) {
      const downloadManager = DownloadManager.ofWithManga(getState().mangas[manga.link].chapters[key], manga);

      if (
        getState().chaptersList.mangasInDownloading[manga.link].chapters[key].status ===
          DownloadStatus.START_DOWNLOADING ||
        getState().chaptersList.mangasInDownloading[manga.link].chapters[key].status ===
          DownloadStatus.RESUME_DOWNLOADING
      )
        await downloadManager.pause();
    }
    dispatch({
      type: 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS',
      chapters: keys.map((x) => getState().mangas[manga.link].chapters[x]),
      manga,
    });
  };
};

export const cancelAllSelected = (manga: Manga) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    const state = getState().chaptersList.mangasInDownloading[manga.link].chapters;
    const obj = cursors.get();
    const keys = Object.keys(getState().chaptersList.mangasInDownloading[manga.link].chapters);
    obj[manga.link].shouldDownload = false;
    cursors.set(obj);

    for (let i = keys.length - 1; i >= 0; i--) {
      const downloadManager = DownloadManager.ofWithManga(getState().mangas[manga.link].chapters[keys[i]], manga);
      switch (state[keys[i]].status) {
        case DownloadStatus.QUEUED:
          await downloadManager.unqueue();

          break;
        case DownloadStatus.START_DOWNLOADING:
        case DownloadStatus.RESUME_DOWNLOADING:
        case DownloadStatus.PAUSED:
          await downloadManager.cancel();
          break;
      }
    }
    dispatch({
      type: 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS',
      chapters: keys.map((x) => getState().mangas[manga.link].chapters[x]),
      manga,
    });

    delete obj[manga.link];
    cursors.set(obj);
  };
};

export const checkAll = (val: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_CHECK_ALL', checked: val });
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
