import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';

export interface MangaActionProps {
  manga: Manga;
  userMangaInfo?: ReadingMangaInfo;
  inLibrary: boolean;
  onRead: () => void;
}
