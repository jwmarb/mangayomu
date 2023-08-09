import { ISourceChapterSchema } from '@mangayomu/schemas';
import mongoose from 'mongoose';

const sourceChapterSchema = new mongoose.Schema<ISourceChapterSchema>({
  _id: { type: String, required: true, unique: true },
  _mangaId: { type: String, required: true },
  language: { type: String, required: true },
});

type SourceChapterModel = mongoose.Model<ISourceChapterSchema>;

export default ((mongoose.models as any).SourceChapter as SourceChapterModel) ||
  mongoose.model<ISourceChapterSchema>(
    'SourceChapter',
    sourceChapterSchema,
    'SourceChapter',
  );
