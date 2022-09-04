import MangaSee from '@services/MangaSee';
import { Appearance } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ChangeableTheme, MangaCoverStyles, ReaderBackgroundColor, ReaderDirection } from './settingsReducer.constants';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';
import * as ScreenOrientation from 'expo-screen-orientation';
import { FontFamily } from '@theme/Typography';
import displayMessage from '@utils/displayMessage';
import { StatusBar } from 'expo-status-bar';
import { INITIAL_READER_SETTING_PROFILE_STATE } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';

const INITIAL_STATE: SettingsReducerState = {
  theme: ChangeableTheme.SYSTEM_THEME,
  showIntroduction: true,
  selectedSource: MangaSee,
  statusBarStyle: 'auto',
  cache: {
    maxSize: 1.28e8,
    enabled: true,
  },
  fontFamily: {
    __selectedFont: FontFamily.NUNITO,
    light: 'Nunito-light',
    regular: 'Nunito',
    heavy: 'Nunito-heavy',
    semi: 'Nunito-semi',
  },
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
    showPageNumber: true,
    skipChaptersMarkedRead: true,
    _global: {
      imageScaling: ImageScaling.SMART_FIT,
      orientation: ReaderScreenOrientation.FREE,
      readingDirection: ReaderDirection.RIGHT_TO_LEFT,
      zoomStartPosition: ZoomStartPosition.AUTOMATIC,
    },
  },
  advanced: {
    useRecyclerListView: false,
    enableDebugging: false,
  },
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'TOGGLE_ADVANCED_SETTING':
      return {
        ...state,
        advanced: {
          ...state.advanced,
          [action.key]: !state.advanced[action.key],
        },
      };
    case 'SET_READER_ZOOM_START_POSITION':
      return {
        ...state,
        reader: {
          ...state.reader,
          _global: {
            ...state.reader._global,
            zoomStartPosition: action.zoomStartPosition,
          },
        },
      };
    case 'SET_READER_IMAGE_SCALING':
      return {
        ...state,
        reader: {
          ...state.reader,
          _global: {
            ...state.reader._global,
            imageScaling: action.imageScaling,
          },
        },
      };
    case 'SET_READER_SCREEN_ORIENTATION':
      return {
        ...state,
        reader: {
          ...state.reader,
          _global: {
            ...state.reader._global,
            orientation: action.orientation,
          },
        },
      };
    case 'SET_MAX_CACHE_SIZE':
      return {
        ...state,
        cache: {
          ...state.cache,
          maxSize: action.bytes,
        },
      };
    case 'TOGGLE_CACHE':
      return {
        ...state,
        cache: {
          ...state.cache,
          enabled: !state.cache.enabled,
        },
      };
    case 'CHANGE_FONT':
      displayMessage(`Set font to ${action.fontFamily}`);
      return {
        ...state,
        fontFamily: {
          __selectedFont: action.fontFamily,
          light: `${action.fontFamily}-light`,
          regular: action.fontFamily,
          semi: `${action.fontFamily}-semi`,
          heavy: `${action.fontFamily}-heavy`,
        },
      };
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
        statusBarStyle: (() => {
          switch (action.theme) {
            case ChangeableTheme.DARK:
              return 'light';
            case ChangeableTheme.LIGHT:
              return 'dark';
            case ChangeableTheme.SYSTEM_THEME:
              return 'auto';
          }
        })(),
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
          _global: {
            ...state.reader._global,
            readingDirection: action.direction,
          },
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
