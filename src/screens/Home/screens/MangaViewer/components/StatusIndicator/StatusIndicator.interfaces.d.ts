import { WithStatus } from '@services/scraper/scraper.interfaces';

export interface StatusIndicatorProps extends WithStatus {
  loading: boolean;
}
