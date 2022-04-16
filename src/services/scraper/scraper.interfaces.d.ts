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
     */
    scan: string;

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
  imageCover: string;

  /**
   * The link that redirects to the manga page
   */
  link: string;
}

export declare interface MangaMeta {
  /**
   * The authors of the manga
   */
  authors: string[];

  /**
   * The chapters of the manga
   */
  chapters: MangaChapter[];

  /**
   * The description of the manga, also known as the synopsis
   */
  description: string;

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

export declare interface MangaChapter {
  /**
   * The string URL that redirects to the chapter page
   */
  link: string;

  /**
   * The name of the chapter
   */
  name?: string | null;
}

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
  genres: ExclusiveInclusiveFilter<string>;
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
  officialTranslation: boolean;
};
