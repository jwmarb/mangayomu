import { FilterSchemaObject } from '@mangayomu/schema-creator';
import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaSortType } from './scraper.filters';

export type GetMeta = Pick<Manga, 'link'> | { html: string; link: string };

export type RouteFetchOptions = {
  /**
   * Whether or not to fetch the provided route/link with a proxy (if provided). This option affects users on the web and not in native applciations. If using a proxy interferes with the functionality, set this to `false`.
   */
  proxyEnabled?: boolean;
};

/**
 * A manga that has official translations
 */
export interface WithOfficialTranslations {
  /**
   * Whether or not the manga is officially translated
   */
  officialTranslation: boolean;
}

/**
 * A manga with an author
 */
export interface WithAuthors {
  /**
   * The authors of the manga
   */
  authors: string[];
}

/**
 * A manga/chapter with a given release date
 */
export interface WithDate {
  /**
   * The date the manga/chapter was released
   */
  date: string;
}

export declare interface MangaHostFiltersInfo<T> extends MangaHostInfo {
  filters: FilterSchemaObject<T>;
}

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
  hasHotMangas: boolean;

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
  isAdult: boolean;
}

/**
 * A manga with a given released date
 */
export declare interface WithYearReleased {
  /**
   * The time the manga was released
   */
  yearReleased: string;
}

/**
 * A manga that is a hentai or not
 */
export declare interface WithHentai {
  /**
   * Whether the manga is a hentai or not
   */
  isHentai: boolean;
}

/**
 * A type of manga (manga, manhwa, manhua)
 */
export declare interface WithType {
  /**
   * The type of the manga
   */
  type: string;
}

/**
 * A manga with listed genres
 */
export declare interface WithGenres {
  /**
   * The category genre that matches the manga
   */
  genres: string[];
}

export declare interface WithAltTitles {
  altTitles: string[];
}

export declare interface WithRating {
  /**
   * The rating of the manga
   */
  rating: {
    /**
     * The value of the rating, scaling from 1-10, or if not enough votes, then N/A
     */
    value: string | number;

    /**
     * The number of people that gave the manga a rating
     */
    voteCount: number;
  };
}

/**
 * The status of the manga (Ongoing, Hiatus, etc.)
 */
export declare interface WithStatus {
  /**
   * The status of the manga
   */
  status: {
    /**
     * The scan status of the manga
     * This can be undefined because some manga websites only show the publish status of the manga
     */
    scan?: string;

    /**
     * The publish status of the manga
     */
    publish: string;
  };
}

/**
 * The generic interface for a Manga. This is meant to be universal and should work with every manga website.
 */
export declare interface Manga {
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
  imageCover: string | null;

  /**
   * The link that redirects to the manga page
   */
  link: string;
}

export declare interface WithModificationDate {
  /**
   * The date describing when the manga was published or modified
   */
  date: {
    /**
     * The date that describes when the manga was published
     */
    published: string;

    /**
     * The date that describes when the manga was modified, usually due to an update
     */
    modified: string;
  };
}

export declare interface MangaMeta<
  TChapters extends MangaChapter = MangaChapter,
> extends WithGenres {
  /**
   * The chapters of the manga
   */
  chapters: TChapters[];

  /**
   * The description of the manga, also known as the synopsis
   */
  description: string;

  /**
   * Image cover of the manga. This needs to be put to update the image cover whenever the user fetches an update from the manga. This is useful when the user resets their cache and the image cover URL contains an expired access key.
   */
  imageCover: string;
}

export declare interface MangaMultilingualChapter extends MangaChapter {
  /**
   * The language of the chapter. It must be in the format of a language code (e.g. english = en, brazilian portuguese = pt)
   */
  language: ISOLangCode;
}

export declare interface MangaChapter {
  /**
   * The string URL that redirects to the chapter page
   */
  link: string;

  /**
   * The name of the chapter
   */
  name: string;

  /**
   * The index the chapter belongs to in the array
   */
  index: number;

  /**
   * The date the chapter was released
   */
  date: string;
}

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
