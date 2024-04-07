import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const LOCAL_CHAPTER_ID = 'local_chapter_id';
export const LOCAL_MANGA_ID = 'local_manga_id';
export const MANGA_ID = 'manga_id';
export const CHAPTER_ID = 'chapter_id';
export const CURRENTLY_READING_CHAPTER_ID = 'cr_chapter_id';

const globalSetting = 0xf;

export enum ReadingDirection {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  VERTICAL,
  WEBTOON,
  GLOBAL = globalSetting,
}

export enum ImageScaling {
  SMART_FIT,
  FIT_SCREEN,
  FIT_WIDTH,
  FIT_HEIGHT,
  GLOBAL = globalSetting,
}

export enum ZoomStartPosition {
  AUTOMATIC,
  LEFT,
  RIGHT,
  CENTER,
  GLOBAL = globalSetting,
}

export enum ReadingOrientation {
  FREE,
  PORTRAIT,
  LANDSCAPE,
  GLOBAL = globalSetting,
}

export enum Table {
  MANGAS = 'mangas',
  CHAPTERS = 'chapters',
  LOCAL_CHAPTERS = 'local_chapters',
  LOCAL_MANGAS = 'local_mangas',
  AUTHORS = 'authors',
  GENRES = 'genres',
  HISTORY_ENTRIES = 'history_entries',
}

export const schema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: Table.MANGAS,
      columns: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: CURRENTLY_READING_CHAPTER_ID,
          type: 'string',
          isOptional: true,
        },
        {
          name: 'created_at',
          type: 'number',
        },
        {
          name: 'updated_at',
          type: 'number',
        },
        {
          name: 'date_added_in_library',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'is_in_library',
          type: 'number',
        },
        {
          name: 'selected_language',
          type: 'string',
        },
        {
          name: 'reading_direction',
          type: 'number',
        },
        {
          name: 'page_image_scaling',
          type: 'number',
        },
        {
          name: 'page_zoom_start_position',
          type: 'number',
        },
        {
          name: 'reading_orientation',
          type: 'number',
        },
        {
          name: 'new_chapters_count',
          type: 'number',
        },
      ],
    }),
    tableSchema({
      name: Table.LOCAL_MANGAS,
      columns: [
        {
          name: 'link',
          type: 'string',
          isIndexed: true,
        },
        {
          name: 'image_cover',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'language',
          isOptional: true,
          type: 'string',
        },
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'source',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'is_hentai',
          type: 'boolean',
          isOptional: true,
        },
        {
          name: 'scan_status',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'publish_status',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'type',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'year_released',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'date_published',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'date_modified',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'is_rating_value_na',
          type: 'boolean',
          isOptional: true,
        },
        {
          name: 'rating_value',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'vote_count',
          type: 'number',
          isOptional: true,
        },
        {
          name: 'is_official_translation',
          type: 'boolean',
          isOptional: true,
        },
        {
          name: 'sort_chapters_by',
          type: 'string',
        },
        {
          name: 'is_sort_reversed',
          type: 'boolean',
        },
      ],
    }),
    tableSchema({
      name: Table.AUTHORS,
      columns: [
        {
          name: LOCAL_MANGA_ID,
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
      ],
    }),
    tableSchema({
      name: Table.GENRES,
      columns: [
        {
          name: LOCAL_MANGA_ID,
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
      ],
    }),
    tableSchema({
      name: Table.LOCAL_CHAPTERS,
      columns: [
        { name: LOCAL_MANGA_ID, type: 'string' },
        { name: 'link', type: 'string', isIndexed: true },
        { name: 'language', type: 'string', isOptional: true },
        { name: 'sub_name', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'number' },
      ],
    }),
    tableSchema({
      name: Table.CHAPTERS,
      columns: [
        {
          name: 'link',
          isIndexed: true,
          type: 'string',
        },
        {
          name: MANGA_ID,
          type: 'string',
        },
        {
          name: 'pages_count',
          type: 'number',
        },
        {
          name: 'updated_at',
          type: 'number',
        },
        {
          name: 'created_at',
          type: 'number',
        },
        {
          name: 'current_page',
          type: 'number',
        },
        {
          name: 'scroll_position',
          type: 'number',
        },
      ],
    }),
    tableSchema({
      name: Table.HISTORY_ENTRIES,
      columns: [
        {
          name: LOCAL_MANGA_ID,
          isIndexed: true,
          type: 'string',
        },
        {
          name: LOCAL_CHAPTER_ID,
          isIndexed: true,
          type: 'string',
        },
        {
          name: 'created_at',
          type: 'number',
        },
        {
          name: 'updated_at',
          type: 'number',
        },
      ],
    }),
  ],
});
