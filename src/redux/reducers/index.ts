import mangalibReducer from './mangalibReducer';
import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';
import chaptersListReducer from './chaptersListReducer';
import settingsReducer from './settingsReducer';
import mangaDownloadingReducer from '@redux/reducers/mangaDownloadingReducer';
import mangaCoverReducer from '@redux/reducers/mangaCoverReducer';
import readerReducer from '@redux/reducers/readerReducer';
import readerSettingProfileReducer from '@redux/reducers/readerSettingProfileReducer';
import mangaHistoryReducer from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
  settings: settingsReducer,
  library: mangalibReducer,
  chaptersList: chaptersListReducer,
  downloading: mangaDownloadingReducer,
  cachedCovers: mangaCoverReducer,
  reader: readerReducer,
  readerSetting: readerSettingProfileReducer,
  history: mangaHistoryReducer,
});

export default reducers;
