import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

export class Genre extends Model {
  static table = Table.GENRES;
  static associations: Associations = {
    [Table.LOCAL_MANGAS]: {
      type: 'belongs_to',
      key: LOCAL_MANGA_ID,
    },
  };

  @field('name') name!: string;
  @relation(Table.LOCAL_MANGAS, LOCAL_MANGA_ID) manga!: Relation<LocalManga>;
}
