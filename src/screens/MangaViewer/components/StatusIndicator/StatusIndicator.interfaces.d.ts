import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaMeta, WithStatus } from '@services/scraper/scraper.interfaces';

export interface StatusIndicatorProps {
  meta?: ReadingMangaInfo;
}
