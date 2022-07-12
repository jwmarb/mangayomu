import mangalibReducer from './mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import chaptersListReducer from './chaptersListReducer';
import settingsReducer from './settingsReducer';
import mangaDownloadingReducer from '@redux/reducers/mangaDownloadingReducer';
import mangaCoverReducer from '@redux/reducers/mangaCoverReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
  chaptersList: chaptersListReducer,
  downloading: mangaDownloadingReducer,
  cachedCovers: mangaCoverReducer,
});

export default reducers;
