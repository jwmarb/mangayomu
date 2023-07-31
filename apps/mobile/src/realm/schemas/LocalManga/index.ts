import Realm from 'realm';
import { WithRating, WithStatus } from '@mangayomu/mangascraper/src';
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  ILocalManga,
  RequiredLocalMangaSchemaFields,
  SortChaptersBy,
} from '@mangayomu/schemas';

export class LocalMangaSchema extends Realm.Object<
  ILocalManga,
  RequiredLocalMangaSchemaFields
> {
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
  sortChaptersBy!: SortChaptersBy;
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
