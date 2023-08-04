import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga } from '@mangayomu/mangascraper';
import { BSON } from 'realm';

export interface IMangaSchema extends Manga {
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount: number;
  inLibrary: boolean;
  selectedLanguage: ISOLangCode | 'Use default language';
  readerDirection: ReadingDirection | 'Use global setting';
  readerZoomStartPosition: ZoomStartPosition | 'Use global setting';
  readerImageScaling: ImageScaling | 'Use global setting';
  readerLockOrientation: ReaderScreenOrientation | 'Use global setting';
  _id: BSON.ObjectId;
  _realmId: string;
}

export type RequiredMangaSchemaFields = GetRequiredProperties<
  IMangaSchema,
  | 'notifyNewChaptersCount'
  | 'inLibrary'
  | 'selectedLanguage'
  | 'readerDirection'
  | 'readerImageScaling'
  | 'readerLockOrientation'
  | 'readerZoomStartPosition'
>;

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
