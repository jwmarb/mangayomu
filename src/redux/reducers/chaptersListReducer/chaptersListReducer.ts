import MangaHost from '@services/scraper/scraper.abstract';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import ExpoStorage from '@utils/ExpoStorage';
import { prev } from 'cheerio/lib/api/traversing';
import { PersistConfig } from 'redux-persist';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChaptersListReducerState, ChaptersListReducerAction, ChapterState } from './chaptersListReducer.interfaces';

const INITIAL_STATE: ChaptersListReducerState = {
  checkAll: false,
  mode: 'normal',
  chapters: {},
  mangasInDownloading: {},
};

export const chaptersListReducerConfig: PersistConfig<ChaptersListReducerState> = {
  blacklist: ['chapters', 'mode', 'checkAll'],
  key: 'chaptersList',
  storage: ExpoStorage,
};

export function getKey(c: ReadingChapterInfo) {
  return c.link;
}

export default function (
  state: ChaptersListReducerState = INITIAL_STATE,
  action: ChaptersListReducerAction
): ChaptersListReducerState {
  switch (action.type) {
    case 'EXIT_SELECTION_MODE':
      return {
        ...state,
        checkAll: false,
        mode: 'normal',
        chapters: Object.entries(state.chapters).reduce(
          (prev, [key, val]) => ({
            ...prev,
            [key]: {
              ...val,
              checked: false,
            },
          }),
          {}
        ),
      };
    case 'ENTER_SELECTION_MODE':
      return {
        ...state,
        mode: 'selection',
      };
    case 'SELECT_CHAPTERS': {
      return {
        ...state,
        checkAll: true,
        mode: 'selection',
        chapters: action.chapters.reduce((prev, curr) => {
          const key = getKey(curr);
          return {
            ...prev,
            [key]: {
              ...state.chapters[key],
              checked: true,
            },
          };
        }, state.chapters),
      };
    }
    case 'SELECT_CHAPTER': {
      const key = getKey(action.chapter);
      return {
        ...state,
        chapters: {
          ...state.chapters,
          [key]: {
            ...state.chapters[key],
            checked: action.checked,
          },
        },
      };
    }
    case 'INITIALIZE_FULLY_VALIDATED_STATUS':
      return {
        ...state,
        chapters: action.chapters.reduce((prev, curr) => {
          const key = getKey(curr);
          const downloadManager = DownloadManager.ofWithManga(curr, action.manga);
          if (downloadManager.getStatus() === DownloadStatus.VALIDATING) {
            downloadManager.setStatus(downloadManager.getValidatedStatus());
            return {
              ...prev,
              [key]: {
                ...prev[key],
                status: downloadManager.getValidatedStatus(),
              } as ChapterState,
            };
          }
          return prev;
        }, state.chapters),
      };
    case 'INITIALIZE_CHAPTER_STATES': {
      const objs: Record<string, ChapterState> = {};
      for (const curr of action.chapters) {
        const key = getKey(curr);
        const downloadManager = DownloadManager.ofWithManga(curr, action.manga);
        const INITIAL_STATE: ChapterState = {
          checked: false,
          status: downloadManager.getStatus(),
          totalProgress: downloadManager.getProgress(),
          hasCursor: downloadManager.hasCursor(),
          link: curr.link,
        };
        objs[key] = INITIAL_STATE;
      }
      return {
        ...state,
        chapters: objs,
      };
    }
    case 'SET_TOTAL_PROGRESS_OF_CHAPTER': {
      const key = getKey(action.chapter);
      return {
        ...state,
        chapters: {
          ...state.chapters,
          [key]: {
            ...state.chapters[key],
            totalProgress:
              state.chapters[key].status === DownloadStatus.START_DOWNLOADING ||
              state.chapters[key].status === DownloadStatus.RESUME_DOWNLOADING ||
              state.chapters[key].status === DownloadStatus.PAUSED
                ? action.progress
                : 0,
          },
        },
      };
    }
    case 'SET_DOWNLOAD_STATUS_OF_CHAPTER': {
      const key = getKey(action.chapter);
      const downloadManager = DownloadManager.ofWithManga(action.chapter, action.manga);
      downloadManager.setStatus(action.status);
      return {
        ...state,
        chapters: {
          ...state.chapters,
          [key]: {
            ...state.chapters[key],
            status: action.status,
            totalProgress:
              action.status === DownloadStatus.CANCELLED || action.status === DownloadStatus.IDLE
                ? 0
                : state.chapters[key].totalProgress,
          },
        },
      };
    }
    case 'VALIDATE_CHAPTER': {
      const key = getKey(action.chapter);
      const downloadManager = DownloadManager.ofWithManga(action.chapter, action.manga);
      if (downloadManager.getStatus() === DownloadStatus.VALIDATING) {
        downloadManager.setStatus(downloadManager.getValidatedStatus());
        return {
          ...state,
          chapters: {
            ...state.chapters,
            [key]: {
              ...state.chapters[key],
              status: downloadManager.getValidatedStatus(),
            },
          },
        };
      }
      return state;
    }
    case 'TOGGLE_CHECK_ALL':
      return {
        ...state,
        checkAll: action.checked,
        mode: 'selection',
        chapters: Object.entries(state.chapters).reduce(
          (prev, [key, value]) => ({
            ...prev,
            [key]: {
              ...value,
              checked: action.checked,
            },
          }),
          {}
        ),
      };

    case 'UPDATE_CHAPTER_STATUS':
      const downloadManager = DownloadManager.ofWithManga(action.chapter, action.manga);
      if (action.status) {
        downloadManager.setStatus(action.status);
        downloadManager.updateCursor();
        return {
          ...state,
          mangasInDownloading: {
            ...state.mangasInDownloading,
            [action.manga.link]: {
              ...state.mangasInDownloading[action.manga.link],
            },
          },
          chapters: {
            ...state.chapters,
            [action.key]: {
              ...state.chapters[action.key],
              totalProgress:
                action.status === DownloadStatus.CANCELLED || action.status === DownloadStatus.IDLE
                  ? 0
                  : state.chapters[action.key].totalProgress,
              hasCursor: downloadManager.hasCursor(),
              status: action.status,
            },
          },
        };
      }
      return {
        ...state,
        chapters: {
          ...state.chapters,
          [action.key]: {
            ...state.chapters[action.key],
            status: downloadManager.getStatus(),
          },
        },
      };

    case 'RESUME_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      const copy = state.chapters;
      for (const chapter of action.chapters) {
        const key = getKey(chapter);
        if (copy[key].status === DownloadStatus.PAUSED && Number.isNaN(copy[key].totalProgress)) {
          DownloadManager.ofWithManga(chapter, action.manga).setStatus(DownloadStatus.QUEUED);
          copy[key].status = DownloadStatus.QUEUED;
        }
      }

      return {
        ...state,
        chapters: copy,
      };
    }
    case 'CURSOR_FINISH_DOWNLOADING':
      const newState: ChaptersListReducerState = { ...state };
      delete newState.mangasInDownloading[action.manga.link];
      return newState;
    case 'QUEUE_ALL_SELECTED': {
      const chapters = action.chapters.reduce((prev, curr) => {
        const key = getKey(curr);
        switch (state.chapters[key].status) {
          case DownloadStatus.IDLE:
          case DownloadStatus.CANCELLED:
          case DownloadStatus.VALIDATING:
            return {
              ...prev,
              [key]: { ...state.chapters[key], status: DownloadManager.ofWithManga(curr, action.manga).getStatus() },
            };
          default:
            return prev;
        }
      }, state.chapters);

      return {
        ...state,
        mangasInDownloading: {
          ...state.mangasInDownloading,
          [action.manga.link]: {
            chapters: state.mangasInDownloading[action.manga.link]?.chapters ?? chapters,
            numDownloadCompleted: state.mangasInDownloading[action.manga.link]?.numDownloadCompleted ?? 0,
            numToDownload: state.mangasInDownloading[action.manga.link]?.numToDownload ?? action.chapters.length,
          },
        },
        chapters,
      };
    }
    case 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      const copy = state.chapters;
      for (let i = 0; i < action.chapters.length; i++) {
        switch (copy[getKey(action.chapters[i])].status) {
          case DownloadStatus.START_DOWNLOADING:
          case DownloadStatus.RESUME_DOWNLOADING:
            DownloadManager.ofWithManga(action.chapters[i], action.manga).setStatus(DownloadStatus.PAUSED);
            copy[getKey(action.chapters[i])].status = DownloadStatus.PAUSED;
        }
      }
      return { ...state, chapters: copy };
    }
    case 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      const newState = { ...state };
      delete newState.mangasInDownloading[action.manga.link];
      return {
        ...newState,
        chapters: action.chapters.reduce((prev, curr) => {
          const key = getKey(curr);
          return {
            ...prev,
            [key]: {
              ...state.chapters[key],
              status:
                state.chapters[key].status === DownloadStatus.QUEUED
                  ? DownloadManager.ofWithManga(curr, action.manga).getValidatedStatus()
                  : state.chapters[key].status === DownloadStatus.RESUME_DOWNLOADING ||
                    state.chapters[key].status === DownloadStatus.START_DOWNLOADING ||
                    state.chapters[key].status === DownloadStatus.PAUSED
                  ? DownloadStatus.CANCELLED
                  : state.chapters[key].status,
              totalProgress: 0,
              hasCursor: false,
            },
          };
        }, state.chapters as Record<string, ChapterState>),
      };
    }
    case 'CURSOR_DOWNLOADING_ITEM':
      return {
        ...state,
        mangasInDownloading: {
          ...state.mangasInDownloading,
          [action.manga.link]: {
            ...state.mangasInDownloading[action.manga.link],
            cursorPosition: state.mangasInDownloading[action.manga.link].chapters[action.key],
          },
        },
      };
    case 'CHAPTER_DOWNLOADED':
      return {
        ...state,
        mangasInDownloading: {
          ...state.mangasInDownloading,
          [action.manga.link]: {
            ...state.mangasInDownloading[action.manga.link],
            numDownloadCompleted: state.mangasInDownloading[action.manga.link].numDownloadCompleted + 1,
          },
        },
      };

    default:
      return state;
  }
}
