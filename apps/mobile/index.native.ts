import { Database, appSchema, tableSchema } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Model } from '@nozbe/watermelondb';
import { date, field, text } from '@nozbe/watermelondb/decorators';
import type { ISOLangCode } from '@mangayomu/language-codes';
import {
  ImageScaling,
  ReadingDirection,
  ReadingOrientation,
  Table,
  ZoomStartPosition,
  schema,
} from '@/models/schema';
import { Genre } from '@/models/Genre';
import { Manga } from '@/models/Manga';
import { LocalManga } from '@/models/LocalManga';
import { LocalChapter } from '@/models/LocalChapter';
import { Chapter } from '@/models/Chapter';
import { Author } from '@/models/Author';
import { HistoryEntry } from '@/models/HistoryEntry';

const adapter = new SQLiteAdapter({
  schema,
  // migrations
  onSetUpError: function (error) {
    // todo: resolve this error later
    console.error(error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Manga,
    Chapter,
    Genre,
    LocalManga,
    LocalChapter,
    Author,
    HistoryEntry,
  ],
});
