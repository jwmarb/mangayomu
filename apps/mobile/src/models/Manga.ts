import { date, field, relation } from '@nozbe/watermelondb/decorators';
import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import type { ISOLangCode } from '@mangayomu/language-codes';
import {
  CURRENTLY_READING_CHAPTER_ID,
  ImageScaling,
  ReadingDirection,
  ReadingOrientation,
  Table,
  ZoomStartPosition,
} from '@/models/schema';
import { Chapter } from '@/models/Chapter';

export class Manga extends Model {
  static table = Table.MANGAS;
  static associations: Associations = {
    [Table.CHAPTERS]: { type: 'belongs_to', key: CURRENTLY_READING_CHAPTER_ID },
  };

  @field('title') title!: string;
  @relation(Table.CHAPTERS, CURRENTLY_READING_CHAPTER_ID)
  currentlyReadingChapter?: Relation<Chapter>;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // UNIX timestamp for algorithms
  @field('date_added_in_library') dateAddedInLibrary?: number | null;
  @field('is_in_library') isInLibrary!: boolean;

  @field('selected_language') selectedLanguage!: ISOLangCode;

  @field('reading_direction') readingDirection!: ReadingDirection;
  @field('page_image_scaling') imageScaling!: ImageScaling;
  @field('page_zoom_start_position') zoomStartPosition!: ZoomStartPosition;
  @field('reading_orientation') readingOrientation!: ReadingOrientation;

  @field('new_chapters_count') newChaptersCount!: number;
}
