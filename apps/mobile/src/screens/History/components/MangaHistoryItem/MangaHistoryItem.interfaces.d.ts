import { MangaHistory } from '@database/schemas/History';
import { LocalMangaSchema } from '@database/schemas/LocalManga';

export interface MangaHistoryItemProps {
  item: MangaHistory;
  localManga?: LocalMangaSchema;
  sectionDate: number;
}
