import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper';
import Realm from 'realm';

export interface IChapterSchema extends MangaChapter {
  scrollPositionLandscape?: number;
  scrollPositionPortrait?: number;
  indexPage?: number;
  dateRead?: string;
  language?: ISOLangCode;
  manga: string;
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
  language?: ISOLangCode;
  manga!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    properties: {
      link: 'string',
      name: 'string?',
      index: 'int',
      date: 'string',
      manga: 'string',
      language: { type: 'string', default: 'en' },
      scrollPositionLandscape: { type: 'int', default: 0 },
      scrollPositionPortrait: { type: 'int', default: 0 },
      indexPage: { type: 'int', default: 0 },
      dateRead: 'string?',
    },
    primaryKey: 'link',
  };
}
