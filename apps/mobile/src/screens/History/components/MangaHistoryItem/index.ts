export { default } from './MangaHistoryItem';
import { UserHistorySchema } from '@database/schemas/History';
import { LocalMangaSchema } from '@database/schemas/LocalManga';

export interface MangaHistoryItemProps {
  item: UserHistorySchema;
  localManga?: LocalMangaSchema;
}
