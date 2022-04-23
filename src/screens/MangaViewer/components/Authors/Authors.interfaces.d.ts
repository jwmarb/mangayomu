import { Manga } from '@services/scraper/scraper.interfaces';

export interface AuthorsProps {
  manga: Manga;
  authors?: string[];
}
