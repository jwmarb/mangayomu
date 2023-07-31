import { ISOLangCode } from '@mangayomu/language-codes';
import { ILocalChapterSchema } from '@mangayomu/schemas';
import Realm from 'realm';

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
