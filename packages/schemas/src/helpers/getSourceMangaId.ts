import { Manga } from '@mangayomu/mangascraper';
import slugify from './slugify';

export default function getSourceMangaId(manga: Manga) {
  return slugify(manga.source) + '/' + slugify(manga.title);
}
