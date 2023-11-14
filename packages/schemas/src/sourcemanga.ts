import type { Manga } from '@mangayomu/mangascraper';

export interface ISourceMangaSchema extends Manga {
  _id: string; // slug
  description?: string;
}
