import {
  IChapterSchema,
  RequiredChapterSchemaFields,
} from '@mangayomu/schemas';
import { Dimensions } from 'react-native';
import Realm from 'realm';

export class ChapterSchema extends Realm.Object<
  IChapterSchema,
  RequiredChapterSchemaFields
> {
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
