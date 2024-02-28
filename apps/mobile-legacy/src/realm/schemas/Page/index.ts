import Realm from 'realm';

export interface IPageSchema {
  width: number;
  height: number;
  _mangaId: string;
  _id: string;
  _chapterId: string;
}

export class PageSchema extends Realm.Object<IPageSchema> {
  width!: number;
  height!: number;
  _mangaId!: string;
  _id!: string;
  _chapterId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Page',
    properties: {
      _id: 'string', // page url
      _mangaId: 'string', // manga url
      _chapterId: 'string', // chapter url
      width: 'int',
      height: 'int',
    },
    primaryKey: '_id',
  };
}
