import { Manga } from '@services/scraper/scraper.interfaces';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  MangaViewer: {
    manga: Manga;
  };
};
