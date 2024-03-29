import {
  Manga,
  WithYearReleased,
  WithGenres,
  WithHentai,
  WithStatus,
  WithType,
  MangaMeta,
  MangaChapter,
  WithOfficialTranslations,
  WithAltTitles,
  WithAuthors,
  WithModificationDate,
} from '../scraper/scraper.interfaces';

export type MangaSeeManga = Manga &
  WithGenres &
  WithStatus &
  WithHentai &
  WithYearReleased &
  WithType &
  WithOfficialTranslations &
  WithAltTitles & {
    lt: number;
    v: string;
    vm: string;
  };

export type MangaSeeMangaMeta = MangaMeta<MangaSeeChapter> &
  WithGenres &
  WithYearReleased &
  WithType &
  WithAuthors &
  WithStatus &
  WithModificationDate;

export type MangaSeeChapter = MangaChapter;

export interface CurChapter {
  Chapter: string;
  Type: string;
  Page: string;
  Directory: string;
  Date: string;
}

export type Directory = {
  /**
   * Authors of the manga
   */
  a: string[];

  /**
   * Alternate titles
   */
  al: string[];

  /**
   * Date of latest chapter
   */
  ls: string | number;

  /**
   * Short for genres
   */
  g: string[];

  /**
   * same as IndexName
   */
  i: string;

  /**
   * same as Series
   */
  s: string;

  /**
   * manga status (scan)
   */
  ss: string;

  /**
   * manga status (publish)
   */
  ps: string;

  /**
   * Official translation
   */
  o: string;

  /**
   * Whether or not the manga is a hentai
   */
  h: boolean;

  /**
   * The type of the manga
   */
  t: string;

  /**
   * The year the manga was released
   */
  y: string;

  /**
   * Popularity value of the manga (all time)
   */
  v: string;

  /**
   * Popularity value of the manga (monthly)
   */
  vm: string;

  /**
   * Latest chapter time value
   */
  lt: number;
};

export interface TopTenJSON {
  IndexName: string;
  SeriesName: string;
}

export type HotUpdateJSON = {
  Chapter: string;
  Date: string;
  IndexName: string;
  IsEdd: boolean;
  SeriesID: string;
  SeriesName: string;
};

export type LatestJSON = {
  Chapter: string;
  Date: string;
  Genres: string;
  IndexName: string;
  IsEdd: boolean;
  ScanStatus: string;
  SeriesID: string;
  SeriesName: string;
};

export interface NewSeriesJSON {
  IndexName: string;
  SeriesName: string;
}

export type MainEntityJSON = {
  mainEntity: {
    '@type': string;
    name: string;
    about: string;
    alternateName: string[];
    author: string[];
    datePublished: string;
    dateModified: string;
    genre: string[];
  };
};

export type MangaSeeChapterJSON = {
  Chapter: string;
  Type: string;
  Date: string;
  ChapterName: string | null;
};
