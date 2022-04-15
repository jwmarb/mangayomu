import MangaHost from '@services/scraper/scraper.abstract';

export interface SettingsReducerState {
  showIntroduction: boolean;
  selectedSource: MangaHost;
}

export type SettingsReducerAction =
  | {
      type: 'INTRO_DONE';
    }
  | { type: 'SELECT_SOURCE'; payload: MangaHost };
