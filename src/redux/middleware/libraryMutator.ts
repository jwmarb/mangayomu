import { addToLibrary, removeFromLibrary } from '@redux/reducers/mangalibReducer/mangalibReducer.actions';
import { AppActions, AppState } from '@redux/store';
import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-root-toast';
import { Middleware } from 'redux';

const displayMessage = (msg: string) =>
  Platform.OS !== 'android'
    ? Toast.show(msg, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.SHORT,
        animation: true,
        hideOnPress: true,
        delay: 0,
        shadow: true,
      })
    : ToastAndroid.show(msg, ToastAndroid.SHORT);

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
