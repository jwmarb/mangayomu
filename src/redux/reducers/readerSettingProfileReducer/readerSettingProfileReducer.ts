import {
  ImageScaling,
  OverloadedSetting,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import {
  ReaderSettingProfileReducerState,
  ReaderSettingProfileReducerAction,
  ReaderSettingProfile,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';

export const INITIAL_READER_SETTING_PROFILE_STATE: ReaderSettingProfile = {
  orientation: OverloadedSetting.AUTO,
  imageScaling: OverloadedSetting.AUTO,
  zoomStartPosition: OverloadedSetting.AUTO,
  readingDirection: OverloadedSetting.AUTO,
  shortChapters: OverloadedSetting.AUTO,
};

export default function (
  state: ReaderSettingProfileReducerState = {},
  action: ReaderSettingProfileReducerAction
): ReaderSettingProfileReducerState {
  switch (action.type) {
    case 'TOGGLE_READER_SETTING_PROFILE':
      return {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          [action.booleanKey]: action.value != null ? action.value : !state[action.mangaKey][action.booleanKey],
        },
      };
    case 'SET_READER_DIRECTION_FOR_SERIES':
      return {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          readingDirection: action.readerDirection,
        },
      };
    case 'OPEN_READER':
      if (action.manga.link in state === false)
        return {
          ...state,
          [action.manga.link]: INITIAL_READER_SETTING_PROFILE_STATE,
        };
      return state;
    case 'SET_DEVICE_ORIENTATION_FOR_SERIES':
      return {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          orientation: action.orientation,
        },
      };
    case 'SET_IMAGE_SCALING_FOR_SERIES':
      return {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          imageScaling: action.imageScaling,
        },
      };
    case 'SET_ZOOM_START_POSITION_FOR_SERIES':
      return {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          zoomStartPosition: action.zoomStartPosition,
        },
      };
    default:
      return state;
  }
}
