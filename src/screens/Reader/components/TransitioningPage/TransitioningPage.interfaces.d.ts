import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';

export interface TransitioningPageProps {
  previous: string;
  next: string;
  manga: Manga;
  extendedStateKey: string;
  fetchChapter: (
    pagesToFetchFrom: ReadingChapterInfo,
    extendedStateKey?: string,
    appendLocation?: 'start' | 'end' | null
  ) => Promise<void>;
}
