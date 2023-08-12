import { ISOLangCode } from '@mangayomu/language-codes';

export interface ISourceChapterSchema {
  _id: string;
  _mangaId: string;
  language: ISOLangCode;
  name: string;
  link: string;
}
