import {
  MangaCoverReducerActions,
  MangaCoverReducerState,
} from '@redux/reducers/mangaCoverReducer/mangaCoverReducer.interfaces';

const INITIAL_STATE: MangaCoverReducerState = {};

export default function (
  state: MangaCoverReducerState = INITIAL_STATE,
  action: MangaCoverReducerActions
): MangaCoverReducerState {
  switch (action.type) {
    case 'DELETE_CACHED_COVER':
      const newState = { ...state };
      delete newState[action.uri];
      return {
        ...newState,
      };
    case 'CACHE_URI_TO_BASE64':
      return {
        ...state,
        [action.uri]: action.base64,
      };
    case 'DELETE_ALL_CACHED_COVERS':
      return {};
    default:
      return state;
  }
}
