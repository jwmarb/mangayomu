import MangaHost from '@services/scraper/scraper.abstract';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChaptersListReducerState, ChaptersListReducerAction, ChapterState } from './chaptersListReducer.interfaces';

const INITIAL_STATE: ChaptersListReducerState = {
  mode: 'normal',
  chapters: {},
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
        mode: 'normal',
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
        const downloadManager = DownloadManager.of(
          curr,
          DownloadManager.generatePath(curr, action.manga),
          MangaHost.getAvailableSources().get(action.manga.source)!
        );
        const INITIAL_STATE: ChapterState = {
          checked: false,
          downloadManager,
          status: DownloadStatus.VALIDATING,
        };
        return {
          ...prev,
          [getKey(curr)]: INITIAL_STATE,
        };
      }, {});

      return {
        ...state,
        chapters: objs,
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
          },
        },
      };
    }
    default:
      return state;
  }
}
