import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';

export default function useChapters(
  manga: ReturnType<typeof useManga>['manga'],
) {
  const realm = useRealm();

  const selectedLanguage =
    manga?.selectedLanguage === 'Use default language'
      ? DEFAULT_LANGUAGE
      : manga?.selectedLanguage;
  const [chapters, setChapters] = React.useState<Realm.Results<ChapterSchema>>(
    () =>
      realm
        .objects(ChapterSchema)
        .filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          manga?._id,
          selectedLanguage,
        ) ?? [],
  );

  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<ChapterSchema> = (
      collection,
    ) => {
      setChapters(
        collection.filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          manga?._id,
          selectedLanguage,
        ),
      );
    };
    const chapters = realm
      .objects(ChapterSchema)
      .filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        manga?._id,
        selectedLanguage,
      );
    chapters.addListener(callback);
    return () => {
      chapters.removeListener(callback);
    };
  }, [selectedLanguage, manga?._id]);

  const data = React.useMemo(() => {
    if (manga != null && chapters.length > 0) {
      const sorted = sort(Array.from(chapters))[
        manga.reversedSort ? 'desc' : 'asc'
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
