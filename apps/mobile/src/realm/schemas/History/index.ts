import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import Realm from 'realm';

export interface HistorySection {
  data: MangaHistory[];
  date: number;
}

export interface MangaHistory {
  manga: Manga; // key of the manga
  chapter: MangaChapter; // key of read/current chapter
  date: number; // the exact date when this chapter was read
}

export interface IUserHistorySchema {
  _id: string;
  _realmId: string;
  history: HistorySection[];
}

export class UserHistorySchema extends Realm.Object<IUserHistorySchema> {
  _id!: string;
  _realmId!: string;
  history!: HistorySection[];
  static schema: Realm.ObjectSchema = {
    name: 'UserHistory',
    properties: {
      _id: 'string',
      _realmId: 'string',
      history: 'HistorySection[]',
    },
    primaryKey: '_id',
  };
}

export class HistorySectionSchema extends Realm.Object<HistorySection> {
  data!: MangaHistory[];
  date!: number;
  static schema: Realm.ObjectSchema = {
    embedded: true,
    name: 'HistorySection',
    properties: {
      data: 'MangaHistory[]',
      date: 'int',
    },
  };
}

export class MangaHistorySchema extends Realm.Object<MangaHistory> {
  manga!: Manga; // key of the manga
  chapter!: MangaChapter; // key of read/current chapter
  date!: number; // the exact date when this chapter was read
  static schema: Realm.ObjectSchema = {
    embedded: true,
    name: 'MangaHistory',
    properties: {
      manga: 'BaseManga',
      chapter: 'BaseMangaChapter',
      date: 'int',
    },
  };
}

export class BaseMangaSchema extends Realm.Object<Manga> {
  source!: string;
  title!: string;
  imageCover!: string;
  link!: string;
  index!: number;
  static schema: Realm.ObjectSchema = {
    embedded: true,
    name: 'BaseManga',
    properties: {
      source: 'string',
      title: 'string',
      imageCover: 'string',
      link: 'string',
      index: 'int',
    },
  };
}

export class BaseMangaChapterSchema extends Realm.Object<Manga> {
  link!: string;
  name!: string;
  index!: number;
  date!: string;
  language?: string;
  static schema: Realm.ObjectSchema = {
    embedded: true,
    name: 'BaseMangaChapter',
    properties: {
      link: 'string',
      name: 'string',
      index: 'int',
      date: 'string',
      language: 'string?',
    },
  };
}
