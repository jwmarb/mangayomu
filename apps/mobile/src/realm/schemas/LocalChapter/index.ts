import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper/src';
import Realm from 'realm';

export interface ILocalChapterSchema extends Omit<MangaChapter, 'link'> {
  _id: string;
  _mangaId: string;
}

export class LocalChapterSchema extends Realm.Object<ILocalChapterSchema> {
  _id!: string;
  _mangaId!: string;
  name!: string;
  index!: number;
  language!: ISOLangCode;
  date!: string;

  static schema: Realm.ObjectSchema = {
    name: 'LocalChapter',
    properties: {
      _id: 'string',
      _mangaId: 'string',
      name: 'string',
      index: 'int',
      language: 'string',
      date: 'string',
    },
    primaryKey: '_id',
  };
}
