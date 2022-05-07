import MangaHost from '@services/scraper/scraper.abstract';

export interface SettingsReducerState {
  showIntroduction: boolean;
  selectedSource: MangaHost;
  mangaCover: {
    perColumn: number;
    fontSize: number;
  };
}

export type SettingsReducerAction =
  | {
      type: 'INTRO_DONE';
    }
  | { type: 'SELECT_SOURCE'; payload: MangaHost }
  | { type: 'ADJUST_MANGAS_PER_COLUMN'; payload: number }
  | { type: 'ADJUST_MANGAS_TITLES_PER_COLUMN'; payload: number };
