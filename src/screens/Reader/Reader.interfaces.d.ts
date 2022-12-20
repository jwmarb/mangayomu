import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export type ChapterFetcher = (
  pagesToFetchFrom: NewType,
  extendedStateKey?: string,
  appendLocation?: 'start' | 'end' | null
) => {
  cancel: () => void;
  start: () => Promise<void>;
};
