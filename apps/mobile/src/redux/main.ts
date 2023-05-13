import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { __initialReducer__ } from '@redux/slices/__initial__';
import { hostReducer } from '@redux/slices/host';
import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reduxStorage } from '@mmkv-storage/main';
import { MainSourceSelectorReducer } from '@redux/slices/mainSourceSelector';
import { ExplorerReducer } from '@redux/slices/explore';
import { LibraryReducer } from '@redux/slices/library';
import { BrowseReducer } from '@redux/slices/browse';
import { SettingsReducer } from '@redux/slices/settings';
import { ReaderReducer } from '@redux/slices/reader';
import { useDispatch } from 'react-redux';

const reducers = combineReducers({
  __initial__: __initialReducer__,
  host: hostReducer,
  mainSourceSelector: MainSourceSelectorReducer,
  explore: ExplorerReducer,
  library: LibraryReducer,
  browse: BrowseReducer,
  settings: SettingsReducer,
  reader: ReaderReducer,
});

const persistConfig: PersistConfig<AppState> = {
  key: 'root',
  storage: reduxStorage,
  blacklist: ['explore', 'browse', 'reader'],
};

const persisted = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'reader/fetchPagesByChapter/fulfilled',
          'reader/fetchPagesByChapter/rejected',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
