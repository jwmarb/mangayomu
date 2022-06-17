import MangaHost from '@services/scraper/scraper.abstract';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { prev } from 'cheerio/lib/api/traversing';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChaptersListReducerState, ChaptersListReducerAction, ChapterState } from './chaptersListReducer.interfaces';

const INITIAL_STATE: ChaptersListReducerState = {
  checkAll: false,
  mode: 'normal',
  chapters: {},
  validatedMangas: {},
};

export function getKey(c: ReadingChapterInfo) {
  return c.name ?? `Chapter ${c.index + 1}`;
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
    case 'INITIALIZE_CHAPTER_STATES': {
      const objs: Record<string, ChapterState> = action.chapters.reduce((prev, curr) => {
        const key = getKey(curr);
        const downloadManager = DownloadManager.of(
          curr,
          DownloadManager.generatePath(curr, action.manga),
          MangaHost.getAvailableSources().get(action.manga.source)!
        );
        const INITIAL_STATE: ChapterState = {
          checked: state.chapters[key]?.checked ?? false,
          downloadManager,
          status: downloadManager.getStatus(),
          totalProgress: downloadManager.getProgress(),
          hasCursor: downloadManager.hasCursor() ?? false,
        };
        return {
          ...prev,
          [key]: INITIAL_STATE,
        };
      }, {});

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
      const downloadManager = state.chapters[key].downloadManager;
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
      if (state.chapters[key].downloadManager.getStatus() === DownloadStatus.VALIDATING) {
        state.chapters[key].downloadManager.setStatus(state.chapters[key].downloadManager.getValidatedStatus());
        return {
          ...state,
          chapters: {
            ...state.chapters,
            [key]: {
              ...state.chapters[key],
              status: state.chapters[key].downloadManager.getValidatedStatus(),
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
    case 'ADD_VALIDATED_MANGA':
      return {
        ...state,
        validatedMangas: {
          ...state.validatedMangas,
          [action.manga.link]: null,
        },
      };
    case 'UPDATE_CHAPTER_STATUS':
      const chapterState = state.chapters[action.key];
      if (action.status) {
        chapterState.downloadManager.setStatus(action.status);
        chapterState.downloadManager.updateCursor();
        return {
          ...state,
          chapters: {
            ...state.chapters,
            [action.key]: {
              ...state.chapters[action.key],
              totalProgress:
                action.status === DownloadStatus.CANCELLED || action.status === DownloadStatus.IDLE
                  ? 0
                  : state.chapters[action.key].totalProgress,
              hasCursor: chapterState.downloadManager.hasCursor(),
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
            status: chapterState.downloadManager.getStatus(),
          },
        },
      };

    case 'RESUME_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      const copy = state.chapters;
      for (let i = 0; i < action.keys.length; i++) {
        if (copy[action.keys[i]].status === DownloadStatus.PAUSED && Number.isNaN(copy[action.keys[i]].totalProgress)) {
          copy[action.keys[i]].downloadManager.setStatus(DownloadStatus.QUEUED);
          copy[action.keys[i]].status = DownloadStatus.QUEUED;
        }
      }

      return {
        ...state,
        chapters: copy,
      };
    }
    case 'QUEUE_ALL_SELECTED': {
      const copy = state.chapters;
      for (let i = 0; i < action.keys.length; i++) {
        switch (copy[action.keys[i]].status) {
          case DownloadStatus.IDLE:
          case DownloadStatus.CANCELLED:
          case DownloadStatus.VALIDATING:
            copy[action.keys[i]].status = copy[action.keys[i]].downloadManager.getStatus();
        }
      }

      return {
        ...state,
        chapters: copy,
      };
    }
    case 'PAUSE_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      const copy = state.chapters;
      for (let i = 0; i < action.keys.length; i++) {
        switch (copy[action.keys[i]].status) {
          case DownloadStatus.START_DOWNLOADING:
          case DownloadStatus.RESUME_DOWNLOADING:
            copy[action.keys[i]].downloadManager.setStatus(DownloadStatus.PAUSED);
            copy[action.keys[i]].status = DownloadStatus.PAUSED;
        }
      }
      return { ...state, chapters: copy };
    }
    case 'CANCEL_DOWNLOAD_OF_SELECTED_CHAPTERS': {
      // const copy = state.chapters;
      // for (let i = action.keys.length - 1; i >= 0; i--) {
      //   switch (copy[action.keys[i]].status) {
      //     case DownloadStatus.QUEUED:
      //       copy[action.keys[i]].status = copy[action.keys[i]].downloadManager.getValidatedStatus();
      //       console.log(`Removed ${action.keys[i]} from queue which has status ${copy[action.keys[i]].status}`);
      //       copy[action.keys[i]].totalProgress = 0;
      //       copy[action.keys[i]].hasCursor = false;
      //       break;
      //     case DownloadStatus.START_DOWNLOADING:
      //     case DownloadStatus.RESUME_DOWNLOADING:
      //     case DownloadStatus.PAUSED:
      //       console.log(`Cancelled ${action.keys[i]}`);
      //       copy[action.keys[i]].status = DownloadStatus.CANCELLED;
      //       copy[action.keys[i]].totalProgress = 0;
      //       copy[action.keys[i]].hasCursor = false;
      //       break;
      //   }
      // }
      return {
        ...state,
        chapters: action.keys.reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: {
              ...state.chapters[curr],
              status:
                state.chapters[curr].status === DownloadStatus.QUEUED
                  ? state.chapters[curr].downloadManager.getValidatedStatus()
                  : state.chapters[curr].status === DownloadStatus.RESUME_DOWNLOADING ||
                    state.chapters[curr].status === DownloadStatus.START_DOWNLOADING ||
                    state.chapters[curr].status === DownloadStatus.PAUSED
                  ? DownloadStatus.CANCELLED
                  : state.chapters[curr].status,
              totalProgress: 0,
              hasCursor: false,
            },
          }),
          state.chapters as Record<string, ChapterState>
        ),
      };
    }

    default:
      return state;
  }
}
