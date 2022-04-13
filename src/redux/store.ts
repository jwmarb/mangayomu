import { createStore, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';

const store = createStore(reducers, {}, applyMiddleware(thunk));

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export type UseSelector = typeof useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
