import { addToLibrary, removeFromLibrary } from '@redux/reducers/mangalibReducer/mangalibReducer.actions';
import { AppActions, AppState } from '@redux/store';
import { Middleware } from 'redux';
import displayMessage from '../../utils/displayMessage';

const libraryMutator: Middleware<any> =
  ({ getState }: { getState: () => AppState }) =>
  (dispatch) =>
  (action: AppActions) => {
    dispatch(action);

    switch (action.type) {
      case 'TOGGLE_LIBRARY':
        if (getState().mangas[action.payload.link].inLibrary) {
          addToLibrary(action.payload)(dispatch);
          displayMessage('Added to library');
        } else {
          removeFromLibrary(action.payload)(dispatch);
          displayMessage('Removed from library');
        }
        break;
    }
  };

export default libraryMutator;
