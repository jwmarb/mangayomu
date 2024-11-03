import { Collection, Database, Model, Q, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, field, relation } from '@nozbe/watermelondb/decorators';
import {
  CURRENTLY_READING_CHAPTER_ID,
  MANGA_ID,
  Selector,
  Table,
} from '@/models/schema';
import { Manga } from '@/models/Manga';
import { MangaChapter } from '@mangayomu/mangascraper';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

// Define a type `ChapterDefaults` that omits certain properties from the `Chapter` model.
// This type is used to create an object with only the string or number fields of the `Chapter` model,
// excluding specific fields like `id`, `syncStatus`, `table`, and `link`.
type ChapterDefaults = Omit<
  {
    [K in keyof Chapter as Chapter[K] extends string | number
      ? K
      : never]: Chapter[K];
  },
  'id' | 'syncStatus' | 'table' | 'link'
>;

/**
 * Represents a chapter of a manga.
 *
 * @property {string} link - The unique link to the chapter.
 * @property {Relation<Manga>} manga - The relation to the Manga model, using `MANGA_ID` as the foreign key.
 * @property {number} pagesCount - The total number of pages in the chapter.
 * @property {number} currentPage - The current page being read.
 * @property {number} scrollPosition - The scroll position on the current page.
 * @property {Date} updatedAt - When the chapter was last updated.
 * @property {Date} createdAt - When the chapter was created.
 */
export class Chapter extends Model {
  static table = Table.CHAPTERS;
  static associations: Associations = {
    [Table.MANGAS]: {
      type: 'has_many',
      foreignKey: CURRENTLY_READING_CHAPTER_ID,
    },
  };

  // Define the `link` field, which is a string representing the unique link to the chapter
  @field('link') link!: string;

  // Define the relation to the Manga model using the `MANGA_ID` as the foreign key
  @relation(Table.MANGAS, MANGA_ID) manga!: Relation<Manga>;

  // Define the `pagesCount` field, which is a number representing the total number of pages in the chapter
  @field('pages_count') pagesCount!: number;

  // Define the `currentPage` field, which is a number representing the current page being read
  @field('current_page') currentPage!: number;

  // Define the `scrollPosition` field, which is a number representing the scroll position on the current page
  @field('scroll_position') scrollPosition!: number;

  // Define the `updatedAt` field, which is a date representing when the chapter was last updated
  @date('updated_at') updatedAt!: Date;

  // Define the `createdAt` field, which is a date representing when the chapter was created
  @date('created_at') createdAt!: Date;

  /**
   * Converts a `MangaChapter` object to a `Chapter` model.
   *
   * This method checks if a chapter with the given link already exists in the database.
   * If it does not exist and defaults are provided, it creates a new chapter with the given defaults.
   * If the chapter is found or created successfully, it returns the `Chapter` model instance.
   *
   * @param {MangaChapter} chapter - The `MangaChapter` object to convert.
   * @param {Database} database - The WatermelonDB database instance.
   * @param {ChapterDefaults} [defaults] - Optional defaults for creating a new chapter if it does not exist.
   * @returns {Promise<Chapter>} - A promise that resolves to the `Chapter` model instance.
   * @throws {Error} - Throws an error if the chapter is not found and no defaults are provided.
   */
  public static async toChapter(
    chapter: MangaChapter,
    database: Database,
    defaults?: ChapterDefaults,
  ) {
    // Get the collection of chapters from the database
    const chapters = database.get<Chapter>(Table.CHAPTERS);

    // Query the database to find a chapter with the given link
    const found = await chapters.query(Q.where('link', chapter.link));

    // If no chapter is found with the given link
    if (found.length === 0) {
      // If defaults are not provided, throw an error
      if (defaults == null) {
        throw new Error(
          'Could not find an existing chapter. Defaults must be provided to create it',
        );
      }

      // Create a new chapter with the provided defaults
      return database.write(() => this.create(chapter, chapters, defaults));
    }

    // If a chapter is found, return the first matching chapter
    return found[0];
  }

  /**
   * Creates a new `Chapter` model instance.
   *
   * This method is called within the `toChapter` static method when a chapter with the given link does not exist in the database.
   * It uses the provided defaults to set the initial values of the chapter fields.
   *
   * @param {MangaChapter} chapter - The `MangaChapter` object from which to extract the link.
   * @param {Collection<Chapter>} chapters - The collection of `Chapter` models in the database.
   * @param {ChapterDefaults} defaults - The default values for creating a new chapter.
   * @returns {Promise<Chapter>} - A promise that resolves to the newly created `Chapter` model instance.
   */
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

  /**
   * Observes a `MangaChapter` and returns the corresponding `Chapter` model.
   *
   * This method uses WatermelonDB's reactive capabilities to observe changes to the chapter in the database.
   * It can be used within React components to automatically update when the observed chapter changes.
   *
   * @param {MangaChapter} chapter - The `MangaChapter` object to observe.
   * @param {Selector<T, Chapter>} [selector] - Optional selector function to transform the observed data.
   * @param {(previous: T | undefined, selected: T) => boolean} [arePropsSame] - Optional function to determine if the observed chapter has changed.
   * @returns {T | undefined} - The observed `Chapter` model instance, transformed by the selector if provided.
   */
  public static useObservation<T = Chapter>(
    chapter: MangaChapter,
    selector?: Selector<T, Chapter>,
    arePropsSame?: (previous: T | undefined, selected: T) => boolean,
  ): T | undefined {
    // Get the WatermelonDB database instance using the `useDatabase` hook.
    const database = useDatabase();

    // Initialize state to hold the observed chapter data.
    const [state, setState] = React.useState<T>();

    // Use a useEffect hook to set up and manage the subscription to the chapter query.
    React.useEffect(() => {
      // Define an async function to initialize the observer and subscription.
      async function initialize() {
        // Query the chapters collection for a chapter with the given link and observe changes.
        const observer = database
          .get<Chapter>(Table.CHAPTERS)
          .query(Q.where('link', chapter.link))
          .observe();

        // Subscribe to the query results.
        const subscription = observer.subscribe((results) => {
          if (results.length > 0) {
            // Extract the first found chapter from the results.
            const [foundChapter] = results;

            // Update the state with the observed chapter, optionally transformed by the selector function.
            setState((prev) => {
              const selected = selector?.(foundChapter) ?? (foundChapter as T);

              // Check if the new state is different from the previous state using the `arePropsSame` function.
              if (arePropsSame?.(prev, selected) ?? selected === prev) {
                return prev;
              }

              // Return the new state if it is different.
              return selected;
            });
          }
        });

        // Clean up the subscription when the component unmounts or the effect runs again.
        return () => {
          subscription.unsubscribe();
        };
      }

      // Call the initialize function to set up the observer and subscription.
      initialize();
    }, []);

    return state;
  }
}
