import { ISOLangCode } from '@mangayomu/language-codes';

export interface ISourceChapterSchema {
  _id: string; // slugified url
  _mangaId: string; // normal url to manga
  _nextId: string | null; // previous chapter's _id
  _prevId: string | null; // next chapter's _id
  language: ISOLangCode;
  name: string;
  link: string;
}
