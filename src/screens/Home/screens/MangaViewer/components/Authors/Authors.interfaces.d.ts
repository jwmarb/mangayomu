import { Manga } from '@services/scraper/scraper.interfaces';

export interface Authors {
  manga: Manga;
  loading: boolean;
  authors?: string[];
}
