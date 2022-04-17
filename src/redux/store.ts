import { createStore, applyMiddleware, Dispatch, AnyAction } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import libraryMutator from '@redux/middleware/libraryMutator';
const persistConfig: PersistConfig<AppState> = {
  key: '@root',
  storage: AsyncStorage,
};

const persistReducers = persistReducer(persistConfig, reducers);

const store = createStore(persistReducers, {}, applyMiddleware(thunk, libraryMutator));

export default store;

export type AppDispatch = Dispatch<AppActions>;
export type AppState = ReturnType<typeof reducers>;
export type UseSelector = typeof useSelector;
export type AppActions = Parameters<typeof reducers>[1];

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);
