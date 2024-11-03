import { date, field, relation } from '@nozbe/watermelondb/decorators';
import { Collection, Database, Model, Q, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import type { ISOLangCode } from '@mangayomu/language-codes';
import {
  CURRENTLY_READING_CHAPTER_ID,
  ImageScaling,
  ReadingDirection,
  ReadingOrientation,
  Selector,
  Table,
  UseRowOptions,
  ZoomStartPosition,
} from '@/models/schema';
import { Chapter } from '@/models/Chapter';
import { ReaderSettingsState } from '@/stores/settings';

/**
 * Represents a manga model in the database. This class extends the base Model and implements ReaderSettingsState.
 * It defines the structure and behavior of manga entries within the application, including associations with other models,
 * timestamps, and user preferences.
 *
 * @extends {Model}
 * @implements {ReaderSettingsState}
 */
export class Manga extends Model implements ReaderSettingsState {
  // Define the table name for this model
  static table = Table.MANGAS;

  // Define associations with other models
  static associations: Associations = {
    [Table.CHAPTERS]: { type: 'belongs_to', key: CURRENTLY_READING_CHAPTER_ID },
  };

  // Title of the manga
  @field('title') title!: string;

  // Link to the manga's source
  @field('link') link!: string;

  // Relation to the currently reading chapter
  @relation(Table.CHAPTERS, CURRENTLY_READING_CHAPTER_ID)
  currentlyReadingChapter?: Relation<Chapter>;

  // Timestamps for when the manga was created and last updated
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // UNIX timestamp indicating when the manga was added to the library
  @field('date_added_in_library') dateAddedInLibrary?: number | null;

  // Flag indicating whether the manga is in the user's library (1 for true, 0 for false)
  @field('is_in_library') isInLibrary!: 1 | 0;

  // Selected language for the manga
  @field('selected_language') selectedLanguage?: ISOLangCode | null;

  // Reading direction preference for the manga
  @field('reading_direction') readingDirection!: ReadingDirection;

  // Image scaling preference for the manga pages
  @field('page_image_scaling') imageScaling!: ImageScaling;

  // Zoom start position preference for the manga pages
  @field('page_zoom_start_position') zoomStartPosition!: ZoomStartPosition;

  // Reading orientation preference for the manga pages
  @field('reading_orientation') readingOrientation!: ReadingOrientation;

  // Count of new chapters available for the manga
  @field('new_chapters_count') newChaptersCount!: number;

  /**
   * Returns an existing manga row from the database or creates and returns it if the row does not exist.
   *
   * @description This method first attempts to find a manga entry in the database that matches the provided manga's link. If no such entry is found, it creates a new manga entry using the provided manga object and optional default values.
   *
   * @pre The `database` parameter must be a valid WatermelonDB database instance.
   *      The `manga` parameter must be a valid manga object with at least a 'link' property.
   *      The `defaults` parameter, if provided, should be an object that contains partial properties of the Manga model.
   *
   * @post If a matching manga entry is found in the database, it will be returned unchanged.
   *       If no matching entry is found, a new manga entry will be created and saved to the database, and this new entry will be returned.
   *
   * @param {MManga} manga - The manga object from a manga source. It must contain at least a 'link' property.
   * @param {Database} database - The WatermelonDB database instance used to query and write data.
   * @param {Partial<Manga>} [defaults] - Optional default values for the manga entry. These will be merged with the provided manga object if a new entry is created.
   *
   * @returns {Promise<Manga>} A promise that resolves to the existing or newly created manga row from the database.
   */
  static async toManga(
    manga: MManga,
    database: Database,
    defaults?: Partial<Manga>,
  ) {
    const mangas = database.get<Manga>(Table.MANGAS);
    const found = await mangas.query(Q.where('link', manga.link));

    if (found.length === 0) {
      return await database.write<Manga>(() => {
        return this.create(manga, mangas, defaults);
      });
    }
    return found[0];
  }

  /**
   * Creates a new manga entry in the database. This method must be wrapped with `database.write()` to ensure transactional integrity.
   *
   * @description
   * This function takes a partial manga object (containing at least the title, link, and language) and creates a new manga entry in the specified collection. Additional default values can be provided for various properties of the manga, such as date added, reading direction, and more. If these defaults are not provided, they will be set to predefined default values.
   *
   * @pre
   * - The `manga` object must contain at least the `title`, `link`, and `language` properties.
   * - The `mangas` collection must be a valid WatermelonDB collection for manga entries.
   * - The method must be called within a `database.write()` transaction block to ensure data consistency.
   *
   * @post
   * - A new manga entry is created in the database with the provided title, link, and language.
   * - Additional properties are set based on the provided defaults or predefined default values.
   * - The `mangas` collection remains unchanged except for the addition of the new manga entry.
   *
   * @param manga - An object containing at least the title, link, and language of the manga. This is a required parameter.
   * @param mangas - A WatermelonDB collection where the new manga entry will be created. This is a required parameter.
   * @param defaults - Optional partial manga object to provide default values for additional properties such as date added, reading direction, etc.
   *
   * @returns
   * The newly created manga model instance with all its properties set according to the provided parameters and defaults.
   */
  static create(
    manga: Pick<MManga, 'title' | 'link' | 'language'>,
    mangas: Collection<Manga>,
    defaults?: Partial<Manga>,
  ) {
    return mangas.create((_model) => {
      const model = _model as Manga;
      model.title = manga.title;
      model.link = manga.link;
      model.dateAddedInLibrary = defaults?.dateAddedInLibrary ?? null;
      model.isInLibrary = defaults?.isInLibrary ?? 0;
      model.selectedLanguage = manga.language;
      model.readingDirection =
        defaults?.readingDirection ?? ReadingDirection.DEFAULT;
      model.imageScaling = defaults?.imageScaling ?? ImageScaling.DEFAULT;
      model.zoomStartPosition =
        defaults?.zoomStartPosition ?? ZoomStartPosition.DEFAULT;
      model.readingOrientation =
        defaults?.readingOrientation ?? ReadingOrientation.DEFAULT;
      model.newChaptersCount = defaults?.newChaptersCount ?? 0;
    });
  }

  /**
   * Fetches or creates a manga row from the given MManga object and observes changes to it.
   * This function initializes a React component with the current state of the manga row and updates
   * the state whenever the row changes. It also provides hooks for initialization and update events.
   *
   * @pre    The `manga` parameter must be an instance of MManga, and `database` must be available
   *         from `useDatabase`. If a selector is provided, it should transform the manga model into
   *         the desired type T. If options are provided, they should include valid callback functions.
   * @post   The state will hold the current manga row or the transformed data if a selector is used.
   *         Initialization and update callbacks (if provided) will be called appropriately.
   * @param  manga        The MManga object representing the manga to observe.
   * @param  selector     An optional function that transforms the manga model into type T. If not
   *                      provided, the entire manga model is returned as type T.
   * @param  options      Optional configuration for initialization and update events:
   *                      - `onInitialize`: A callback function called once when the manga row is first
   *                        initialized.
   *                      - `onUpdate`: A callback function called whenever the manga row changes after
   *                        the initial load.
   *
   * @returns The current state of the manga row or the transformed data if a selector is used. This
   *          will be undefined until the initial fetch completes.
   */
  static useRow<T = Manga>(
    manga: MManga,
    selector?: Selector<T, Manga>,
    options?: Omit<UseRowOptions<T, Manga>, 'default'>,
  ): T | undefined {
    const database = useDatabase(); // Get the WatermelonDB instance
    const [state, setState] = React.useState<T>(); // State to hold the current manga row
    const init = React.useRef(false); // Ref to track if initialization has occurred

    React.useEffect(() => {
      async function initialize() {
        const row = await Manga.toManga(manga, database); // Fetch or create the manga row
        const observer = row.observe(); // Observe changes to the manga row
        const subscription = observer.subscribe((model: Manga) => {
          // Subscribe to changes
          if (!init.current) {
            options?.onInitialize?.(model); // Call onInitialize callback if provided
            init.current = true; // Mark initialization as complete
          } else {
            options?.onUpdate?.(model); // Call onUpdate callback if provided
          }
          setState(selector?.(model) ?? (model as T)); // Update the state with the new manga row or transformed data
        });

        return () => {
          subscription.unsubscribe(); // Unsubscribe from changes when component unmounts
        };
      }
      initialize();
    }, []); // Run the effect only once on mount

    return state;
  }

  /**
   * Observes changes to a manga entry in the database and updates the component state accordingly.
   *
   * This function uses WatermelonDB to observe changes to a specific manga entry based on its link.
   * It returns the observed manga entry or a transformed version of it, depending on the provided selector.
   * The component will re-render whenever there are changes to the observed manga entry.
   *
   * @pre    - `manga` must be an instance of `MManga`.
   *         - `database` must be available and able to query the MANGAS table.
   *         - If a `selector` is provided, it should return a value that can be compared using `arePropsSame`.
   *         - The `dependencies` array should contain all dependencies that cause the effect to re-run.
   *
   * @post   - The component state will be updated with the observed manga entry or its transformed version.
   *         - The observer will unsubscribe when the component unmounts.
   *
   * @param  {MManga} manga               - The manga entry to observe. Must have a `link` property.
   * @param  {Selector<T, Manga>} [selector] - A function that transforms the observed manga entry.
   *                                            If not provided, the manga entry itself is returned.
   * @param  {(previous: T | undefined, selected: T) => boolean} [arePropsSame] - A function to compare previous and new states.
   *                                                                               If not provided, a simple equality check is performed.
   * @param  {React.DependencyList} [dependencies=[]] - An array of dependencies that cause the effect to re-run.
   *
   * @returns {T | undefined} The observed manga entry or its transformed version. Returns `undefined` if no manga entry is found.
   */
  public static useObservation<T = Manga>(
    manga: MManga,
    selector?: Selector<T, Manga>,
    arePropsSame?: (previous: T | undefined, selected: T) => boolean,
    dependencies: React.DependencyList = [],
  ): T | undefined {
    const database = useDatabase(); // Get the WatermelonDB instance
    const [state, setState] = React.useState<T>(); // State to hold the current manga row

    React.useEffect(() => {
      async function initialize() {
        const observer = database
          .get<Manga>(Table.MANGAS)
          .query(Q.where('link', manga.link))
          .observe(); // Observe changes to the manga row
        const subscription = observer.subscribe((results) => {
          if (results.length > 0) {
            const [foundManga] = results; // Get the first result from the query
            setState((prev) => {
              const selected = selector?.(foundManga) ?? (foundManga as T); // Transform or use the manga model
              if (arePropsSame?.(prev, selected) ?? selected === prev) {
                return prev; // Return previous state if no changes are detected
              }

              return selected; // Update the state with the new manga row or transformed data
            });
          }
        });
        return () => {
          subscription.unsubscribe(); // Unsubscribe from changes when component unmounts
        };
      }
      initialize();
    }, dependencies); // Run the effect based on the provided dependencies

    return state;
  }
}
