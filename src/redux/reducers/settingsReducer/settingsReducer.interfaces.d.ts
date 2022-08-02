import MangaHost from '@services/scraper/scraper.abstract';
import { FontFamily } from '@theme/Typography';
import { Orientation } from 'expo-screen-orientation';
import { StatusBarStyle } from 'expo-status-bar';
import { ReaderBackgroundColor, ReaderDirection, ChangeableTheme, MangaCoverStyles } from './settingsReducer.constants';
import {
  ReaderSettingProfile,
  GlobalReadingSettingProfile,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.interfaces';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';

export interface SettingsReducerState {
  theme: ChangeableTheme;
  showIntroduction: boolean;
  deviceOrientation: Orientation;
  selectedSource: MangaHost;
  statusBarStyle: StatusBarStyle;
  cache: {
    maxSize: number;
    enabled: boolean;
  };
  fontFamily: {
    __selectedFont: FontFamily;
    light: string;
    regular: string;
    heavy: string;
    semi: string;
  };
  mangaCover: {
    perColumn: number;
    fontSize: number;
    bold: boolean;
    style: MangaCoverStyles;
  };
  reader: {
    backgroundColor: ReaderBackgroundColor;
    keepDeviceAwake: boolean;
    showPageNumber: boolean;
    skipChaptersMarkedRead: boolean;
    _global: GlobalReadingSettingProfile;
  };
  advanced: {
    useRecyclerListView: boolean;
  };
}

export type ReaderSettingsBooleans = keyof {
  [K in keyof SettingsReducerState['reader'] as SettingsReducerState['reader'][K] extends boolean ? K : never]: boolean;
};

export type MangaCoverSettingsBooleans = keyof {
  [K in keyof SettingsReducerState['mangaCover'] as SettingsReducerState['mangaCover'][K] extends boolean
    ? K
    : never]: boolean;
};

export type AdvancedSettingsBooleans = keyof {
  [K in keyof SettingsReducerState['advanced'] as SettingsReducerState['advanded'][K] extends boolean
    ? K
    : never]: boolean;
};

export type SettingsReducerAction =
  | {
      type: 'INTRO_DONE';
    }
  | { type: 'SELECT_SOURCE'; payload: MangaHost }
  | { type: 'ADJUST_MANGAS_PER_COLUMN'; payload: number }
  | { type: 'ADJUST_MANGAS_TITLES_PER_COLUMN'; payload: number }
  | { type: 'CHANGE_BACKGROUND_COLOR'; color: ReaderBackgroundColor }
  | { type: 'CHANGE_READER_DIRECTION'; direction: ReaderDirection }
  | { type: 'TOGGLE_READER_SETTING'; key: ReaderSettingsBooleans }
  | { type: 'SWITCH_APP_THEME'; theme: ChangeableTheme }
  | { type: 'TOGGLE_MANGACOVER_SETTING'; key: MangaCoverSettingsBooleans }
  | { type: 'CHANGE_COVER_STYLE'; style: MangaCoverStyles }
  | { type: 'SET_DEVICE_ORIENTATION'; orientation: Orientation }
  | { type: 'CHANGE_FONT'; fontFamily: FontFamily }
  | { type: 'TOGGLE_CACHE' }
  | { type: 'SET_MAX_CACHE_SIZE'; bytes: number }
  | { type: 'SET_READER_SCREEN_ORIENTATION'; orientation: ReaderScreenOrientation }
  | { type: 'SET_READER_IMAGE_SCALING'; imageScaling: ImageScaling }
  | { type: 'SET_READER_ZOOM_START_POSITION'; zoomStartPosition: ZoomStartPosition }
  | { type: 'TOGGLE_ADVANCED_SETTING'; key: AdvancedSettingsBooleans };
