import { MangaChapter } from '@mangayomu/mangascraper';
import Realm from 'realm';

export interface IChapterSchema extends MangaChapter {
  scrollPositionLandscape?: number;
  scrollPositionPortrait?: number;
  indexPage?: number;
  dateRead?: string;
}

export class ChapterSchema extends Realm.Object<IChapterSchema> {
  scrollPositionLandscape!: number;
  scrollPositionPortrait!: number;
  indexPage!: number;
  dateRead?: string;
  link!: string;
  name?: string | null;
  index!: number;
  date!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    properties: {
      link: 'string',
      name: 'string?',
      index: 'int',
      date: 'string',
      scrollPositionLandscape: { type: 'int', default: 0 },
      scrollPositionPortrait: { type: 'int', default: 0 },
      indexPage: { type: 'int', default: 0 },
      dateRead: 'string?',
    },
  };
}
