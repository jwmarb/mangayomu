import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import { MangaHistory } from '@redux/slices/history';

export interface MangaHistoryItemProps {
  item: MangaHistory;
  sectionDate: number;
}
