import { ReaderReducerAction, ReaderReducerState } from '@redux/reducers/readerReducer/readerReducer.interfaces';

const INITIAL_STATE: ReaderReducerState = {
  scrollPosition: 0,
  showOverlay: false,
};

export default function (state: ReaderReducerState = INITIAL_STATE, action: ReaderReducerAction): ReaderReducerState {
  switch (action.type) {
    case 'SCROLL_POSITION':
      return {
        ...state,
        scrollPosition: action.scrollPosition,
      };
    default:
      return state;
  }
}
