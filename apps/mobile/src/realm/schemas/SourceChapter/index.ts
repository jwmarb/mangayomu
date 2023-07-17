import { ISOLangCode } from '@mangayomu/language-codes';

export interface SourceChapter {
  _id: string;
  _mangaId: string;
  index: number;
  language: ISOLangCode;
  pages: { width: number; height: number }[];
}
