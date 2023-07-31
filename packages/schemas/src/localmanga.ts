import {
  Manga,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';
import { ISOLangCode } from '@mangayomu/language-codes';
import { SortChaptersBy } from './localchapter';

export interface ILocalManga
  extends Omit<Manga, 'link'>,
    Partial<WithStatus>,
    WithAuthors,
    WithHentai,
    Partial<WithRating> {
  _id: string;
  availableLanguages: ISOLangCode[];
  sortChaptersBy: SortChaptersBy;
  reversedSort: boolean;
  description: string | null;
  genres: Set<string>;
  chapters: string[];
}

export type RequiredLocalMangaSchemaFields = GetRequiredProperties<
  ILocalManga,
  'authors' | 'isHentai' | 'sortChaptersBy' | 'reversedSort'
>;
