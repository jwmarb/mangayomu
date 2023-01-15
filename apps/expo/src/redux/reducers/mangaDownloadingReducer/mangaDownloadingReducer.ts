import {
  MangaDownloadingReducerAction,
  MangaDownloadingReducerState,
} from '@redux/reducers/mangaDownloadingReducer/mangaDownloadingReducer.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';

const INITIAL_STATE: MangaDownloadingReducerState = {
  mangas: {},
  metas: {},
  downloadingKeys: {},
};

export default function (
  state: MangaDownloadingReducerState = INITIAL_STATE,
  action: MangaDownloadingReducerAction
): MangaDownloadingReducerState {
  switch (action.type) {
    case 'DELETE_DOWNLOADING_KEY':
      const newState = { ...state, downloadingKeys: { ...state.downloadingKeys } };
      delete state.downloadingKeys[action.mangaKey];
      return newState;
    case 'SET_DOWNLOADING_KEY':
      return {
        ...state,
        downloadingKeys: {
          ...state.downloadingKeys,
          [action.mangaKey]: action.key,
        },
      };
    case 'RERUN_DOWNLOADS':
      return {
        ...state,
        mangas: {
          ...state.mangas,
        },
      };
    case 'CANCEL_DOWNLOAD': {
      const newState: MangaDownloadingReducerState = {
        ...state,
        metas: { ...state.metas },
        mangas: {
          ...state.mangas,
        },
      };
      if (action.mangaKey in newState.mangas) {
        delete newState.mangas[action.mangaKey]!.chapters[action.chapterKey];
        delete newState.metas[action.mangaKey]![action.chapterKey];
        const chapterKeys = Object.keys(newState.mangas[action.mangaKey]!.chapters);
        newState.mangas[action.mangaKey]!.chaptersToDownload = chapterKeys;
        if (chapterKeys.length === 0) {
          delete newState.mangas[action.mangaKey];
          delete newState.metas[action.mangaKey];
        }
      }

      return newState;
    }

    case 'CANCEL_ALL_FOR_SERIES': {
      const newState: MangaDownloadingReducerState = {
        ...state,
        metas: { ...state.metas },
        mangas: { ...state.mangas },
      };

      delete newState.mangas[action.mangaKey];
      delete newState.metas[action.mangaKey];

      return newState;
    }
    case 'CHAPTER_DOWNLOAD_LISTENER': {
      // const newState: MangaDownloadingReducerState = {
      //   ...state,
      //   metas: { ...state.metas },
      // };
      // newState.metas[action.mangaKey]![action.chapterKey] = {
      //   totalPages: action.downloadManager.getTotalPages(),
      //   totalProgress: isNaN(action.downloadManager.getProgress()) ? 0 : action.downloadManager.getProgress() * 100,
      //   downloadedPages: action.downloadManager.getDownloadedPages(),
      // };
      return {
        ...state,
        metas: {
          ...state.metas,
          [action.mangaKey]: {
            ...state.metas[action.mangaKey],
            [action.chapterKey]: {
              totalPages: action.downloadManager.getTotalPages(),
              totalProgress: isNaN(action.downloadManager.getProgress())
                ? 0
                : action.downloadManager.getProgress() * 100,
              downloadedPages: action.downloadManager.getDownloadedPages(),
            },
          },
        },
      };
    }
    case 'CHAPTER_DOWNLOAD_COMPLETE': {
      const newState: MangaDownloadingReducerState = {
        ...state,
        metas: { ...state.metas },
        mangas: { ...state.mangas },
      };
      delete newState.mangas[action.mangaKey]?.chapters[action.chapterKey];
      delete newState.metas[action.mangaKey]![action.chapterKey];
      newState.mangas[action.mangaKey]!.chaptersToDownload = Object.keys(
        newState.mangas[action.mangaKey]?.chapters ?? {}
      );
      if (newState.mangas[action.mangaKey]!.chaptersToDownload.length === 0) {
        delete newState.mangas[action.mangaKey];
        delete newState.metas[action.mangaKey];
      }
      return newState;
    }
    case 'APPEND_TO_DOWNLOAD_REDUCER': {
      const newState: MangaDownloadingReducerState = {
        ...state,
        metas: { ...state.metas },
        mangas: { ...state.mangas },
      };
      newState.mangas[action.manga.link] = {
        chapters: newState.mangas[action.manga.link]?.chapters ?? {},
        chaptersToDownload: newState.mangas[action.manga.link]?.chaptersToDownload ?? [],
      };
      newState.metas[action.manga.link] = { ...newState.metas[action.manga.link] } ?? {};
      for (const key in action.selected) {
        if (
          key in newState.mangas[action.manga.link]!.chapters === false &&
          DownloadManager.ofWithManga(action.chapters[key], action.manga).getValidatedStatus() === DownloadStatus.IDLE
        ) {
          newState.mangas[action.manga.link]!.chapters[key] = null;
          newState.metas[action.manga.link]![key] = { totalPages: 0, totalProgress: 0, downloadedPages: 0 };
        }
      }
      newState.mangas[action.manga.link]!.chaptersToDownload = Object.keys(
        newState.mangas[action.manga.link]!.chapters
      );

      if (newState.mangas[action.manga.link]!.chaptersToDownload.length === 0) {
        delete newState.mangas[action.manga.link];
        delete newState.metas[action.manga.link];
      }

      return newState;
    }
    default:
      return state;
  }
}
