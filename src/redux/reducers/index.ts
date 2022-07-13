import mangalibReducer from './mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import chaptersListReducer from './chaptersListReducer';
import settingsReducer from './settingsReducer';
import mangaDownloadingReducer from '@redux/reducers/mangaDownloadingReducer';
import mangaCoverReducer from '@redux/reducers/mangaCoverReducer';
import readerReducer from '@redux/reducers/readerReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
  chaptersList: chaptersListReducer,
  downloading: mangaDownloadingReducer,
  cachedCovers: mangaCoverReducer,
  reader: readerReducer,
});

export default reducers;
