import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

/**
 * The Genre class represents a genre in the application's database.
 * It is associated with a LocalManga through a belongs_to relationship.
 *
 * @property {string} name - The name of the genre.
 * @property {Relation<LocalManga>} manga - The LocalManga that this genre belongs to.
 */
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
