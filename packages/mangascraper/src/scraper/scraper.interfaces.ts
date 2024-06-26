import { FilterSchemaObject } from '@mangayomu/schema-creator';
import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaSortType } from './scraper.filters';

export type GetMeta = Pick<Manga, 'link'> | { html: string; link: string };

export type RouteFetchOptions = {
  /**
   * Whether or not to fetch the provided route/link with a proxy (if provided). This option affects users on the web and not in native applciations. If using a proxy interferes with the functionality, set this to `false`.
   */
  proxyEnabled?: boolean;

  /**
   * Whether or not to return a cheerio object by default
   */
  cheerioLoad?: boolean;
};

/**
 * A manga that has official translations
 */
export type WithOfficialTranslations = {
  /**
   * Whether or not the manga is officially translated
   */
  officialTranslation: boolean;
};

/**
 * A manga with an author
 */
export type WithAuthors = {
  /**
   * The authors of the manga
   */
  authors: string[];
};

/**
 * A manga/chapter with a given release date
 */
export type WithDate = {
  /**
   * The date the manga/chapter was released
   */
  date: string | number;
};

/**
 * @deprecated
 */
export declare interface MangaHostFiltersInfo<T> extends MangaHostInfo {
  filters: FilterSchemaObject<T>;
}

export type MangaSourceInfo<T> = {
  /**
   * The name of the manga source (e.g. MangaNato, Mangakakalot, etc.)
   */
  name: string;

  /**
   * The URL of the manga source
   */
  host: string;

  /**
   * The default language of the manga source. If uncertain (meaning that mangas do not have a preferred language like MangaPark), set this to the site's spoken language
   */
  language: ISOLangCode;

  /**
   * All the available genres the manga source provides
   */
  genres: string[];

  /**
   * Maps a genre from `genres` to a human-readable genre. For example, if a genre `action` is in `genres`, it should
   * be mapped to be `Action`
   */
  mapToReadableGenres?: Record<string, string>;

  /**
   * The icon of the manga source. It is preferable to use favicon for this
   */
  icon: string;

  /**
   * The version of the source made by the creator. Should follow semantic versioning
   * 1.x.x = major version that introduces incompatible API changes
   * x.1.x = minor version that adds new functionality that is compatible with previous versions
   * x.x.1 = patch version that fixes bugs
   */
  version: string;

  /**
   * Whether or not the manga source is mostly composed of adult content such as hentai. If the
   */
  containsNSFW: boolean;

  /**
   * A schema object that provides information on what filters the source provides when searching manga. If the manga source does not offer filtered querying or a way to filter mangas, this can be set `undefined`. To create a filter schema object, call `createSchema()` from `@mangayomu/schema-creator`. For a more in-depth tutorial about this, refer to the [documentation](https://github.com/jwmarb/mangayomu/blob/main/docs/adding-a-source-tutorial.md#creating-a-schema)
   *
   * @example
   * ```js
   * {
   *    "Sort by": {
   *      type: "sort",
   *      options: ["Title", "Chapters", ...],
   *      reversed: false,
   *      default: "Title",
   *      value: "Title"
   *    },
   *    "Genres": {
   *      type: "inclusive/exclusive"
   *      include: [],
   *      exclude: [],
   *      fields: ["Action", "Adventure", "Comedy", ...],
   *    },
   *    "Official Translation": {
   *      type: "option",
   *      options: ["Yes", "No"],
   *      default: "Yes',
   *      value: "No"
   *    },
   *    ...
   * }
   * ```
   */
  filterSchema?: FilterSchemaObject<T>;
};

/**
 * @deprecated
 */
export declare interface MangaHostInfo {
  /**
   * The name of the manga host
   */
  name: string;

  /**
   * The host URL of the manga host
   */
  host: string;

  /**
   * The default language of the manga host. If uncertain (meaning that mangas do not have a preferred language like MangaPark), set this to the site's language
   */
  language: ISOLangCode;

  /**
   * All the available genres the manga host provides
   */
  genres: string[];

  /**
   * The icon of the manga host. It is preferable to use favicon for this
   */
  icon: string;

  /**
   * Whether or not the manga host has a page for listing hot/trending updated manga
   */
  hasTrendingMangas: boolean;

  /**
   * Whether or not the manga host has a page for listing latest/recently updated manga
   */
  hasLatestMangas: boolean;

  /**
   * Whether or not the manga host has a manga directory like MangaSee
   */
  hasMangaDirectory: boolean;

  /**
   * The version of the source made by the creator. Should follow semantic versioning
   * 1.x.x = major version that introduces incompatible API changes
   * x.1.x = minor version that adds new functionality that is compatible with previous versions
   * x.x.1 = patch version that fixes bugs
   */
  version: string;

  /**
   * Whether or not the manga host is mostly composed of adult content such as hentai
   */
  containsNSFW: boolean;
}

/**
 * A manga with a given released date
 */
export declare type WithYearReleased = {
  /**
   * The time the manga was released
   */
  yearReleased: string;
};

/**
 * A manga that is a hentai or not
 */
export declare type WithHentai = {
  /**
   * Whether the manga is a hentai or not
   */
  isHentai: boolean;
};

/**
 * A type of manga (manga, manhwa, manhua)
 */
export declare type WithType = {
  /**
   * The type of the manga
   */
  type: string;
};

/**
 * A manga with listed genres
 */
export type WithGenres = {
  /**
   * The category genre that matches the manga
   */
  genres: string[];
};

export declare type WithAltTitles = {
  altTitles: string[];
};

export declare type WithRating = {
  /**
   * The rating of the manga
   */
  rating: {
    /**
     * The value of the rating, scaling from 1-10, or if not enough votes, then N/A.
     *
     * This should be a float, but if the source only provides an integer, provide that instead.
     */
    value: 'N/A' | number;

    /**
     * The number of people that gave the manga a rating
     */
    voteCount: number;
  };
};

export type MangaStatus =
  | 'ongoing'
  | 'completed'
  | 'hiatus'
  | 'discontinued'
  | 'cancelled';

/**
 * The status of the manga (Ongoing, Hiatus, etc.)
 */
export declare type WithStatus = {
  /**
   * The status of the manga
   */
  status: {
    /**
     * The scan status of the manga
     * This can be undefined because some manga websites only show the publish status of the manga
     *
     * The scan status must be a value that is lowercase such as "ongoing" or "hiatus"
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    scan?: MangaStatus | null | (string & {});

    /**
     * The publish status of the manga.
     *
     * This must be lowercase such as "ongoing" or "hiatus"
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    publish: MangaStatus | (string & {});
  };
};

/**
 * The generic interface for a Manga. This is meant to be universal and should work with every manga website.
 */
export type Manga = {
  /**
   * The source the manga was fetched from
   */
  source: string;
  /**
   * The title of the manga
   */
  title: string;

  /**
   * The image cover of the manga in the form of a URL link
   */
  imageCover?: string | null;

  /**
   * The link that redirects to the manga page
   */
  link: string;

  /**
   * The language of this manga (if applicable)
   *
   * Setting this value will display the language region flag this manga is translated for.
   *
   * For example, "en" will show the United Kingdom flag  while "ch" will show a Chinese flag
   */
  language?: ISOLangCode | null;
};

export declare type WithModificationDate = {
  /**
   * The date describing when the manga was published or modified
   */
  date: {
    /**
     * The date that describes when the manga was published
     */
    published: string | number;

    /**
     * The date that describes when the manga was modified, usually due to an update
     */
    modified: string | number;
  };
};

export declare type MangaMeta<TChapter = unknown> = {
  /**
   * The chapters of the manga
   *
   * ORDER MATTERS! The chapters must be sorted by their placement where the latest chapter is the 0th element and the first chapter is the last element
   */
  chapters: TChapter[];

  /**
   * The description of the manga, also known as the synopsis
   */
  description?: string | null;

  /**
   * Image cover of the manga. This needs to be put to update the image cover whenever the user fetches an update from the manga. This is useful when the user resets their cache and the image cover URL contains an expired access key.
   */
  imageCover?: string | null;
} & Partial<
  WithGenres &
    WithAltTitles &
    WithAuthors &
    WithHentai &
    WithModificationDate &
    WithOfficialTranslations &
    WithRating &
    WithStatus &
    WithType &
    WithYearReleased
>;

export declare type MangaMultilingualChapter = {
  /**
   * The language of the chapter. It must be in the format of a language code (e.g. english = en, brazilian portuguese = pt)
   */
  language: ISOLangCode;
} & MangaChapter;

export type MangaChapter = {
  /**
   * The string URL that redirects to the chapter page
   */
  link: string;

  /**
   * The name of the chapter (e.g. Chapter 43 or #194)
   */
  name: string;

  /**
   * The index the chapter belongs to in the array
   * @deprecated This will be removed in the future. For now, just set this to 0
   */
  index: number;

  /**
   * The date the chapter was released, in milliseconds from epoch.
   */
  date: number;

  /**
   * After the name of a chapter is given, there may be a subtitle associated with it
   */
  subname?: string | null;
};

export type WithFilters =
  | WithGenresFilter
  | WithSortFilter
  | WithStatusFilter
  | WithOfficialTranslationFilter;

export type ExclusiveInclusiveFilter<T> = {
  include: T[];
  exclude: T[];
};

/**
 * A filter for genres
 */
export type WithGenresFilter = {
  /**
   * Include/exclude genres from search
   */
  Genres: ExclusiveInclusiveFilter<string>;
};

/**
 * A filter with sort
 */
export type WithSortFilter = {
  /**
   * Sort the mangas in an order
   * First element of this array should be a boolean declaring if its in descending or ascending order
   * Second element of this array should be a MangaSortType declaring how the mangas should be sorted
   */
  sort: [boolean, MangaSortType];
};

/**
 * A filter for manga status
 */
export type WithStatusFilter = {
  /**
   * Only include mangas from search that match status
   */
  status: string | null;
};

/**
 * A filter for official translations
 */
export type WithOfficialTranslationFilter = {
  /**
   * Only include mangas from search that are officially translated and are not fan translations
   */
  officialTranslation: boolean | null;
};
