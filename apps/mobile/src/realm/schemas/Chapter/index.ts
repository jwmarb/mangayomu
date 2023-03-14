import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper';
import Realm from 'realm';

export interface IChapterSchema extends MangaChapter {
  scrollPositionLandscape?: number;
  scrollPositionPortrait?: number;
  indexPage?: number;
  dateRead?: number;
  language?: ISOLangCode;
  _mangaId: string;
  _id: string;
  _realmId: string;
}

export class ChapterSchema extends Realm.Object<IChapterSchema> {
  scrollPositionLandscape!: number;
  scrollPositionPortrait!: number;
  indexPage!: number;
  dateRead?: number;
  link!: string;
  name!: string;
  index!: number;
  date!: string;
  language?: ISOLangCode;
  _mangaId!: string;
  _id!: string;
  _realmId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    properties: {
      _id: 'string',
      _realmId: 'string',
      name: 'string',
      index: 'int',
      date: 'string',
      _mangaId: 'string',
      language: { type: 'string', default: 'en' },
      scrollPositionLandscape: { type: 'int', default: 0 },
      scrollPositionPortrait: { type: 'int', default: 0 },
      indexPage: { type: 'int', default: 0 },
      dateRead: 'int?',
      link: 'string',
    },
    primaryKey: '_id',
  };
}
