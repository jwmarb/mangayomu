import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export type ChapterFetcher = (
  pagesToFetchFrom: ReadingChapterInfo,
  extendedStateKey?: string,
  appendLocation?: 'start' | 'end' | null,
  alreadyFetchedNextChapter?: boolean
) => {
  cancel: () => void;
  start: () => Promise<void>;
};
