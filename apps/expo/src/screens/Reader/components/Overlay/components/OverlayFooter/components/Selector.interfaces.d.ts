import { Manga } from '@services/scraper/scraper.interfaces';

export interface SelectorProps {
  manga: Manga;
  onOpen: () => void;
}