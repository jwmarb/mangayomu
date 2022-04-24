import MangaHost from '@services/scraper/scraper.abstract';

export interface GenresProps {
  genres?: string[];
  buttons?: boolean;
  source: MangaHost;
}
