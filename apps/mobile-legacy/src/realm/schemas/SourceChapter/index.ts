import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaChapter } from '@mangayomu/mangascraper/src';

export interface SourceChapter extends MangaChapter {
  _id: string;
  _mangaId: string;
  language: ISOLangCode;
  pages: { width: number; height: number }[];
}
