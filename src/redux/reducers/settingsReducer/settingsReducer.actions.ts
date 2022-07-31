import {
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import {
  ChangeableTheme,
  MangaCoverStyles,
  ReaderBackgroundColor,
  ReaderDirection,
} from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { AppDispatch } from '@redux/store';
import { FontFamily } from '@theme/Typography';
import { Dispatch } from 'redux';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

export function setMaxCacheSize(bytes: number) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_MAX_CACHE_SIZE', bytes });
  };
}

export function toggleCache() {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'TOGGLE_CACHE' });
  };
}

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

export function changeCoverStyle(coverStyle: MangaCoverStyles) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CHANGE_COVER_STYLE', style: coverStyle });
  };
}

export function changeFont(fontFamily: FontFamily) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CHANGE_FONT', fontFamily });
  };
}

export function setReaderScreenOrientation(orientation: ReaderScreenOrientation) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_SCREEN_ORIENTATION', orientation });
  };
}

export function setReaderScreenImageScaling(imageScaling: ImageScaling) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_IMAGE_SCALING', imageScaling });
  };
}

export function setReaderScreenZoomStartPosition(zoomStartPosition: ZoomStartPosition) {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_ZOOM_START_POSITION', zoomStartPosition });
  };
}
