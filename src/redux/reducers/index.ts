import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import settingsReducer from './settingsReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
});

export default reducers;
