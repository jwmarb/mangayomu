import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper';
import { Dimensions } from 'react-native';
import Realm from 'realm';

export interface IChapterSchema extends MangaChapter {
  scrollPosition?: number;
  savedScrollPositionType?: 'landscape' | 'portrait';
  numberOfPages?: number;
  indexPage?: number;
  dateRead?: number;
  language?: ISOLangCode;
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
      numberOfPages: 'int?',
      language: { type: 'string', default: 'en' },
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
      link: 'string',
    },
    primaryKey: '_id',
  };
}
