import { ISOLangCode } from '@mangayomu/language-codes';
import { BSON } from 'realm';

export interface IChapterSchema {
  scrollPosition?: number;
  savedScrollPositionType: 'landscape' | 'portrait';
  numberOfPages?: number;
  indexPage: number;
  dateRead?: number;
  language: ISOLangCode;
  link: string;
  _mangaId: string;
  _id: BSON.ObjectId;
  _realmId: string;
}

export type RequiredChapterSchemaFields = GetRequiredProperties<
  IChapterSchema,
  'savedScrollPositionType' | 'indexPage'
>;
