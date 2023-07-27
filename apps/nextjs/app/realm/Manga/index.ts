import Collection from '@app/realm/collection';
import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga, MangaChapter } from '@mangayomu/mangascraper';

export interface IMangaSchema extends Omit<Manga, 'link'> {
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount?: number;
  inLibrary: boolean;
  selectedLanguage: ISOLangCode | 'Use default language';
  readerDirection: ReadingDirection | 'Use global setting';
  readerZoomStartPosition: ZoomStartPosition | 'Use global setting';
  readerImageScaling: ImageScaling | 'Use global setting';
  readerLockOrientation: ReaderScreenOrientation | 'Use global setting';
  _id: string;
  _realmId: string;
}

export type CurrentlyReadingChapter = {
  _id: string;
  index: number;
  numOfPages: number;
};

export enum ReadingDirection {
  LEFT_TO_RIGHT = 'Left to right',
  RIGHT_TO_LEFT = 'Right to left',
  VERTICAL = 'Vertical',
  WEBTOON = 'Webtoon',
}

export enum ImageScaling {
  SMART_FIT = 'Smart fit',
  FIT_SCREEN = 'Fit screen',
  FIT_WIDTH = 'Fit width',
  FIT_HEIGHT = 'Fit height',
}

export enum ZoomStartPosition {
  AUTOMATIC = 'Automatic',
  LEFT = 'Left',
  RIGHT = 'Right',
  CENTER = 'Center',
}

export enum ReaderScreenOrientation {
  FREE = 'Free',
  PORTRAIT = 'Portrait',
  LANDSCAPE = 'Landscape',
}

export enum ReaderBackgroundColor {
  GRAY = 'Gray',
  BLACK = 'Black',
  WHITE = 'White',
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

export type SortChaptersByType = keyof typeof SORT_CHAPTERS_BY;

export default class MangaSchema extends Collection<IMangaSchema>({
  name: 'Manga',
  defaults: {
    selectedLanguage: 'Use default language',
    readerDirection: 'Use global setting',
    readerImageScaling: 'Use global setting',
    readerLockOrientation: 'Use global setting',
    readerZoomStartPosition: 'Use global setting',
    inLibrary: false,
    notifyNewChaptersCount: 0,
  },
}) {}
