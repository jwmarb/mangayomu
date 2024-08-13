import { Collection, Database, Model, Q, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, field, relation } from '@nozbe/watermelondb/decorators';
import { CURRENTLY_READING_CHAPTER_ID, MANGA_ID, Table } from '@/models/schema';
import { Manga } from '@/models/Manga';
import { MangaChapter } from '@mangayomu/mangascraper';

type ChapterDefaults = Omit<
  {
    [K in keyof Chapter as Chapter[K] extends string | number
      ? K
      : never]: Chapter[K];
  },
  'id' | 'syncStatus' | 'table' | 'link'
>;

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

  public static async toChapter(
    chapter: MangaChapter,
    database: Database,
    defaults?: ChapterDefaults,
  ) {
    const chapters = database.get<Chapter>(Table.CHAPTERS);
    const found = await chapters.query(Q.where('link', chapter.link));

    if (found.length === 0) {
      if (defaults == null) {
        throw new Error(
          'Could not find an existing chapter. Defaults must be provided to create it',
        );
      }
      return database.write(() => this.create(chapter, chapters, defaults));
    }

    return found[0];
  }

  static create(
    chapter: MangaChapter,
    chapters: Collection<Chapter>,
    defaults: ChapterDefaults,
  ) {
    return chapters.create((self) => {
      self.link = chapter.link;
      self.pagesCount = defaults.pagesCount;
      self.currentPage = defaults.currentPage;
      self.scrollPosition = defaults.scrollPosition;
    });
  }
}
