import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadCollection from '@utils/DownloadCollection';

export interface SelectedChaptersBaseProps {
  manga: Manga;
  numOfChapters: number;
}
