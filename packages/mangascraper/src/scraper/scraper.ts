/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  Manga,
  MangaChapter,
  MangaHostFiltersInfo,
  MangaHostInfo,
  MangaMeta,
  RouteFetchOptions,
} from './scraper.interfaces';
import url from 'url';
import { InvalidSourceException } from '../exceptions';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import { FilterSchemaObject } from '@mangayomu/schema-creator';

export default abstract class MangaSource<
  TManga = unknown,
  TMangaMeta = unknown,
  TChapter = unknown,
  FilterSchema = never,
> {
  /**
   * All instances of MangaHost are contained here
   */
  private static readonly sources: Map<
    string,
    MangaSource<unknown, unknown, unknown, unknown>
  > = new Map();

  /**
   * Gets the `MangaHost` instance of a source. Throws an error if not found.
   * @param name The name of the source
   * @returns Returns a class version of the source
   */
  public static getSource(
    name: string,
  ): MangaSource<unknown, unknown, unknown, unknown> {
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

  public readonly FILTER_SCHEMA: FilterSchemaObject<FilterSchema> | undefined;

  /**
   * Proxy URL for network requests
   */
  public _proxy: string | null;

  public constructor(info: MangaHostInfo | MangaHostFiltersInfo<FilterSchema>) {
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
    if ('filters' in info) this.FILTER_SCHEMA = info.filters;

    this._proxy = null;
  }

  // basic setters/getters
  public get proxy(): string | null {
    return this._proxy;
  }

  public set proxy(value: string) {
    this._proxy = value;
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
   * @param tmangameta The manga meta the chapter is from
   */
  public abstract toChapter(
    tchapter: TChapter,
    tmangameta: TMangaMeta,
  ): MangaChapter;

  // Methods for accessing data from this source

  /**
   * Gets the latest mangas from this source
   * @param {AbortSignal | undefined} signal A signal from `AbortController`
   * @returns Returns the latest mangas
   */
  public latest(signal?: AbortSignal): Promise<TManga[]> {
    return Promise.resolve([]);
  }

  /**
   * Gets trending mangas from this source
   * @param {AbortSignal | undefined} signal A signal from `AbortController`
   * @returns Returns the top trending mangas
   */
  public trending(signal?: AbortSignal): Promise<TManga[]> {
    return Promise.resolve([]);
  }

  /**
   * Searches for mangas from this source
   * @param query An input search query, which is like using the search bar in the source
   * @param {AbortSignal | undefined} signal A signal from `AbortController`
   * @param filters An object containing fields that filter out results included in search. This object is the
   * `schema` property from the `createSchema` function
   * @returns Returns a list of mangas based on this query
   */
  public abstract search(
    query: string,
    signal?: AbortSignal,
    filters?: unknown,
  ): Promise<TManga[]>;

  /**
   * Gets the pages of a chapter
   * @param payload The link to a manga chapter
   * @param {AbortSignal | undefined} signal A signal from `AbortController`
   */
  public abstract pages(
    payload: Pick<MangaChapter, 'link'>,
    signal?: AbortSignal,
  ): Promise<string[]>;

  /**
   * Gets more detailed information about the manga
   * @param payload The link to a manga
   * @param {AbortSignal | undefined} signal A signal from `AbortController`
   */
  public abstract meta(
    payload: Pick<Manga, 'link'>,
    signal?: AbortSignal,
  ): Promise<TMangaMeta>;

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

  protected async route<T = cheerio.CheerioAPI>(
    path: string | { link: string } | { html: string },
    signal?: AbortSignal,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>,
    options: RouteFetchOptions = { proxyEnabled: true },
  ): Promise<T> {
    if (typeof path === 'object' && 'html' in path) {
      return cheerio.load(path.html, { decodeEntities: false }) as T;
    }
    const url =
      typeof path === 'string'
        ? `https://${this.URL.hostname}${path}`
        : path.link;
    try {
      const response = await (this.proxy && options.proxyEnabled
        ? fetch(this.proxy, {
            method: 'POST',
            body: JSON.stringify({
              url,
              method,
              body,
            }),
            headers: { 'Content-Type': 'application/json' },
            signal,
          })
        : fetch(url, {
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
            signal,
          }));
      const data = await response[body ? 'json' : 'text']();
      return body ? data : (cheerio.load(data, { decodeEntities: false }) as T);
    } catch (e) {
      throw new Error('Cancelled fetching of manga meta');
    }
  }
}
