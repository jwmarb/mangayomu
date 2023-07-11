import { Manga } from '@mangayomu/mangascraper';
import mongoose from 'mongoose';

export interface SourceManga extends Manga {
  _id: string; // slug
}

const sourceMangaSchema = new mongoose.Schema<SourceManga>({
  link: { type: String, required: true, unique: true },
  imageCover: { type: String },
  source: { type: String, required: true },
  title: { type: String, required: true },
  _id: { type: String, required: true, unique: true },
});

type SourceMangaModel = mongoose.Model<SourceManga>;

export default ((mongoose.models as any).SourceManga as SourceMangaModel) ||
  mongoose.model<SourceManga>('SourceManga', sourceMangaSchema, 'SourceManga');
