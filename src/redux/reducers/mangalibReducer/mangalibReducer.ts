import {
  MangaLibReducerAction,
  MangaLibReducerState,
} from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';

const INITIAL_STATE: MangaLibReducerState = {
  search: '',
  appliedFilters: {},
  mangaKeys: [],
};

export default function (
  state: MangaLibReducerState = INITIAL_STATE,
  action: MangaLibReducerAction
): MangaLibReducerState {
  switch (action.type) {
    case 'ADD_TO_LIBRARY': {
      const oldState = state;
      oldState.mangaKeys.push(action.payload);
      return {
        ...oldState,
      };
    }
    case 'REMOVE_FROM_LIBRARY': {
      const oldState = state;
      oldState.mangaKeys.splice(oldState.mangaKeys.indexOf(action.payload));
      return {
        ...oldState,
      };
    }
    default:
      return state;
  }
}
