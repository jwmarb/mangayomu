import { MangaMeta, WithStatus } from '@services/scraper/scraper.interfaces';

export interface StatusIndicatorProps {
  meta?: MangaMeta;
  loading: boolean;
}
