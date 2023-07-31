import { MangaChapter } from '@mangayomu/mangascraper';
import { MangaMultilingualChapter } from '@mangayomu/mangascraper/src';

export interface ILocalChapterSchema
  extends Omit<MangaMultilingualChapter, 'link'> {
  _id: string;
  _mangaId: string;
}

export const SORT_CHAPTERS_BY = {
  'Chapter number': (a: Omit<MangaChapter, 'link'>) => {
    if (a.name) {
      const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
      if (aName != null) return parseFloat(aName[0]);
    }
    if (a.index != null) return a.index;
    throw Error('Chapter cannot be sorted due to undefined name and index');
  },
  Timestamp: (a: Omit<MangaChapter, 'link'>) => Date.parse(a.date),
};

export type SortChaptersBy = keyof typeof SORT_CHAPTERS_BY;
