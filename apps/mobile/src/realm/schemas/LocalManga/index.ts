import Realm from 'realm';
import {
  Manga,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';
import { ISOLangCode } from '@mangayomu/language-codes';

export interface ILocalManga
  extends Omit<Manga, 'link'>,
    Partial<WithStatus & WithAuthors & WithHentai & WithRating> {
  _id: string;
  availableLanguages: ISOLangCode[];
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
    },
    primaryKey: '_id',
  };
}
