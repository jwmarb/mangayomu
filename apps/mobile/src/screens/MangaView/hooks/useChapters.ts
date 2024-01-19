import { useLocalQuery } from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { useManga } from '@database/schemas/Manga';
import { SORT_CHAPTERS_BY } from '@mangayomu/schemas';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';

export default function useChapters(
  manga: ReturnType<typeof useManga>['manga'],
) {
  const selectedLanguage =
    manga?.selectedLanguage === 'Use default language' ||
    manga?.selectedLanguage == null
      ? DEFAULT_LANGUAGE
      : manga?.selectedLanguage;

  const chapters = useLocalQuery(
    LocalChapterSchema,
    (collection) =>
      collection.filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        manga?.link,
        selectedLanguage,
      ),
    [manga?.link, selectedLanguage],
  );

  const data = React.useMemo(() => {
    if (manga != null && chapters.length > 0) {
      const sorted = sort(Array.from(chapters))[
        manga.reversedSort ? 'asc' : 'desc'
      ](SORT_CHAPTERS_BY[manga.sortChaptersBy]);
      return sorted;
    }

    return [];
  }, [
    manga?.selectedLanguage,
    manga?.sortChaptersBy,
    manga?.reversedSort,
    chapters,
  ]);

  const firstChapter =
    chapters.length > 0 ? chapters[chapters.length - 1] : undefined;

  return { data, firstChapter };
}
