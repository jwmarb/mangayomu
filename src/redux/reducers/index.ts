import mangalibReducer from './mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import chaptersListReducer from './chaptersListReducer';
import settingsReducer from './settingsReducer';
import { chaptersListReducerConfig } from '@redux/reducers/chaptersListReducer/chaptersListReducer';
import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
  chaptersList: persistReducer(chaptersListReducerConfig, chaptersListReducer),
});

export default reducers;
