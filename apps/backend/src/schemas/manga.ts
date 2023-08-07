import {
  IMangaSchema,
  CurrentlyReadingChapter as ICurrentlyReadingChapter,
} from '@mangayomu/schemas';
import mongoose from 'mongoose';

const currentlyReadingChapterSchema =
  new mongoose.Schema<ICurrentlyReadingChapter>({
    _id: { type: String },
    index: { type: Number },
    numOfPages: { type: Number },
  });

export const CurrentlyReadingChapter =
  ((mongoose.models as any)
    .CurrentlyReadingChapter as mongoose.Model<ICurrentlyReadingChapter>) ||
  mongoose.model<ICurrentlyReadingChapter>(
    'CurrentlyReadingChapter',
    currentlyReadingChapterSchema,
  );

const mangaSchema = new mongoose.Schema<IMangaSchema>({
  imageCover: { type: String },
  source: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
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
