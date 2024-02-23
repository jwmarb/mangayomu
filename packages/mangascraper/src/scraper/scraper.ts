/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  Manga,
  MangaChapter,
  MangaHostInfo,
  MangaMeta,
} from './scraper.interfaces';
import url from 'url';
import { InvalidSourceException } from '../exceptions';

export default abstract class MangaSource<
  TManga = unknown,
  TMangaMeta = unknown,
  TChapter = unknown,
> {
  /**
   * All instances of MangaHost are contained here
   */
  private static readonly sources: Map<string, MangaSource> = new Map();

  /**
   * Gets the `MangaHost` instance of a source. Throws an error if not found.
   * @param name The name of the source
   * @returns Returns a class version of the source
   */
  public static getSource(name: string): MangaSource {
    const source = this.sources.get(name);
    if (source == null) throw new InvalidSourceException(name);
    return source;
  }

  /**
   * The version of this source
   */
  public readonly API_VERSION: string;

  /**
   * The genres that this source supports
   */
  public readonly GENRES: string[];

  /**
   * The source's default language
   */
  public readonly DEFAULT_LANGUAGE: ISOLangCode;

  /**
   * The URI of the icon of this source
   */
  public readonly ICON_URI: string;

  /**
   * The name of this source
   */
  public readonly NAME: string;

  /**
   * Whether or not this source supports querying latest mangas
   */
  public readonly SUPPORTS_LATEST_MANGAS: boolean;

  /**
   * Whether or not this source supports querying trending mangas
   */
  public readonly SUPPORTS_TRENDING_MANGAS: boolean;

  /**
   * Whether or not this source contains NSFW material
   */
  public readonly CONTAINS_NSFW: boolean;

  /**
   * The URL of the source
   */
  public readonly URL: url.Url;

  public constructor(info: MangaHostInfo) {
    MangaSource.sources.set(info.name, this);

    this.URL = url.parse(info.host);
    this.API_VERSION = info.version;
    this.GENRES = info.genres;
    this.DEFAULT_LANGUAGE = info.language;
    this.ICON_URI = info.icon;
    this.NAME = info.name;
    this.SUPPORTS_LATEST_MANGAS = info.hasLatestMangas;
    this.SUPPORTS_TRENDING_MANGAS = info.hasTrendingMangas;
    this.CONTAINS_NSFW = info.containsNSFW;
  }

  // These methods below will convert data types to a universal data type that the applications can use

  /**
   * Converts `tmanga` into a `Manga` type
   * @param tmanga A manga from the source
   */
  public abstract toManga(tmanga: TManga): Manga;

  /**
   * Converts `tmangameta` into a `MangaMeta` type
   * @param tmangameta Detailed information about a manga from the source
   */
  public abstract toMangaMeta(
    tmangameta: TMangaMeta,
  ): Manga & MangaMeta<TChapter>;

  /**
   * Converts `tchapter` into a `MangaChapter` type
   * @param tchapter A manga chapter from the source
   */
  public abstract toChapter(tchapter: TChapter): MangaChapter;

  // Methods for accessing data from this source

  /**
   * Gets the latest mangas from this source
   * @returns Returns the latest mangas
   */
  public latest(): Promise<TManga[]> {
    return Promise.resolve([]);
  }

  /**
   * Gets trending mangas from this source
   * @returns Returns the top trending mangas
   */
  public trending(): Promise<TManga[]> {
    return Promise.resolve([]);
  }

  /**
   * Searches for mangas from this source
   * @param query An input search query, which is like using the search bar in the source
   * @returns Returns a list of mangas based on this query
   */
  public abstract search(query: string): Promise<TManga[]>;

  /**
   * Gets the pages of a chapter
   * @param payload The link to a manga chapter
   */
  public abstract pages(payload: Pick<MangaChapter, 'link'>): Promise<string[]>;

  /**
   * Gets more detailed information about the manga
   * @param payload The link to a manga
   */
  public abstract meta(payload: Pick<Manga, 'link'>): Promise<TMangaMeta>;

  /**
   * Converts this class into JSON
   * @returns Returns a JSON-serializable MangaHost object
   */
  public toJSON() {
    return {
      _type: 'MangaHost',
      _name: this.NAME,
      _version: this.API_VERSION,
    };
  }
}
