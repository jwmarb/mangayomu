import mangalibReducer from './mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import chaptersListReducer from './chaptersListReducer';
import settingsReducer from './settingsReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
  chaptersList: chaptersListReducer,
});

export default reducers;
