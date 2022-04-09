import { Manga, MangaChapter, MangaMeta } from '@services/scraper/scraper.interfaces';

abstract class MangaHost {
  /**
   * The link to the manga hosting website
   */
  protected readonly link: string;
  public constructor(host: string) {
    this.link = host;
  }

  /**
   * List all mangas from the website, if available
   * @returns {Promise<Manga[]>} Returns a list of mangas from the website
   */
  public abstract listMangas(): Promise<Manga[]>;

  /**
   * Search for a manga from the website
   * @param query The string query to use to find matching results
   * @param filters Filters applied when searching
   * @returns {Promise<Manga[]>} Returns a list of mangas according to the search result
   */
  public abstract search<T extends Record<string, unknown>, R extends Manga>(query: string, filters: T): Promise<R[]>;

  /**
   * Get the meta data of the manga
   * @param manga The manga to fetch the meta data from
   * @returns Returns the meta of the manga from the parameters
   */
  public abstract getMeta<T extends Manga, R extends MangaMeta>(manga: T): Promise<R>;

  /**
   * Get the pages of a manga chapter
   * @param chapter The manga chapter
   * @returns Returns a list of URLs of each page, usually in the form of .png from a CDN server
   */
  public abstract getPages<T extends MangaChapter>(chapter: T): Promise<string[]>;
}

export default MangaHost;
