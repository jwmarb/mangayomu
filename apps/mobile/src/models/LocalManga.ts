import { Database, Model, Q, Query } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { children, date, field, json } from '@nozbe/watermelondb/decorators';
import {
  InvalidSourceException,
  Manga,
  MangaMeta,
  MangaSource,
} from '@mangayomu/mangascraper';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import type { ISOLangCode } from '@mangayomu/language-codes';
import {
  ChapterSortOption,
  LOCAL_MANGA_ID,
  Selector,
  Table,
  UseRowOptions,
} from '@/models/schema';
import { LocalChapter } from '@/models/LocalChapter';
import { Genre } from '@/models/Genre';
import { Author } from '@/models/Author';
import { isChapter } from '@/utils/helpers';

function rawSanitizer(s: unknown) {
  return s;
}

/**
 * The `LocalManga` class represents a manga entry in the local database. It includes methods for fetching related data,
 * converting external data to the local model, and observing changes in the database.
 *
 * @extends Model - This class extends the base `Model` class provided by the ORM library.
 */
export class LocalManga extends Model {
  // Define the table for this model in the database
  static table = Table.LOCAL_MANGAS;

  // Define associations with other tables in the database using foreign keys.
  // These allow us to link related data together and easily query it.
  static associations: Associations = {
    [Table.LOCAL_CHAPTERS]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.GENRES]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.AUTHORS]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
    [Table.HISTORY_ENTRIES]: {
      type: 'has_many',
      foreignKey: LOCAL_MANGA_ID,
    },
  };

  // Define fields for the LocalManga model. These represent columns in the database table.
  @field('link') link!: string; // The source URL or ID of this manga
  @field('title') title!: string; // The title of the manga

  // Specify the source from which this manga was retrieved, such as a specific website or service
  @field('source') source!: string;

  // Optional fields for additional metadata about the manga. These may not always be available.
  @field('description') description?: string | null;
  @field('image_cover') imageCover?: string | null;
  @field('language') language?: ISOLangCode | null;
  @field('is_hentai') isHentai?: boolean | null;
  @field('scan_status') scanStatus?: string | null;
  @field('publish_status') publishStatus?: string | null;
  @field('type') type?: string | null;
  @field('year_released') yearReleased?: number | null;

  // Fields related to the publication date of the manga. These may not always be available.
  @date('date_published') datePublished?: Date | null;
  @date('date_modified') dateModified?: Date | null;

  // Optional fields for rating information about the manga
  @field('is_rating_value_na') isRatingValueNA?: boolean | null;
  @field('rating_value') ratingValue?: number | null;
  @field('vote_count') voteCount?: number | null;

  // Indicates whether this manga is an official translation of a foreign work.
  @field('is_official_translation') isOfficialTranslation?: boolean;

  // Fields that define how the manga's chapters are sorted
  @field('sort_chapters_by') sortChaptersBy!: ChapterSortOption;
  @field('is_sort_reversed') isSortReversed!: boolean;

  // Queries for related data. These allow us to easily access associated records.
  @children(Table.LOCAL_CHAPTERS) chapters!: Query<LocalChapter>;
  @children(Table.GENRES) _dbGenres!: Query<Genre>;
  @children(Table.AUTHORS) _dbAuthors!: Query<Author>;

  // Raw JSON data stored for the manga so that it can be used to be passed into parameters of the source's methods
  @json('raw_json', rawSanitizer) raw!: unknown;

  /**
   * Fetches and returns an array of genre names associated with the manga.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of strings representing the genres.
   */
  get genres() {
    return this._dbGenres.fetch().then((a) => a.map((x) => x.name));
  }

  /**
   * Fetches and returns an array of author names associated with the manga.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of strings representing the authors.
   */
  get authors() {
    return this._dbAuthors.fetch().then((a) => a.map((x) => x.name));
  }

  /**
   * Returns the rating information for the manga, including the value and vote count.
   *
   * @returns {undefined | {value: string | number; voteCount: number}} The rating object with `value` (which can be 'N/A' or a numeric rating) and `voteCount`, or undefined if no rating is available.
   */
  get rating() {
    if (this.ratingValue == null) return undefined;
    return {
      value: this.isRatingValueNA ? ('N/A' as const) : this.ratingValue,
      voteCount: this.voteCount ?? 0,
    };
  }

  /**
   * Retrieves comprehensive metadata about the manga.
   *
   * This method asynchronously fetches and combines various pieces of information
   * related to the manga, including authors, genres, and chapters. The resulting
   * object contains detailed metadata that can be used for display or further
   * processing.
   *
   * @pre    The `authors`, `genres`, and `chapters` properties must be defined and
   *         should return Promises that resolve to arrays of their respective types.
   *         All other properties (e.g., `title`, `link`, etc.) should be properly set.
   * @post   The method returns a Promise that resolves to an object containing the
   *         combined metadata. This object includes all relevant details about the manga,
   *         such as its title, link, source, image cover, description, language, and more.
   *
   * @returns A Promise that resolves to an object containing detailed metadata about the manga.
   *          The object includes properties like `title`, `link`, `source`, `imageCover`,
   *          `description`, `language`, `isHentai`, `status`, `type`, `yearReleased`,
   *          `genres`, `date`, `authors`, `chapters`, `officialTranslation`, and `rating`.
   */
  get meta(): Promise<Manga & MangaMeta> {
    return new Promise((res) => {
      Promise.all([this.authors, this.genres, this.chapters]).then(
        ([authors, genres, chapters]) =>
          res({
            title: this.title,
            link: this.link,
            source: this.source,
            imageCover: this.imageCover,
            description: this.description,
            language: this.language,
            isHentai: this.isHentai ?? undefined,
            status:
              this.publishStatus != null
                ? {
                    scan: this.scanStatus,
                    publish: this.publishStatus,
                  }
                : undefined,
            type: this.type ?? undefined,
            yearReleased: this.yearReleased?.toString(),
            genres,
            date:
              this.datePublished != null && this.dateModified != null
                ? {
                    modified: this.dateModified.getTime(),
                    published: this.datePublished.getTime(),
                  }
                : undefined,
            authors,
            chapters,
            officialTranslation: this.isOfficialTranslation,
            rating: this.rating,
          }),
      );
    });
  }

  /**
   * Converts the properties of the LocalManga object into a standardized Manga object.
   *
   * @returns A new Manga object containing:
   *   - `source`: The source identifier of the manga.
   *   - `imageCover`: The URL or path to the manga cover image.
   *   - `language`: The language of the manga.
   *   - `link`: A link associated with the manga entry.
   *   - `title`: The title of the manga.
   */
  public toManga(): Manga {
    return {
      source: this.source,
      imageCover: this.imageCover,
      language: this.language,
      link: this.link,
      title: this.title,
    } as Manga;
  }

  /**
   * Converts and synchronizes manga data to the LocalManga model in the database.
   * This method takes raw manga data and metadata, processes it, and either updates an existing
   * LocalManga entry or creates a new one. It also handles the creation of associated chapters and genres.
   *
   * @pre    The `data` object must contain valid manga information, including a unique link.
   *         The `rawData` should be provided for additional context.
   *         The `database` must be an active instance of the Database class with accessible collections
   *         for LocalManga, LocalChapter, and Genre.
   * @post   If a LocalManga entry with the same link already exists, it is updated with the new data.
   *         If no such entry exists, a new one is created. Associated chapters are either updated or created,
   *         and genres are added if they do not already exist. The database operations are performed in a transaction.
   *
   * @param {Manga & MangaMeta} data - An object containing manga information and metadata.
   *                                  This includes fields like title, link, source, description, imageCover, language,
   *                                  isHentai, status (scan and publish), type, yearReleased, date (modified and published),
   *                                  officialTranslation, rating (voteCount and value), and chapters.
   * @param {unknown} rawData - Raw data associated with the manga, used for additional context.
   * @param {Database} database - An instance of the Database class that provides access to the LocalManga,
   *                              LocalChapter, and Genre collections.
   *
   * @returns {Promise<void>} A promise that resolves when all database operations are completed successfully.
   */
  static async toLocalManga(
    data: Manga & MangaMeta,
    rawData: unknown,
    database: Database,
  ) {
    // Function to set fields of the LocalManga model based on provided data
    function addFields(_model: Model) {
      const model = _model as LocalManga;
      model.title = data.title;
      model.link = data.link;
      model.source = data.source;
      model.description = data.description;
      model.imageCover = data.imageCover;
      model.language = data.language;
      model.isHentai = data.isHentai;
      model.scanStatus = data.status?.scan;
      model.publishStatus = data.status?.publish;
      model.type = data.type;
      model.yearReleased =
        data.yearReleased != null ? parseInt(data.yearReleased) : null;
      model.dateModified = data.date ? new Date(data.date.modified) : null;
      model.datePublished = data.date ? new Date(data.date.published) : null;
      model.isOfficialTranslation = data.officialTranslation;
      model.voteCount = data.rating?.voteCount;
      model.ratingValue = data.rating?.value === 'N/A' ? 0 : data.rating?.value;
      model.isRatingValueNA = data.rating?.value === 'N/A';
      model.sortChaptersBy =
        model.sortChaptersBy ?? ChapterSortOption.CHAPTER_NUMBER;
      model.isSortReversed = model.isSortReversed ?? false;
      model.raw = rawData;
    }

    // Get the collections for LocalManga, LocalChapter, and Genre
    const localMangas = database.get<LocalManga>(Table.LOCAL_MANGAS);
    const localChapters = database.get<LocalChapter>(Table.LOCAL_CHAPTERS);
    const localGenres = database.get<Genre>(Table.GENRES);

    // Query for existing LocalManga and its associated chapters
    const [existingLocalManga, existingLocalChapters] = await Promise.all([
      localMangas.query(Q.where('link', data.link)),
      localChapters.query(Q.on(Table.LOCAL_MANGAS, Q.where('link', data.link))),
    ]);

    let preparedUpdate: LocalManga;

    // If the manga already exists, prepare an update
    if (existingLocalManga.length > 0) {
      preparedUpdate = existingLocalManga[0].prepareUpdate(
        addFields,
      ) as LocalManga;
    }
    // Otherwise, create a new manga entry
    else {
      preparedUpdate = localMangas.prepareCreate(addFields) as LocalManga;
    }

    // Prepare operations to update or create chapters and genres
    const operations: Model[] = existingLocalChapters
      .map<Model>((x) => x.prepareDestroyPermanently())
      .concat(
        data.chapters.map((x) =>
          localChapters.prepareCreate((record) => {
            const source = MangaSource.getSource(data.source);
            if (source == null) throw new InvalidSourceException(data.source);
            const localChapter = record as LocalChapter;
            const l = isChapter(x) ? x : source.toChapter(x, rawData);
            localChapter.name = l.name;
            localChapter.subname = l.subname;
            localChapter.date = new Date(l.date);
            localChapter.link = l.link;
            localChapter.manga.set(preparedUpdate);
          }),
        ),
      )
      .concat(
        data.genres?.map((x) =>
          localGenres.prepareCreate((record) => {
            record.name = x;
            record.manga.set(preparedUpdate);
          }),
        ) ?? [],
      );

    // Add the prepared update to the operations
    operations.push(preparedUpdate);

    // Perform the database write operation in a transaction
    await database.write(async () => {
      await database.batch(operations);
    });
  }

  /**
   * A hook that observes and retrieves data from a local manga entry in the database.
   *
   * This function initializes an observer to watch changes in the `LOCAL_MANGAS` table
   * based on the provided `manga.link`. It uses a selector to extract specific data
   * from the observed manga and provides options for initialization and update callbacks.
   *
   * @pre    The `database` must be available and connected to the database.
   *         The `manga.link` must be a valid link that exists in the `LOCAL_MANGAS` table.
   *         The `selector` function must be provided and should return the desired data type.
   * @post   An observer is set up to watch changes in the `LOCAL_MANGAS` table for the
   *         specified manga. The selected state is updated whenever the observed manga
   *         changes. If initialization or update callbacks are provided, they will be
   *         invoked accordingly.
   *
   * @param manga - An object containing the link of the manga to observe.
   * @param selector - A function that takes a `LocalManga` object and returns the desired data type.
   * @param options - Optional configuration for the hook:
   *   - `onInitialize`: A callback function to be called when the manga is first initialized.
   *   - `onUpdate`: A callback function to be called whenever the manga is updated after initialization.
   *   - `default`: The default value to return if no state is available and no `default` option is provided.
   *
   * @returns The selected data from the observed manga or the default value if provided.
   */
  static useRow<T, TDefault = T | undefined>(
    manga: Pick<Manga, 'link'>,
    selector: Selector<T, LocalManga>,
    options?: UseRowOptions<TDefault, LocalManga>,
  ): TDefault {
    const database = useDatabase();
    const [state, setState] = React.useState<T>();
    const id = React.useRef<string>('');

    // Initialize the observer for the manga with the given link
    React.useEffect(() => {
      function initialize() {
        const observer = database
          .get(Table.LOCAL_MANGAS)
          .query(Q.where('link', manga.link))
          .observe();

        const callback = (updated: Model[]) => {
          if (updated.length > 0) {
            const [localManga] = updated;
            id.current = localManga.id;
            setState(selector(localManga as LocalManga));
            if (options?.onInitialize != null)
              options.onInitialize(localManga as LocalManga);
          }
        };

        const subscription = observer.subscribe(callback);

        return () => {
          subscription.unsubscribe();
        };
      }

      // Listen for changes to the manga after it has been initialized
      async function listenToChanges() {
        const observer = database
          .get(Table.LOCAL_MANGAS)
          .findAndObserve(id.current);

        let init = false;

        const callback = (updated: Model) => {
          setState(selector(updated as LocalManga));
          if (init && options?.onUpdate != null)
            options.onUpdate(updated as LocalManga);
          else {
            init = true;
          }
        };

        const subscription = observer.subscribe(callback);
        return () => {
          subscription.unsubscribe();
        };
      }

      // Initialize the manga if it hasn't been initialized yet
      if (state == null) {
        initialize();
      } else {
        listenToChanges();
      }
    }, [state != null]);

    // Return the selected state or the default value if provided
    return (state as TDefault | undefined) ?? (options?.default as TDefault);
  }
}
