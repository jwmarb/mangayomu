import MangaHost from '@services/scraper/scraper.abstract';

export interface MangaSourceProps {
  source: MangaHost;
  isCurrentSource: boolean;
}
