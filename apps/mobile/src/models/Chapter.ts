import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, field, relation } from '@nozbe/watermelondb/decorators';
import { CURRENTLY_READING_CHAPTER_ID, MANGA_ID, Table } from '@/models/schema';
import { Manga } from '@/models/Manga';

export class Chapter extends Model {
  static table = Table.CHAPTERS;
  static associations: Associations = {
    [Table.MANGAS]: {
      type: 'has_many',
      foreignKey: CURRENTLY_READING_CHAPTER_ID,
    },
  };

  @field('link') link!: string;
  @relation(Table.MANGAS, MANGA_ID) manga!: Relation<Manga>;

  @field('pages_count') pagesCount!: number;
  @field('current_page') currentPage!: number;
  @field('scroll_position') scrollPosition!: number;

  @date('updated_at') updatedAt!: Date;
  @date('created_at') createdAt!: Date;
}
