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

export class LocalChapter extends Model {
  static table = Table.LOCAL_CHAPTERS;
  static associations: Associations = {
    [Table.LOCAL_MANGAS]: {
      type: 'belongs_to',
      key: LOCAL_MANGA_ID,
    },
  };

  @relation(Table.LOCAL_MANGAS, LOCAL_MANGA_ID) manga!: Relation<LocalManga>;
  @field('link') link!: string;
  @field('language') language?: ISOLangCode | null;
  @field('sub_name') subname?: string | null;
  @field('name') name!: string;
  @date('date') date!: Date;
}
