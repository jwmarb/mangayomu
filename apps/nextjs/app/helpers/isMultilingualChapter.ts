import languages from '@mangayomu/language-codes';
import {
  MangaChapter,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';

export default function isMultilingual(
  chapters: MangaChapter[],
): chapters is MangaMultilingualChapter[] {
  return chapters.some(
    (x) =>
      'language' in x &&
      typeof x.language === 'string' &&
      (x.language in languages || x.language === 'Use default language'),
  );
}
