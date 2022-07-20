import {
  MangaLibReducerAction,
  MangaLibReducerState,
} from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { StringComparator } from '@utils/Algorithms';

const INITIAL_STATE: MangaLibReducerState = {
  search: '',
  mangas: {},
};

export default function (
  state: MangaLibReducerState = INITIAL_STATE,
  action: MangaLibReducerAction
): MangaLibReducerState {
  switch (action.type) {
    case 'REHYDRATE':
      return {
        ...state,
      };
    case 'SET_SEARCH_QUERY_IN_LIBRARY':
      return {
        ...state,
        search: action.query,
      };

    case 'ADD_TO_LIBRARY':
      state.mangas[action.payload.link] = null;
      return state;
    case 'REMOVE_FROM_LIBRARY': {
      delete state.mangas[action.payload.link];
      return state;
    }
    default:
      return state;
  }
}
