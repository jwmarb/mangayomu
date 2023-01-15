import { Manga } from '@services/scraper/scraper.interfaces';

export interface MangaProps extends Manga {
  compact?: boolean;
}
