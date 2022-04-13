import { Dispatch } from 'redux';
import { SettingsReducerAction } from './settingsReducer.interfaces';

export function finishIntro() {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'INTRO_DONE' });
  };
}
