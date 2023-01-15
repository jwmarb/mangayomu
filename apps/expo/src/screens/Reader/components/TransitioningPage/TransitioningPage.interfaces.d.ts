import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { ChapterFetcher } from '@screens/Reader/Reader.interfaces';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';

export interface TransitioningPageProps {
  previous: string;
  next: string;
  manga: Manga;
  extendedStateKey: string;
  fetchChapter: ChapterFetcher;
}
