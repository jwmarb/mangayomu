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

/**
 * Represents an entry in the history of manga reading.
 *
 * This class extends the base `Model` class and includes fields to store links to local manga and chapters,
 * as well as timestamps for creation and last update. It also provides methods to retrieve associated `LocalManga`
 * and `LocalChapter` objects from the database.
 */
export class HistoryEntry extends Model {
  static table = Table.HISTORY_ENTRIES;

  // Field to store the local manga link (foreign key)
  @field('local_manga_link') localMangaLink!: string;

  // Field to store the local chapter link (foreign key)
  @field('local_chapter_link') localChapterLink!: string;

  // Date field to store when the history entry was created
  @date('created_at') createdAt!: Date;

  // Date field to store when the history entry was last updated
  @date('updated_at') updatedAt!: Date;

  /**
   * Retrieves the LocalManga associated with this HistoryEntry.
   *
   * This method queries the LocalManga collection to find a record that matches
   * the `local_manga_link` of this HistoryEntry. If a matching record is found,
   * it returns the LocalManga instance; otherwise, it returns null.
   *
   * @returns {Promise<LocalManga | null>} A promise that resolves to the associated LocalManga or null if not found.
   */
  public get localManga(): Promise<LocalManga | null> {
    return new Promise((res) => {
      // Get the collection of LocalManga from the database
      this.collections
        .get<LocalManga>(Table.LOCAL_MANGAS)
        .query(Q.where('link', this.localMangaLink)) // Query for a LocalManga with the matching link
        .then((results) => {
          if (results.length > 0) {
            // Check if any results were found
            res(results[0]); // Resolve with the first result if found
          } else {
            res(null); // Resolve with null if no result was found
          }
        });
    });
  }

  /**
   * Retrieves the associated {@link LocalChapter} object from the database based on the `localChapterLink`.
   *
   * This method queries the `LocalChapters` collection to find a chapter with a matching `link` property.
   * If a matching chapter is found, it resolves the promise with the first result. Otherwise, it resolves
   * the promise with `null`.
   *
   * @returns {Promise<LocalChapter | null>} A promise that resolves to the {@link LocalChapter} object if found,
   * or `null` if no matching chapter is found.
   */
  public get localChapter(): Promise<LocalChapter | null> {
    return new Promise((res) => {
      // Get the collection of LocalChapters from the database
      this.collections
        .get<LocalChapter>(Table.LOCAL_CHAPTERS)
        .query(Q.where('link', this.localChapterLink)) // Query for a LocalChapter with the matching link
        .then((results) => {
          if (results.length > 0) {
            // Check if any results were found
            res(results[0]); // Resolve with the first result if found
          } else {
            res(null); // Resolve with null if no result was found
          }
        });
    });
  }
}
