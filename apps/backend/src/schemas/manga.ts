import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga as BaseManga } from '@mangayomu/mangascraper';
import mongoose from 'mongoose';

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

export interface IMangaSchema extends Omit<BaseManga, 'link'> {
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

const currentlyReadingChapterSchema =
  new mongoose.Schema<CurrentlyReadingChapter>({
    _id: { type: String },
    index: { type: Number },
    numOfPages: { type: Number },
  });

export const CurrentlyReadingChapter =
  ((mongoose.models as any)
    .CurrentlyReadingChapter as mongoose.Model<CurrentlyReadingChapter>) ||
  mongoose.model<CurrentlyReadingChapter>(
    'CurrentlyReadingChapter',
    currentlyReadingChapterSchema,
  );

const mangaSchema = new mongoose.Schema<IMangaSchema>({
  imageCover: { type: String },
  source: { type: String, required: true },
  title: { type: String, required: true },
  _id: { type: String, required: true, unique: true, index: true },
  _realmId: { type: String, required: true },
  currentlyReadingChapter: currentlyReadingChapterSchema,
  dateAddedInLibrary: { type: Number, required: false },
  inLibrary: { type: Boolean, required: false, default: false },
  notifyNewChaptersCount: { type: Number, required: false, default: 0 },
  readerDirection: {
    type: String,
    required: false,
    default: 'Use global setting',
  },
  readerImageScaling: {
    type: String,
    required: false,
    default: 'Use global setting',
  },
  readerLockOrientation: {
    type: String,
    required: false,
    default: 'Use global setting',
  },
  readerZoomStartPosition: {
    type: String,
    required: false,
    default: 'Use global setting',
  },
  selectedLanguage: {
    type: String,
    required: false,
    default: 'Use default language',
  },
});

type MangaModel = mongoose.Model<IMangaSchema>;

export default ((mongoose.models as any).Manga as MangaModel) ||
  mongoose.model<IMangaSchema>('Manga', mangaSchema, 'Manga');
