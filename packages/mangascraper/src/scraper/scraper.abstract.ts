import {
  Manga,
  MangaChapter,
  MangaHostInfo,
  MangaMeta,
} from './scraper.interfaces';
import url from 'url';
import * as cheerio from 'cheerio';
import { toPascalCase } from './scraper.helpers';
import UserAgent from 'user-agents';

abstract class MangaHost {
  /**
   * List of manga hosts
   */
  public static sources: string[] = [];

  /**
   * Total available of manga hosts
   */
  public static sourcesMap = new Map<string, MangaHost>();
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
  public readonly name: string;

  /**
   * The icon of the manga host
   */
  public readonly icon: string;

  /**
   * The available genres the manga host provides
   */
  public readonly genres: string[];

  private readonly genresDictionary: Record<string, string>;

  private readonly formattedGenres: string[];

  /**
   * The link to the manga hosting website
   */
  public readonly link: string;

  /**
   * The current page in the search. This is for pagination
   */
  private page: number;

  public readonly version: string;

  private readonly _isAdult: boolean;

  private readonly _hasMangaDirectory: boolean;

  public constructor(info: MangaHostInfo) {
    this.link = url.parse(info.host).hostname ?? '';
    this.genres = info.genres;
    this.genresDictionary = info.genres.reduce((prev, curr) => {
      const pascalForm = toPascalCase(curr);

      prev[pascalForm] = curr;
      prev[curr] = pascalForm;
      return prev;
    }, {} as Record<string, string>);
    this.formattedGenres = info.genres.map((x) => toPascalCase(x));
    this.icon = info.icon;
    this.name = info.name;
    this.hotMangas = info.hasHotMangas ?? false;
    this.latestMangas = info.hasLatestMangas ?? false;
    this.page = 1;
    if (info.version == null) this.version = '1.0.0';
    else this.version = info.version;
    this._isAdult = info.isAdult;
    this._hasMangaDirectory = info.hasMangaDirectory;

    MangaHost.sourcesMap.set(info.name, this);
    MangaHost.sources.push(info.name);
  }

  /**
   * Get the version of the source
   * @returns Returns the version
   */
  public getVersion() {
    return this.version;
  }

  protected async route<T = cheerio.CheerioAPI>(
    path: string | { url: string },
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(
      typeof path === 'string' ? `https://${this.link}${path}` : path.url,
      {
        method,
        headers: {
          'User-Agent': new UserAgent().toString(),
          ...(body != null
            ? {
                'Content-Type': 'application/json',
              }
            : {}),
        },
        body: JSON.stringify(body),
      },
    );
    const data = await response[body ? 'json' : 'text']();
    return body
      ? (data as T)
      : (cheerio.load(data, { decodeEntities: false }) as T);
  }

  public hasMangaDirectory() {
    return this._hasMangaDirectory;
  }

  public isAdult() {
    return this._isAdult;
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

  public getGenre(genre: string) {
    return this.genresDictionary[genre];
  }

  public getFormattedGenres() {
    return this.formattedGenres;
  }

  public hasHotMangas() {
    return this.hotMangas;
  }

  public hasLatestMangas() {
    return this.latestMangas;
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
  public abstract getPages<T extends MangaChapter>(
    chapter: T,
  ): Promise<string[]>;
}

export default MangaHost;
