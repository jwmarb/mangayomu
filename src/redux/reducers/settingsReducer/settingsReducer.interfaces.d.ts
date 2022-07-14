import MangaHost from '@services/scraper/scraper.abstract';
import { ReaderBackgroundColor, ReaderDirection, ChangeableTheme } from './settingsReducer.constants';

export interface SettingsReducerState {
  theme: ChangeableTheme;
  showIntroduction: boolean;
  selectedSource: MangaHost;
  mangaCover: {
    perColumn: number;
    fontSize: number;
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
  | { type: 'SWITCH_APP_THEME'; theme: ChangeableTheme };
