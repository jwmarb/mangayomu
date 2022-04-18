import {
  MangaLibReducerAction,
  MangaLibReducerState,
} from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';

const INITIAL_STATE: MangaLibReducerState = {
  search: '',
  appliedFilters: {},
  mangas: [],
};

export default function (
  state: MangaLibReducerState = INITIAL_STATE,
  action: MangaLibReducerAction
): MangaLibReducerState {
  switch (action.type) {
    case 'ADD_TO_LIBRARY':
      return {
        ...state,
        mangas: [...state.mangas, { manga: action.payload, dateAdded: new Date().toString() }],
      };
    case 'REMOVE_FROM_LIBRARY': {
      return {
        ...state,
        mangas: state.mangas.filter((manga) => manga.manga.link !== action.payload.link),
      };
    }
    default:
      return state;
  }
}
