import MangaSee from '@services/MangaSee';
import { Appearance } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ChangeableTheme, MangaCoverStyles, ReaderBackgroundColor, ReaderDirection } from './settingsReducer.constants';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';
import * as ScreenOrientation from 'expo-screen-orientation';

const INITIAL_STATE: SettingsReducerState = {
  theme: ChangeableTheme.SYSTEM_THEME,
  showIntroduction: true,
  selectedSource: MangaSee,
  deviceOrientation: ScreenOrientation.Orientation.UNKNOWN,
  mangaCover: {
    style: MangaCoverStyles.CLASSIC,
    perColumn: 2,
    fontSize: RFValue(13),
    bold: false,
  },
  reader: {
    backgroundColor: ReaderBackgroundColor.BLACK,
    keepDeviceAwake: true,
    preferredReadingDirection: ReaderDirection.LEFT_TO_RIGHT,
    showPageNumber: true,
    skipChaptersMarkedRead: true,
  },
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'SET_DEVICE_ORIENTATION':
      return {
        ...state,
        deviceOrientation: action.orientation,
      };
    case 'CHANGE_COVER_STYLE':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          style: action.style,
        },
      };
    case 'TOGGLE_MANGACOVER_SETTING':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          [action.key]: !state.mangaCover[action.key],
        },
      };
    case 'SWITCH_APP_THEME':
      return {
        ...state,
        theme: action.theme,
      };
    case 'TOGGLE_READER_SETTING':
      return {
        ...state,
        reader: {
          ...state.reader,
          [action.key]: !state.reader[action.key],
        },
      };
    case 'CHANGE_READER_DIRECTION':
      return {
        ...state,
        reader: {
          ...state.reader,
          preferredReadingDirection: action.direction,
        },
      };
    case 'CHANGE_BACKGROUND_COLOR':
      return {
        ...state,
        reader: {
          ...state.reader,
          backgroundColor: action.color,
        },
      };
    case 'ADJUST_MANGAS_TITLES_PER_COLUMN':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          fontSize: action.payload,
        },
      };
    case 'ADJUST_MANGAS_PER_COLUMN':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          perColumn: action.payload,
        },
      };
    case 'INTRO_DONE':
      return {
        ...state,
        showIntroduction: false,
      };
    case 'SELECT_SOURCE':
      return {
        ...state,
        selectedSource: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
