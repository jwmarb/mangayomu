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
  genre: string[];
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
