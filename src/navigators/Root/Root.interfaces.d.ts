import MangaHost from '@services/scraper/scraper.abstract';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { ExclusiveInclusiveFilter, Manga } from '@services/scraper/scraper.interfaces';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  MangaViewer: {
    manga: Manga;
  };
  GenericMangaList:
    | {
        mangas: Manga[];
        type: string;
      }
    | {
        genre: string;
        source: string;
      };
  Settings: undefined;
  MangaBrowser: {
    initialQuery: string;
    mangas: Manga[];
    source: string;
  };
  DownloadManager: undefined;
};
