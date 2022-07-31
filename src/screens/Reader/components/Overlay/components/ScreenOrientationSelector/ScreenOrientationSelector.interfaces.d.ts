import { Manga } from '@services/scraper/scraper.interfaces';

export interface ScreenOrientationSelectorProps {
  manga: Manga;
  onOpen: () => void;
}
