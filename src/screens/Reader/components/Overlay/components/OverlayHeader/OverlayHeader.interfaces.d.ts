import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';

export interface OverlayHeaderProps {
  currentChapter: ReadingChapterInfo | null;
  onBack: () => void;
  onBookmark: () => void;
  manga: Manga;
  onOpen: () => void;
  inLibrary: boolean;
}
