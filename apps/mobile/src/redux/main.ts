import { configureStore } from '@reduxjs/toolkit';
import { __initialReducer__ } from '@redux/slices/__initial__';

const store = configureStore({
  reducer: {
    __initial__: __initialReducer__,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
