import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';
import SortedList from '@utils/SortedList';

export interface MangaLibReducerState {
  search: string;
  mangas: Record<string, null>; // use link to access mangas in mangaReducer state
}

export type MangaLibReducerAction =
  | {
      type: 'ADD_TO_LIBRARY';
      payload: Manga;
    }
  | { type: 'REMOVE_FROM_LIBRARY'; payload: Manga }
  | { type: 'SET_SEARCH_QUERY_IN_LIBRARY'; query: string }
  | { type: 'REHYDRATE' };
