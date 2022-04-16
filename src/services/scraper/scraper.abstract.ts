import { Manga, MangaChapter, MangaHostInfo, MangaMeta } from '@services/scraper/scraper.interfaces';
import axios from 'axios';
import url from 'url';
import * as cheerio from 'cheerio';

abstract class MangaHost {
  public static availableSources = new Map<string, MangaHost>();
  /**
   *
   */
  public readonly hasHotMangas: boolean;

  public readonly hasLatestMangas: boolean;

  /**
   * The name of the manga host
   */
  public readonly name: string;

  /**
   * The icon of the manga host
   */
  public readonly icon: string;

  /**
   * The available genres the manga host provides
   */
  public readonly genres: string[];

  /**
   * The link to the manga hosting website
   */
  public readonly link: string;
  public constructor(info: MangaHostInfo) {
    this.link = url.parse(info.host).hostname ?? '';
    this.genres = info.genres;
    this.icon = info.icon;
    this.name = info.name;
    this.hasHotMangas = info.hasHotMangas ?? false;
    this.hasLatestMangas = info.hasLatestMangas ?? false;

    MangaHost.availableSources.set(info.name, this);
  }

  protected async route(path: string): Promise<cheerio.CheerioAPI> {
    const { data } = await axios.get(`https://${this.link}${path}`);
    return cheerio.load(data, { decodeEntities: false });
  }

  protected getLink() {
    return this.link;
  }

  protected getGenre(index: number) {
    return this.genres[index];
  }

  /**
   * List all recently updated mangas from the website, if available
   * @returns {Promise<Manga[] | null>} Returns a list of mangas that were recently updated
   */
  public listRecentlyUpdatedManga(): Promise<Manga[] | null> {
    return Promise.resolve(null);
  }

  /**
   * List all hot/trending mangas from the website, if available
   * @returns {Promise<Manga[] | null>} Returns a list of mangas that are trending/hot
   */
  public listHotMangas(): Promise<Manga[] | null> {
    return Promise.resolve(null);
  }

  /**
   * List all mangas from the website, if available
   * @returns {Promise<Manga[] | null>} Returns a list of mangas from the website
   */
  public listMangas(): Promise<Manga[] | null> {
    return Promise.resolve(null);
  }

  /**
   * Search for a manga from the website
   * @param query The string query to use to find matching results
   * @returns {Promise<Manga[]>} Returns a list of mangas according to the search result
   */
  public abstract search(query: string): Promise<Manga[]>;

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
