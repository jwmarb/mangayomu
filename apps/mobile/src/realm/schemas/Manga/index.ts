import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import { IChapterSchema } from '@realm/schemas/Chapter';
import Realm from 'realm';
import { createRealmContext } from '@realm/react';

export const SORT_CHAPTERS_BY = {
  'Chapter number':
    (reversed: boolean) => (a: MangaChapter, b: MangaChapter) => {
      if (a.name && b.name) {
        const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
        const bName = b.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
        if (aName != null && bName != null)
          return (
            (reversed ? -1 : 1) * (parseFloat(bName[0]) - parseFloat(aName[0]))
          );
      }
      if (a.index != null && b.index != null)
        return (reversed ? -1 : 1) * (b.index - a.index);
      throw Error('Chapter cannot be sorted due to undefined name and index');
    },
};

export interface IMangaSchema extends Omit<Manga, 'index'> {
  description: string;
  genres: string[];
  currentlyReadingChapter?: string;
  dateAddedInLibrary?: string;
  notifyNewChaptersCount?: number;
  chapters: IChapterSchema[];
  sortChaptersBy: keyof typeof SORT_CHAPTERS_BY;
}

export class MangaSchema extends Realm.Object<IMangaSchema> {
  description!: string;
  genres!: string[];
  currentlyReadingChapter!: string;
  dateAddedInLibrary!: string;
  modifyNewChaptersCount!: number;
  chapters!: IChapterSchema[];
  sortChaptersBy!: keyof typeof SORT_CHAPTERS_BY;
  static schema: Realm.ObjectSchema = {
    name: 'Manga',
    properties: {
      url: 'string',
      title: 'string',
      imageCover: 'string',
      source: 'string',
      description: 'string',
      genres: 'string[]',
      currentlyReadingChapter: 'string?',
      dateAddedInLibrary: 'string?',
      notifyNewChaptersCount: { type: 'int?', default: 0 },
      chapters: { type: 'list', objectType: 'Chapter' },
      sortChaptersBy: { type: 'string', default: 'Chapter number' },
    },
    primaryKey: 'url',
  };
}

export const {
  RealmProvider: MangaRealmProvider,
  useRealm: useMangaRealm,
  useQuery: useMangaQuery,
} = createRealmContext({ schema: [MangaSchema] });
