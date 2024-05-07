import { ISOLangCode } from '@mangayomu/language-codes';
import { ILocalChapterSchema } from '@mangayomu/schemas';
import Realm from 'realm';

export class LocalChapterSchema extends Realm.Object<ILocalChapterSchema> {
  _id!: string;
  _mangaId!: string;
  name!: string;
  subname?: string | null;
  index!: number;
  language!: ISOLangCode;
  date!: number;

  static schema: Realm.ObjectSchema = {
    name: 'LocalChapter',
    properties: {
      _id: 'string',
      _mangaId: 'string',
      name: 'string',
      subname: { type: 'string', optional: true },
      index: 'int',
      language: 'string',
      date: 'int',
    },
    primaryKey: '_id',
  };
}
