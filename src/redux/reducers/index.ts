import { combineReducers } from 'redux';
import mangaReducer from './mangaReducer';

const reducers = combineReducers({
  mangas: mangaReducer,
});

export default reducers;
