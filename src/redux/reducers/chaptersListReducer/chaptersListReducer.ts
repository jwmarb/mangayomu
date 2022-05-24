import { ChaptersListReducerState, ChaptersListReducerAction } from './chaptersListReducer.interfaces';

const INITIAL_STATE: ChaptersListReducerState = {
  checkAll: null,
  mode: 'normal',
};

export default function (
  state: ChaptersListReducerState = INITIAL_STATE,
  action: ChaptersListReducerAction
): ChaptersListReducerState {
  switch (action.type) {
    case 'SELECT':
      return {
        ...state,
        checkAll: action.checked,
        mode: 'selection',
      };
    case 'EXIT_SELECTION_MODE':
      return {
        ...state,
        checkAll: null,
        mode: 'normal',
      };
    case 'ENTER_SELECTION_MODE':
      return {
        ...state,
        checkAll: null,
        mode: 'selection',
      };
    default:
      return state;
  }
}
