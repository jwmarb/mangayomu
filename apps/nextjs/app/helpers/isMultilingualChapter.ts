import languages from '@mangayomu/language-codes';
import { MangaMultilingualChapter } from '@mangayomu/mangascraper';

export default function isMultilingual(
  chapters: unknown,
): chapters is MangaMultilingualChapter[] {
  return (
    chapters != null &&
    Array.isArray(chapters) &&
    chapters.some(
      (x) =>
        'language' in x &&
        typeof x.language === 'string' &&
        (x.language in languages || x.language === 'Use default language'),
    )
  );
}
