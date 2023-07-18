import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper/src';
import { Dimensions } from 'react-native';
import Realm from 'realm';

export interface IChapterSchema {
  scrollPosition?: number;
  savedScrollPositionType?: 'landscape' | 'portrait';
  numberOfPages?: number;
  indexPage: number;
  dateRead?: number;
  language: ISOLangCode;
  _mangaId: string;
  _id: string;
  _realmId: string;
}

export class ChapterSchema extends Realm.Object<IChapterSchema> {
  scrollPosition?: number;
  savedScrollPositionType!: 'landscape' | 'portrait';
  indexPage!: number;
  numberOfPages?: number;
  dateRead?: number;
  _mangaId!: string;
  _id!: string;
  _realmId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    properties: {
      _id: 'string',
      _realmId: 'string',
      _mangaId: 'string',
      numberOfPages: 'int?',
      scrollPosition: 'int?',
      savedScrollPositionType: {
        type: 'string',
        default: () => {
          const { width, height } = Dimensions.get('window');
          if (height > width) return 'portrait';
          return 'landscape';
        },
      },
      indexPage: { type: 'int', default: 0 },
      dateRead: 'int?',
    },
    primaryKey: '_id',
  };
}

export function isChapterSchema(x: unknown): x is ChapterSchema {
  return typeof x === 'object' && x != null && '_realmId' in x;
}
