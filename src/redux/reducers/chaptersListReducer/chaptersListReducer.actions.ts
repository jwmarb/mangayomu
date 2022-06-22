import { AppDispatch, AppState } from '@redux/store';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChapterState } from './chaptersListReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import { DownloadStatus } from '@utils/DownloadManager';
import { getKey } from './chaptersListReducer';
import pLimit from 'p-limit';
import StorageManager from '@utils/StorageManager';

type StateGetter = () => AppState;

const limit = pLimit(1);
export const cursors: StorageManager<
  Record<
    string,
    {
      shouldDownload: boolean;
      chapters: Record<string, ChapterState>;
    }
  >
> = StorageManager.manage('@downloadCursors');

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
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    dispatch({ type: 'INITIALIZE_CHAPTER_STATES', chapters, manga });
    if (chapters.length > 0)
      for (const x of chapters) {
        try {
          await getState().chaptersList.chapters[getKey(x)].downloadManager.validate();
        } finally {
          dispatch({ type: 'VALIDATE_CHAPTER', chapter: x });
        }
      }
  };
};

export const downloadAllSelected = (selected: Record<string, ChapterState>, manga: Manga) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const keys = Object.keys(selected);
    const obj = (await cursors.get()) ?? {};
    obj[manga.link] = {
      shouldDownload: true,
      chapters: selected,
    };
    cursors.set(obj);
    try {
      for (const key of keys) {
        await getState().chaptersList.chapters[key].downloadManager.queue();
      }
    } finally {
      dispatch({ type: 'QUEUE_ALL_SELECTED', keys, manga });
    }

    await Promise.all(
      keys.map((key) =>
        limit(async () => {
          if (((await cursors.get()) ?? {})[manga.link]?.shouldDownload) {
            switch (getState().chaptersList.chapters[key].status) {
              case DownloadStatus.QUEUED:
                dispatch({ type: 'UPDATE_CHAPTER_STATUS', key, status: DownloadStatus.START_DOWNLOADING });
                await getState().chaptersList.chapters[key].downloadManager.download();
                break;
              case DownloadStatus.PAUSED:
                dispatch({ type: 'UPDATE_CHAPTER_STATUS', key, status: DownloadStatus.RESUME_DOWNLOADING });

                await getState().chaptersList.chapters[key].downloadManager.resume();
                break;
            }
          }
        })
      )
    );

    if (
      obj[manga.link] &&
      Object.keys(obj[manga.link].chapters).every(
        (x) => getState().chaptersList.chapters[x].downloadManager.getStatus() === DownloadStatus.DOWNLOADED
      )
    ) {
      delete obj[manga.link];
      cursors.set(obj);
    }
  };
};

export const pauseAllSelected = (manga: Manga) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    const state = getState().chaptersList.chapters;
    const obj = (await cursors.get()) ?? {};
    const keys = Object.keys(obj[manga.link].chapters);
    obj[manga.link].shouldDownload = false;
    cursors.set(obj);

    for (let i = keys.length - 1; i >= 0; i--) {
      if (
        state[keys[i]].status === DownloadStatus.START_DOWNLOADING ||
        state[keys[i]].status === DownloadStatus.RESUME_DOWNLOADING
      )
        await state[keys[i]].downloadManager.pause();
    }
    dispatch({ type: 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS', keys });
  };
};

export const cancelAllSelected = (manga: Manga) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    const state = getState().chaptersList.chapters;
    const obj = (await cursors.get()) ?? {};
    const keys = Object.keys(obj[manga.link].chapters);
    obj[manga.link].shouldDownload = false;
    cursors.set(obj);

    for (let i = keys.length - 1; i >= 0; i--) {
      switch (state[keys[i]].status) {
        case DownloadStatus.QUEUED:
          await state[keys[i]].downloadManager.unqueue();

          break;
        case DownloadStatus.START_DOWNLOADING:
        case DownloadStatus.RESUME_DOWNLOADING:
        case DownloadStatus.PAUSED:
          await state[keys[i]].downloadManager.cancel();
          break;
      }
    }
    dispatch({ type: 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS', keys, manga });

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

export const setDownloadStatusOfChapter = (chapter: ReadingChapterInfo) => {
  return (dispatch: AppDispatch) => {
    return (status: DownloadStatus) => {
      dispatch({ type: 'SET_DOWNLOAD_STATUS_OF_CHAPTER', chapter, status });
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
