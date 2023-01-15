import { Manga, MangaChapter, MangaHostInfo, MangaMeta } from './scraper.interfaces';
import axios from 'axios';
import url from 'url';
import * as cheerio from 'cheerio';

abstract class MangaHost {
  /**
   * Total available of manga hosts
   */
  public static availableSources = new Map<string, MangaHost>();
  /**
   * Whether or not the manga host shows hot mangas
   */
  private readonly hotMangas: boolean;

  /**
   * Whether or not the manga host shows latest mangas
   */
  private readonly latestMangas: boolean;

  /**
   * The name of the manga host
   */
  private readonly name: string;

  /**
   * The icon of the manga host
   */
  private readonly icon: string;

  /**
   * The available genres the manga host provides
   */
  private readonly genres: string[];

  /**
   * The link to the manga hosting website
   */
  public readonly link: string;

  /**
   * The current page in the search. This is for pagination
   */
  private page: number;

  private readonly version: string;

  public constructor(info: MangaHostInfo) {
    this.link = url.parse(info.host).hostname ?? '';
    this.genres = info.genres;
    this.icon = info.icon;
    this.name = info.name;
    this.hotMangas = info.hasHotMangas ?? false;
    this.latestMangas = info.hasLatestMangas ?? false;
    this.page = 1;
    if (info.version == null) this.version = '1.0.0';
    else this.version = info.version;

    MangaHost.availableSources.set(info.name, this);
  }

  /**
   * Get the version of the source
   * @returns Returns the version
   */
  public getVersion() {
    return this.version;
  }

  protected async route(path: string | { url: string }): Promise<cheerio.CheerioAPI> {
    if (typeof path === 'string') {
      const { data } = await axios.get(`https://${this.link}${path}`);
      return cheerio.load(data, { decodeEntities: false });
    }
    const { data } = await axios.get(path.url);
    return cheerio.load(data, { decodeEntities: false });
  }

  public getPage() {
    return this.page;
  }

  public resetPage() {
    this.page = 1;
  }

  public addPage() {
    this.page++;
  }

  public getLink() {
    return this.link;
  }

  public getGenre(index: number) {
    return this.genres[index];
  }

  public getName() {
    return this.name;
  }

  public getIcon() {
    return this.icon;
  }

  public getGenres() {
    return this.genres;
  }

  public hasHotMangas() {
    return this.hotMangas;
  }

  public hasLatestMangas() {
    return this.latestMangas;
  }

  public static getAvailableSources() {
    return this.availableSources;
  }

  /**
   * List all recently updated mangas from the website, if available
   * @returns {Promise<Manga[]>} Returns a list of mangas that were recently updated
   */
  public listRecentlyUpdatedManga(): Promise<Manga[]> {
    return Promise.resolve([]);
  }

  /**
   * List all hot/trending mangas from the website, if available
   * @returns {Promise<Manga[]>} Returns a list of mangas that are trending/hot
   */
  public listHotMangas(): Promise<Manga[]> {
    return Promise.resolve([]);
  }

  /**
   * List all mangas from the website, if available
   * @returns {Promise<Manga[]>} Returns a list of mangas from the website
   */
  public listMangas(): Promise<Manga[]> {
    return Promise.resolve([]);
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
   * @returns Returns the meta of the manga from the parameters. Will also return an updated version of the params.
   */
  public abstract getMeta(manga: Manga): Promise<MangaMeta & Manga>;

  /**
   * Get the pages of a manga chapter
   * @param chapter The manga chapter
   * @returns Returns a list of URLs of each page, usually in the form of .png from a CDN server
   */
  public abstract getPages<T extends MangaChapter>(chapter: T): Promise<string[]>;
}

export default MangaHost;
