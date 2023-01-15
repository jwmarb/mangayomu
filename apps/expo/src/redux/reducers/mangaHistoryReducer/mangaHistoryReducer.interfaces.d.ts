import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import SortedList from '@utils/SortedList';

export interface MangaHistoryReducerState {
  search: string;
  sectionListData: MangaSectionHistoryObject[];
}

export type MangaHistoryObject = {
  mangaKey: string;
  currentlyReadingChapter: string;
  dateRead: number;
  sectionIndex: number;
};

export type MangaSectionHistoryObject = {
  data: SortedList<MangaHistoryObject>;
  date: number;
};

export type MangaHistoryReducerAction =
  | { type: 'OPEN_READER'; manga: Manga; chapter: ReadingChapterInfo }
  | { type: 'REMOVE_FROM_HISTORY'; sectionListDataIndex: number; itemToRemove: MangaHistoryObject };
