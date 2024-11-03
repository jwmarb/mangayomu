import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

/**
 * Represents an Author in the database.
 *
 * @property {string} name - The name of the author.
 * @property {Relation<LocalManga>} manga - The manga associated with this author. This is a many-to-one relationship as many mangas can be related to one author
 */
export class Author extends Model {
  // Define the table name for this model
  static table = Table.AUTHORS;

  // Define the associations for this model
  static associations: Associations = {
    [Table.LOCAL_MANGAS]: {
      type: 'belongs_to', // The Author belongs to a LocalManga
      key: LOCAL_MANGA_ID, // The foreign key used to reference the LocalManga
    },
  };

  // Define the name field for the Author model
  @field('name') name!: string;

  // Define the relation to the LocalManga model
  @relation(Table.LOCAL_MANGAS, LOCAL_MANGA_ID) manga!: Relation<LocalManga>;
}
