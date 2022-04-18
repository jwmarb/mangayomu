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
    case 'ADD_TO_LIBRARY': {
      const oldState = state;
      oldState.mangas.push(action.payload);
      return {
        ...oldState,
      };
    }
    case 'REMOVE_FROM_LIBRARY': {
      const oldState = state;
      oldState.mangas.splice(oldState.mangas.indexOf(action.payload));
      console.log(action.type);
      return {
        ...oldState,
      };
    }
    default:
      return state;
  }
}
