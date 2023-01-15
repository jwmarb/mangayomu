import {
  MangaLibReducerAction,
  MangaLibReducerState,
} from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { StringComparator } from '@utils/Algorithms';
import SortedList from '@utils/SortedList';

const INITIAL_STATE: MangaLibReducerState = {
  search: '',
  mangas: {},
  mangasList: new SortedList(StringComparator),
  sort: 'Alphabetical',
  reversed: false,
};

export default function (
  state: MangaLibReducerState = INITIAL_STATE,
  action: MangaLibReducerAction
): MangaLibReducerState {
  switch (action.type) {
    case 'RESTORE_LIBRARY_FROM_ARRAY': {
      const newState = { ...state };
      for (const key of action.library) {
        newState.mangas[key] = null;
      }
      newState.mangasList = new SortedList(StringComparator, action.library);
      return newState;
    }
    case 'TOGGLE_REVERSE_SORT':
      return {
        ...state,
        reversed: !state.reversed,
      };
    case 'SET_SORT_METHOD':
      return {
        ...state,
        sort: action.sort,
      };
    case 'SET_SEARCH_QUERY_IN_LIBRARY':
      return {
        ...state,
        search: action.query,
      };

    case 'ADD_TO_LIBRARY': {
      const newState: MangaLibReducerState = {
        ...state,
        mangas: {
          ...state.mangas,
          [action.payload.link]: null,
        },
        mangasList: new SortedList(StringComparator, state.mangasList.toArray(), true),
      };
      newState.mangasList.add(action.payload.link);
      return newState;
    }
    case 'REMOVE_FROM_LIBRARY': {
      const newState = {
        ...state,
        mangas: { ...state.mangas },
        mangasList: new SortedList(StringComparator, state.mangasList.toArray(), true),
      };
      delete newState.mangas[action.payload.link];
      newState.mangasList.remove(action.payload.link);
      return newState;
    }
    default:
      return state;
  }
}
