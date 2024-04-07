import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date } from '@nozbe/watermelondb/decorators';
import { LOCAL_CHAPTER_ID, LOCAL_MANGA_ID, Table } from '@/models/schema';

export class HistoryEntry extends Model {
  static table = Table.HISTORY_ENTRIES;
  static associations: Associations = {
    [Table.LOCAL_CHAPTERS]: {
      type: 'belongs_to',
      key: LOCAL_CHAPTER_ID,
    },
    [Table.LOCAL_MANGAS]: {
      type: 'belongs_to',
      key: LOCAL_MANGA_ID,
    },
  };

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
