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
