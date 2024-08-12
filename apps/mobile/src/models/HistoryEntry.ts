import { Model, Q, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  lazy,
  relation,
} from '@nozbe/watermelondb/decorators';
import { LOCAL_CHAPTER_ID, LOCAL_MANGA_ID, Table } from '@/models/schema';
import { LocalChapter } from '@/models/LocalChapter';
import { LocalManga } from '@/models/LocalManga';

export class HistoryEntry extends Model {
  static table = Table.HISTORY_ENTRIES;

  @field('local_manga_link') localMangaLink!: string;
  @field('local_chapter_link') localChapterLink!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  public get localManga(): Promise<LocalManga | null> {
    return new Promise((res) => {
      this.collections
        .get<LocalManga>(Table.LOCAL_MANGAS)
        .query(Q.where('link', this.localMangaLink))
        .then((results) => {
          if (results.length > 0) {
            res(results[0]);
          } else {
            res(null);
          }
        });
    });
  }

  public get localChapter(): Promise<LocalChapter | null> {
    return new Promise((res) => {
      this.collections
        .get<LocalChapter>(Table.LOCAL_CHAPTERS)
        .query(Q.where('link', this.localChapterLink))
        .then((results) => {
          if (results.length > 0) {
            res(results[0]);
          } else {
            res(null);
          }
        });
    });
  }
}
