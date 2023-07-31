import { ISOLangCode } from '@mangayomu/language-codes';

export interface IChapterSchema {
  scrollPosition?: number;
  savedScrollPositionType: 'landscape' | 'portrait';
  numberOfPages?: number;
  indexPage: number;
  dateRead?: number;
  language: ISOLangCode;
  _mangaId: string;
  _id: string;
  _realmId: string;
}

export type RequiredChapterSchemaFields = GetRequiredProperties<
  IChapterSchema,
  'savedScrollPositionType' | 'indexPage'
>;
