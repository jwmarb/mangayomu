import {
  Manga,
  MangaChapter,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import getSourceMangaId from './getSourceMangaId';
import slugify from './slugify';
import languages from '@mangayomu/language-codes';

function isMultilingual(x: unknown): x is MangaMultilingualChapter {
  return (
    x != null &&
    typeof x === 'object' &&
    'language' in x &&
    typeof x.language === 'string' &&
    x.language in languages
  );
}

export default function getSourceChapterId(
  manga: Manga,
  chapter: MangaChapter,
  defaultLanguage: string,
) {
  return (
    getSourceMangaId(manga) +
    '/' +
    slugify(chapter.name) +
    '-' +
    (isMultilingual(chapter) ? slugify(chapter.language) : defaultLanguage)
  );
}
