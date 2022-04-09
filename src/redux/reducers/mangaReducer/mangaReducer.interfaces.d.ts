import { MangaMeta } from '@services/scraper/scraper.interfaces';

export type MangaReducerState = Record<string, MangaMeta>;

export type MangaReducerAction = {
  type: 'VIEW_MANGA';
  payload: MangaMeta;
};
