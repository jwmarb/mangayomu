import { MangaSchema } from '@database/schemas/Manga';
import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga } from '@mangayomu/mangascraper';
import Realm from 'realm';
import React from 'react';
import { useQuery, useRealm } from '@database/main';

export interface ICloudMangaSchema extends Omit<Manga, 'index'> {
  currentlyReadingChapter?: string;
  readChapters: Set<string>;
  dateAddedInLibrary?: number;
  modifyNewChaptersCount?: number;
  selectedLanguage: ISOLangCode | 'Use default language';
  _userId: string;
  inLibrary: boolean;
  _id: string;
}

// Every time there is a change in CloudManga, Realm should copy its contents to Manga.
export class CloudMangaSchema extends Realm.Object<ICloudMangaSchema> {
  currentlyReadingChapter?: string;
  readChapters!: Set<string>;
  dateAddedInLibrary?: number;
  modifyNewChaptersCount?: number;
  selectedLanguage!: ISOLangCode | 'Use default language';
  _userId!: string;
  inLibrary!: boolean;
  _id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'CloudManga',
    properties: {
      _id: 'string', // link of manga
      _userId: 'string', // from user
      currentlyReadingChapter: 'string?', // todo: Whether to have index page saved or not
      readChapters: { type: 'string<>', default: new Set() },
      dateAddedInLibrary: 'int?',
      modifyNewChaptersCount: 'int?',
      selectedLanguage: 'string?',
      inLibrary: { type: 'bool', default: false }, // Persist states regardless of in library or not. The user should know if they've read the manga before or not.
    },
    primaryKey: '_id',
  };
}
