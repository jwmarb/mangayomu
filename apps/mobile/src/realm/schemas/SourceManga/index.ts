import { ISOLangCode } from '@mangayomu/language-codes';
import {
  Manga,
  MangaMeta,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';

export interface SourceManga
  extends Omit<MangaMeta, 'link' | 'chapters'>,
    Omit<Manga, 'link'>,
    Partial<WithAuthors>,
    Partial<WithStatus>,
    Partial<WithHentai>,
    Partial<WithRating> {
  _id: string;
  chapters: string[];
  availableLanguages: ISOLangCode[];
}
