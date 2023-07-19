import Realm from 'realm';
import {
  Manga,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';
import { ISOLangCode } from '@mangayomu/language-codes';
import { SORT_CHAPTERS_BY } from '@database/schemas/Manga';

export interface ILocalManga
  extends Omit<Manga, 'link'>,
    Partial<WithStatus & WithAuthors & WithHentai & WithRating> {
  _id: string;
  availableLanguages: ISOLangCode[];
  sortChaptersBy: keyof typeof SORT_CHAPTERS_BY;
  reversedSort: boolean;
  description: string | null;
}

export class LocalMangaSchema extends Realm.Object<ILocalManga> {
  _id!: string;
  title!: string;
  imageCover!: string;
  source!: string;
  description!: string | null;
  genres!: Set<string>;
  chapters!: string[];
  authors?: string[];
  isHentai?: boolean;
  rating?: WithRating['rating'];
  status?: WithStatus['status'];
  sortChaptersBy!: keyof typeof SORT_CHAPTERS_BY;
  reversedSort!: boolean;
  availableLanguages!: ISOLangCode[];

  static schema: Realm.ObjectSchema = {
    name: 'LocalManga',
    properties: {
      _id: 'string',
      title: 'string',
      imageCover: 'string',
      source: 'string',
      description: 'mixed',
      genres: 'string<>',
      chapters: 'string[]',
      authors: { type: 'string[]', default: [] },
      isHentai: { type: 'bool', default: false },
      rating: 'MangaRating?',
      status: 'MangaStatus?',
      availableLanguages: 'string[]',
      sortChaptersBy: { type: 'string', default: 'Chapter number' },
      reversedSort: { type: 'bool', default: true },
    },
    primaryKey: '_id',
  };
}
