import ExpoStorage from '@utils/ExpoStorage';
// import ExpoStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

export { default } from './mangalibReducer';
// import reducer from './mangalibReducer';
// export default persistReducer(
//   {
//     storage: ExpoStorage,
//     key: 'manga_library',
//     blacklist: ['search'],
//   },
//   reducer
// );
