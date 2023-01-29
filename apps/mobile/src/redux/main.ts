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

const reducers = combineReducers({
  __initial__: __initialReducer__,
  host: hostReducer,
  mainSourceSelector: MainSourceSelectorReducer,
});

const persistConfig: PersistConfig<AppState> = {
  key: 'root',
  storage: reduxStorage,
};

const persisted = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;
