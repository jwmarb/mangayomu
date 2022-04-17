import mangalibReducer from '@redux/reducers/mangalibReducer/mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import settingsReducer from './settingsReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
});

export default reducers;
