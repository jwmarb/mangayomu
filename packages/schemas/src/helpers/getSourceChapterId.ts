import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import getSourceMangaId from './getSourceMangaId';
import slugify from './slugify';
import languages from '@mangayomu/language-codes';

export function isMultilingual(x: unknown): x is MangaMultilingualChapter {
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
) {
  const host = MangaHost.sourcesMap.get(manga.source);
  if (host == null) throw new Error(`Invalid source ${manga.source}`);
  return (
    getSourceMangaId(manga) +
    '/' +
    slugify(chapter.name) +
    '-' +
    (isMultilingual(chapter) ? slugify(chapter.language) : host.defaultLanguage)
  );
}
