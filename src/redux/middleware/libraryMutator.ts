import { addToLibrary, removeFromLibrary } from '@redux/reducers/mangalibReducer/mangalibReducer.actions';
import { AppActions, AppDispatch, AppState } from '@redux/store';
import { applyMiddleware, Middleware } from 'redux';

const libraryMutator: Middleware<any> =
  ({ getState }: { getState: () => AppState }) =>
  (dispatch) =>
  (action: AppActions) => {
    dispatch(action);

    switch (action.type) {
      case 'ADD_TO_LIBRARY':
        addToLibrary(action.payload)(dispatch);
      case 'REMOVE_FROM_LIBRARY':
        removeFromLibrary(action.payload)(dispatch);
    }
  };

export default libraryMutator;
