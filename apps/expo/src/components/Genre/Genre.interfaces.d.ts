import MangaHost from '@services/scraper/scraper.abstract';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';

export interface GenreProps {
  genre: string;
  source: MangaHost;
}
