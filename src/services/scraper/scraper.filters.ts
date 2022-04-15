import MangaHost from '@services/scraper/scraper.abstract';
import { Manga } from '@services/scraper/scraper.interfaces';

export enum MangaSortType {
  ALPHABETICAL = 'alphabetical',
  POPULARITY = 'popularity',
  YEAR = 'year',
}

export abstract class MangaHostWithFilters<T> extends MangaHost {
  /**
   * Search for a manga from the website
   * @param query The string query to use to find matching results
   * @param {T} filter The filter to apply to the search
   * @returns {Promise<Manga[]>} Returns a list of mangas according to the search result
   */
  public abstract search(query: string, filter?: T): Promise<Manga[]>;
}
