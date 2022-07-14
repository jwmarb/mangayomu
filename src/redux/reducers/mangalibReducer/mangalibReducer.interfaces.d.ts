import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';

export interface MangaLibReducerState {
  search: string;
  appliedFilters: Record<string, unknown>; // use mangavalidator to get fields
  mangas: LibraryManga[]; // use link to access mangas in mangaReducer state
}

export interface LibraryManga {
  mangaKey: string;
  dateAdded: string;
}

export type MangaLibReducerAction =
  | {
      type: 'ADD_TO_LIBRARY';
      payload: Manga;
    }
  | { type: 'REMOVE_FROM_LIBRARY'; payload: Manga };
