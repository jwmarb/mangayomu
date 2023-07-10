import { Manga } from '@mangayomu/mangascraper';
import mongoose from 'mongoose';

interface SourceManga {
  _id: string; // slug
  url: string;
}

const sourceMangaSchema = new mongoose.Schema<SourceManga>({
  url: { type: String, required: true },
  _id: { type: String, required: true, unique: true },
});

const SourceManga = mongoose.model<SourceManga>(
  'SourceManga',
  sourceMangaSchema,
  'SourceManga',
);

export default SourceManga;
