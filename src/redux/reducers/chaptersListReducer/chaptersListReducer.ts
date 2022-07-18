import { ReadingChapterInfo } from '../mangaReducer/mangaReducer.interfaces';
import { ChaptersListReducerState, ChaptersListReducerAction } from './chaptersListReducer.interfaces';

const INITIAL_STATE: ChaptersListReducerState = {
  checkAll: false,
  totalChapters: 0,
  numOfSelected: 0,
  hideFloatingModal: false,
  mode: 'normal',
  selected: {},
};

export function getKey(c: ReadingChapterInfo) {
  return c.link;
}

export default function (
  state: ChaptersListReducerState = INITIAL_STATE,
  action: ChaptersListReducerAction
): ChaptersListReducerState {
  switch (action.type) {
    case 'SHOULD_HIDE_FLOATING_MODAL':
      return {
        ...state,
        hideFloatingModal: action.payload,
      };
    case 'EXIT_SELECTION_MODE':
      return {
        ...state,
        checkAll: false,
        hideFloatingModal: false,
        mode: 'normal',
        selected: {},
        numOfSelected: 0,
      };
    case 'ENTER_SELECTION_MODE':
      return {
        ...state,
        mode: 'selection',
      };
    case 'SELECT_CHAPTERS': {
      const newState: ChaptersListReducerState = { ...state, mode: 'selection' };
      for (const chapter of action.chapters) {
        newState.selected[getKey(chapter)] = null;
      }
      newState.numOfSelected = Object.keys(newState.selected).length;
      newState.checkAll = newState.numOfSelected === newState.totalChapters;
      return newState;
    }
    case 'SELECT_CHAPTER': {
      const key = getKey(action.chapter);
      const newState: ChaptersListReducerState = { ...state, mode: 'selection' };
      if (action.checked) {
        newState.selected[key] = null;
        newState.numOfSelected++;
      } else {
        delete newState.selected[key];
        newState.numOfSelected--;
      }
      newState.checkAll = newState.numOfSelected === newState.totalChapters;

      return newState;
    }
    case 'INITIALIZE_STATE':
      return {
        ...state,
        numOfSelected: 0,
        totalChapters: action.totalChapters,
      };

    case 'TOGGLE_CHECK_ALL':
      if (action.checked) {
        const newState: ChaptersListReducerState = { ...state, checkAll: true, mode: 'selection' };
        for (const key of action.chapters) {
          newState.selected[getKey(key)] = null;
        }
        newState.numOfSelected = action.chapters.length;
        return newState;
      }

      return {
        ...state,
        numOfSelected: 0,
        checkAll: false,
        mode: 'selection',
        selected: {},
      };

    default:
      return state;
  }
}
