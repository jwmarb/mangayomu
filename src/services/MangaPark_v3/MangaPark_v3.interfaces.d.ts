import {
  MangaMeta,
  MangaMultilingualChapter,
  WithAuthors,
  WithGenres,
  WithRating,
  WithStatus,
} from '@services/scraper/scraper.interfaces';

export type MangaParkV3MangaMeta = MangaMeta<MangaMultilingualChapter> &
  WithGenres &
  WithStatus &
  WithRating &
  WithAuthors;
