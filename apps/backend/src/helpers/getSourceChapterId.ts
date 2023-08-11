import {
  Manga,
  MangaChapter,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import getSourceMangaId from './getSourceMangaId';
import slugify from './slugify';
import languages from '@mangayomu/language-codes';

function isMultilingual(x: MangaChapter): x is MangaMultilingualChapter {
  return (
    'language' in x && typeof x.language === 'string' && x.language in languages
  );
}

export default function getSourceChapterId(
  manga: Manga,
  chapter: MangaChapter,
) {
  return (
    getSourceMangaId(manga) +
    '/' +
    slugify(chapter.name) +
    (isMultilingual(chapter) ? '?lang=' + slugify(chapter.language) : '')
  );
}
