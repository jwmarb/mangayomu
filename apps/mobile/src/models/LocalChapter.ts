import { Model, Query, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  children,
  date,
  field,
  relation,
} from '@nozbe/watermelondb/decorators';
import type { ISOLangCode } from '@mangayomu/language-codes';
import { LOCAL_CHAPTER_ID, LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';
import { HistoryEntry } from '@/models/HistoryEntry';

/**
 * Represents a local chapter in a manga. This model defines the structure and relationships of a local chapter.
 *
 * The LocalChapter class extends the base Model class and is associated with the LOCAL_CHAPTERS table.
 * It includes fields for the chapter's link, language, subname, name, and date. Additionally, it has a relationship
 * with the LocalManga model, indicating that each chapter belongs to a specific manga.
 */
export class LocalChapter extends Model {
  static table = Table.LOCAL_CHAPTERS;

  static associations: Associations = {
    [Table.LOCAL_MANGAS]: {
      type: 'belongs_to', // This chapter belongs to a manga
      key: LOCAL_MANGA_ID,
    },
  };

  // Define the relationship with the LocalManga model
  @relation(Table.LOCAL_MANGAS, LOCAL_MANGA_ID) manga!: Relation<LocalManga>;

  // Define the link field for this chapter
  @field('link') link!: string;

  // Define the optional language field for this chapter
  @field('language') language?: ISOLangCode | null;

  // Define the optional subname field for this chapter
  @field('sub_name') subname?: string | null;

  // Define the name field for this chapter
  @field('name') name!: string;

  // Define the date field for this chapter
  @date('date') date!: Date;
}
