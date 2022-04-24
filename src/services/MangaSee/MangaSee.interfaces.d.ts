import {
  Manga,
  WithYearReleased,
  WithGenres,
  WithHentai,
  WithStatus,
  WithType,
  MangaMeta,
  ExclusiveInclusiveFilter,
  WithGenresFilter,
  WithSortFilter,
  WithOfficialTranslationFilter,
  WithStatusFilter,
  MangaChapter,
  WithDate,
  WithOfficialTranslations,
} from '@services/scraper/scraper.interfaces';

export type MangaSeeManga = Manga &
  WithGenres &
  WithStatus &
  WithHentai &
  WithYearReleased &
  WithType &
  WithOfficialTranslations;

export type MangaSeeMangaMeta = MangaMeta<MangaSeeChapter> & WithGenres & WithYearReleased & WithType & WithStatus;

export type MangaSeeChapter = MangaChapter;

export interface Directory {
  /**
   * Authors of the manga
   */
  a: string[];

  /**
   * Date of latest chapter
   */
  ls: string;

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
}

export interface TopTenJSON {
  IndexName: string;
  SeriesName: string;
}

export interface HotUpdateJSON {
  Chapter: string;
  Date: string;
  IndexName: string;
  IsEdd: boolean;
  SeriesID: string;
  SeriesName: string;
}

export interface LatestJSON {
  Chapter: string;
  Date: string;
  Genres: string;
  IndexName: string;
  IsEdd: boolean;
  ScanStatus: string;
  SeriesID: string;
  SeriesName: string;
}

export interface NewSeriesJSON {
  IndexName: string;
  SeriesName: string;
}

export interface MainEntityJSON {
  mainEntity: {
    '@type': string;
    about: string;
    alternateName: string[];
    author: string[];
    datePublished: string;
    dateModified: string;
    genre: string[];
    name: string[];
  };
}

export interface MangaSeeChapterJSON {
  Chapter: string;
  Type: string;
  Date: string;
  ChapterName: string | null;
}
