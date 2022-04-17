import { MangaReducerAction, MangaReducerState } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

const INITIAL_STATE: MangaReducerState = {};

const reducer = (state: MangaReducerState = INITIAL_STATE, action: MangaReducerAction): MangaReducerState => {
  switch (action.type) {
    case 'VIEW_MANGA':
      return {
        ...state,
        [action.payload.title]: {
          ...action.payload,
          inLibrary: false,
          currentlyReadingChapter: null,
        },
      };
    case 'TOGGLE_LIBRARY':
      return {
        ...state,
        [action.payload.title]: {
          ...state[action.payload.title],
          inLibrary: !state[action.payload.title].inLibrary,
        },
      };
    default:
      return state;
  }
};

export default reducer;
