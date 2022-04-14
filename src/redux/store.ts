import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
const persistConfig: PersistConfig<AppState> = {
  key: '@root',
  storage: AsyncStorage,
};

const store = createStore(persistReducer<AppState>(persistConfig, reducers), {}, applyMiddleware(thunk));

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof reducers>;
export type UseSelector = typeof useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);
