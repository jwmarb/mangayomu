import { Manga } from '@mangayomu/mangascraper/src';
import slugify from './slugify';

export default function getSourceMangaId(manga: Manga) {
  return slugify(manga.source) + '/' + slugify(manga.title);
}
