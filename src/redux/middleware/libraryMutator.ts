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
        if (action.payload.link in getState().library.mangas === false) {
          addToLibrary(action.payload)(dispatch);
          displayMessage('Added to library');
          console.log(`Added ${action.payload.link} to library`);
        } else {
          removeFromLibrary(action.payload)(dispatch);
          console.log(`Removed ${action.payload.link} from library`);
          displayMessage('Removed from library');
        }
        break;
    }
  };

export default libraryMutator;
