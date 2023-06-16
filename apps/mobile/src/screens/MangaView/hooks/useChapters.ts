import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';

export default function useChapters(
  manga: ReturnType<typeof useManga>['manga'],
) {
  const localRealm = useLocalRealm();

  const [chapters, setChapters] = React.useState<
    Realm.Collection<ChapterSchema & Realm.Object<unknown, never>>
  >(() =>
    localRealm
      .objects(ChapterSchema)
      .filtered(
        '_mangaId == $0 && language == $1',
        manga?.link,
        manga?.selectedLanguage === 'Use default language'
          ? DEFAULT_LANGUAGE
          : manga?.selectedLanguage,
      ),
  );

  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<
      ChapterSchema & Realm.Object<unknown, never>
    > = (e) => {
      setChapters(e);
    };
    const p = localRealm
      .objects(ChapterSchema)
      .filtered(
        '_mangaId == $0 && language == $1',
        manga?.link,
        manga?.selectedLanguage === 'Use default language'
          ? DEFAULT_LANGUAGE
          : manga?.selectedLanguage,
      );
    p.addListener(callback);
    return () => {
      p.removeListener(callback);
    };
  }, []);

  const data = React.useMemo(() => {
    if (manga != null) {
      const sorted = sort(Array.from(chapters))[
        manga.reversedSort ? 'desc' : 'asc'
      ](SORT_CHAPTERS_BY[manga.sortChaptersBy]);
      return sorted;
    }

    return [];
  }, [manga?.selectedLanguage, manga?.sortChaptersBy, manga?.reversedSort]);

  const firstChapter = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      chapters.find(
        (c) =>
          c._mangaId === manga?.link &&
          c.language ===
            (manga?.selectedLanguage === 'Use default language'
              ? DEFAULT_LANGUAGE
              : manga?.selectedLanguage),
      )!,
    [manga?.link, manga?.selectedLanguage, chapters.length],
  );

  return { data, firstChapter };
}
