import { ChapterState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { ReadingChapterInfo, ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';

export interface DownloadingChapterProps {
  mangaKey: string;
  chapterKey: string;
}
