import { Manga } from '@services/scraper/scraper.interfaces';

export interface ReaderSettingsProps {
  manga: Manga;
  visible: boolean;
  onClose: () => void;
}
