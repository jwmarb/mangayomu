import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';
import SortedList from '@utils/SortedList';

export interface MangaLibReducerState {
  search: string;
  mangas: Record<string, null>; // use link to access mangas in mangaReducer state
  sort: string | number; // keyof Comparators
  reversed: boolean; // if sort is reversed
}

export type MangaLibReducerAction =
  | {
      type: 'ADD_TO_LIBRARY';
      payload: Manga;
    }
  | { type: 'REMOVE_FROM_LIBRARY'; payload: Manga }
  | { type: 'SET_SEARCH_QUERY_IN_LIBRARY'; query: string }
  | { type: 'SET_SORT_METHOD'; sort: string | number }
  | { type: 'TOGGLE_REVERSE_SORT' };
