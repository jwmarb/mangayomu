import MangaHost from '@services/scraper/scraper.abstract';
import { FontFamily } from '@theme/Typography';
import { Orientation } from 'expo-screen-orientation';
import { ReaderBackgroundColor, ReaderDirection, ChangeableTheme, MangaCoverStyles } from './settingsReducer.constants';

export interface SettingsReducerState {
  theme: ChangeableTheme;
  showIntroduction: boolean;
  deviceOrientation: Orientation;
  selectedSource: MangaHost;
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
    preferredReadingDirection: ReaderDirection;
    keepDeviceAwake: boolean;
    showPageNumber: boolean;
    skipChaptersMarkedRead: boolean;
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
  | { type: 'CHANGE_FONT'; fontFamily: FontFamily };
