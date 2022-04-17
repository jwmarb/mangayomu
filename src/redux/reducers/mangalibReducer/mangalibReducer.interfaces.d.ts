import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';

export interface MangaLibReducerState {
  search: string;
  appliedFilters: Record<string, unknown>; // use mangavalidator to get fields
  mangaKeys: string[]; // use to access mangaReducer state
}

export type MangaLibReducerAction =
  | {
      type: 'ADD_TO_LIBRARY';
      payload: string;
    }
  | { type: 'REMOVE_FROM_LIBRARY'; payload: string };
