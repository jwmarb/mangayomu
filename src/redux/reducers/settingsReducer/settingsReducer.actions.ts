import {
  ChangeableTheme,
  ReaderBackgroundColor,
  ReaderDirection,
} from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { AppDispatch } from '@redux/store';
import { Dispatch } from 'redux';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

export function finishIntro() {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'INTRO_DONE' });
  };
}

export function adjustColumns(c: number) {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'ADJUST_MANGAS_PER_COLUMN', payload: c });
  };
}

export function adjustTitleSize(c: number) {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'ADJUST_MANGAS_TITLES_PER_COLUMN', payload: c });
  };
}

export function changeReaderBackground(color: ReaderBackgroundColor) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CHANGE_BACKGROUND_COLOR', color });
  };
}

export function changeReaderDirection(direction: ReaderDirection) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CHANGE_READER_DIRECTION', direction });
  };
}

export function toggleSkipChaptersMarkedRead() {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_READER_SETTING', key: 'skipChaptersMarkedRead' });
  };
}

export function toggleShowPageNumber() {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_READER_SETTING', key: 'showPageNumber' });
  };
}

export function toggleKeepDeviceAwake() {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_READER_SETTING', key: 'keepDeviceAwake' });
  };
}

export function changeAppTheme(theme: ChangeableTheme) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SWITCH_APP_THEME', theme });
  };
}

export function toggleBoldTitles() {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_MANGACOVER_SETTING', key: 'bold' });
  };
}
