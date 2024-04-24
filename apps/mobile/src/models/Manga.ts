import { date, field, lazy, relation } from '@nozbe/watermelondb/decorators';
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
import { LocalManga } from '@/models/LocalManga';

export class Manga extends Model {
  static table = Table.MANGAS;
  static associations: Associations = {
    [Table.CHAPTERS]: { type: 'belongs_to', key: CURRENTLY_READING_CHAPTER_ID },
  };

  @field('title') title!: string;
  @field('link') link!: string;
  @relation(Table.CHAPTERS, CURRENTLY_READING_CHAPTER_ID)
  currentlyReadingChapter?: Relation<Chapter>;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // UNIX timestamp for algorithms
  @field('date_added_in_library') dateAddedInLibrary?: number | null;
  @field('is_in_library') isInLibrary!: 1 | 0;

  @field('selected_language') selectedLanguage?: ISOLangCode | null;

  @field('reading_direction') readingDirection!: ReadingDirection;
  @field('page_image_scaling') imageScaling!: ImageScaling;
  @field('page_zoom_start_position') zoomStartPosition!: ZoomStartPosition;
  @field('reading_orientation') readingOrientation!: ReadingOrientation;

  @field('new_chapters_count') newChaptersCount!: number;

  /**
   * Returns an existing manga row or creates and returns it the row does not exist
   * @param manga A manga object from a manga source
   * @param database WatermelonDB database
   * @returns
   */
  static async toManga(
    manga: MManga,
    database: Database,
    defaults?: Partial<Manga>,
  ) {
    const mangas = database.get(Table.MANGAS) as Collection<Manga>;
    const found = await mangas.query(Q.where('link', manga.link));

    if (found.length === 0) {
      return await database.write<Manga>(() => {
        return this.create(manga, database, defaults);
      });
    }
    return found[0];
  }

  /**
   * Creates a manga in the database. This must be wrapped with `database.write()`
   * @param manga A manga object from a manga source
   * @param database WatermelonDB database
   * @returns
   */
  static create(
    manga: Pick<MManga, 'title' | 'link' | 'language'>,
    database: Database,
    defaults?: Partial<Manga>,
  ) {
    return database.get<Manga>(Table.MANGAS).create((_model) => {
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

  static useRow<T>(
    manga: MManga,
    selector: Selector<T, Manga>,
    options?: Omit<UseRowOptions<T, Manga>, 'default'>,
  ): T | undefined {
    const database = useDatabase();
    const [state, setState] = React.useState<T>();
    const init = React.useRef(false);

    React.useEffect(() => {
      async function initialize() {
        const row = await Manga.toManga(manga, database);
        const observer = row.observe();
        const subscription = observer.subscribe((model: Manga) => {
          if (!init.current) {
            options?.onInitialize?.(model);
            init.current = true;
          } else {
            options?.onUpdate?.(model);
          }
          setState(selector(model));
        });

        return () => {
          subscription.unsubscribe();
        };
      }
      initialize();
    }, []);

    return state;
  }
}
