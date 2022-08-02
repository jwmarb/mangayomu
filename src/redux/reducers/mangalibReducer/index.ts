import ExpoStorage from '@utils/ExpoStorage';
import { persistReducer } from 'redux-persist';

import reducer from './mangalibReducer';
export default persistReducer(
  {
    storage: ExpoStorage,
    key: 'manga_library',
    blacklist: ['search'],
  },
  reducer
);
