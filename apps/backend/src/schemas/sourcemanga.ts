import { ISourceMangaSchema } from '@mangayomu/schemas';
import mongoose from 'mongoose';

const sourceMangaSchema = new mongoose.Schema<ISourceMangaSchema>({
  link: { type: String, required: true, unique: true },
  imageCover: { type: String },
  source: { type: String, required: true },
  title: { type: String, required: true },
  _id: { type: String, required: true, unique: true },
});

type SourceMangaModel = mongoose.Model<ISourceMangaSchema>;

export default ((mongoose.models as any).SourceManga as SourceMangaModel) ||
  mongoose.model<ISourceMangaSchema>(
    'SourceManga',
    sourceMangaSchema,
    'SourceManga',
  );
