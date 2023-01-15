import MangaHost from '@services/scraper/scraper.abstract';
import { Manga, MangaHostFiltersInfo } from '@services/scraper/scraper.interfaces';
import { FilterSchemaObject } from '@utils/MangaFilters/schema';

export enum MangaSortType {
  ALPHABETICAL = 'alphabetical',
  POPULARITY = 'popularity',
  YEAR = 'year',
}

export abstract class MangaHostWithFilters<T> extends MangaHost {
  /**
   * The filter schema of the manga host
   */
  private readonly filterSchema: FilterSchemaObject<T>;

  public constructor(options: MangaHostFiltersInfo<T>) {
    super(options);
    this.filterSchema = options.filters;
  }

  public getFilterSchema() {
    return this.filterSchema;
  }

  /**
   * Search for a manga from the website
   * @param query The string query to use to find matching results
   * @param {T} filter The filter to apply to the search
   * @returns {Promise<Manga[]>} Returns a list of mangas according to the search result
   */
  public abstract search(query: string, filter?: T): Promise<Manga[]>;
}
