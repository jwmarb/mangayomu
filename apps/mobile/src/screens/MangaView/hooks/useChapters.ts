import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { useManga } from '@database/schemas/Manga';
import { SORT_CHAPTERS_BY } from '@mangayomu/schemas';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';

export default function useChapters(
  manga: ReturnType<typeof useManga>['manga'],
) {
  const realm = useRealm();
  const localRealm = useLocalRealm();

  const selectedLanguage =
    manga?.selectedLanguage === 'Use default language' ||
    manga?.selectedLanguage == null
      ? DEFAULT_LANGUAGE
      : manga?.selectedLanguage;

  const [chapters, setChapters] = React.useState<
    Realm.Results<LocalChapterSchema>
  >(
    () =>
      localRealm
        .objects(LocalChapterSchema)
        .filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          manga?._id,
          selectedLanguage,
        ) ?? [],
  );

  const [chapterData, setChapterData] = React.useState<
    Record<string, ChapterSchema | undefined>
  >(() =>
    localRealm
      .objects(LocalChapterSchema)
      .filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        manga?._id,
        selectedLanguage,
      )
      .reduce((prev, curr) => {
        prev[curr._id] = realm.objectForPrimaryKey(ChapterSchema, curr._id);
        return prev;
      }, {} as Record<string, ChapterSchema | undefined>),
  );

  useFocusEffect(
    React.useCallback(() => {
      const localCallback: Realm.CollectionChangeCallback<
        LocalChapterSchema
      > = (collection) => {
        setChapters(
          collection.filtered(
            '_mangaId = $0 AND language = $1 SORT(index ASC)',
            manga?._id,
            selectedLanguage,
          ),
        );
      };
      const callback: Realm.CollectionChangeCallback<ChapterSchema> = () => {
        setChapterData(
          localRealm
            .objects(LocalChapterSchema)
            .filtered(
              '_mangaId = $0 AND language = $1 SORT(index ASC)',
              manga?._id,
              selectedLanguage,
            )
            .reduce((prev, curr) => {
              prev[curr._id] = realm.objectForPrimaryKey(
                ChapterSchema,
                curr._id,
              );
              return prev;
            }, {} as Record<string, ChapterSchema | undefined>),
        );
      };
      const localChapters = localRealm
        .objects(LocalChapterSchema)
        .filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          manga?._id,
          selectedLanguage,
        );
      const chapters = realm
        .objects(ChapterSchema)
        .filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          manga?._id,
          selectedLanguage,
        );
      localChapters.addListener(localCallback);
      chapters.addListener(callback);
      return () => {
        localChapters.removeListener(localCallback);
        chapters.removeListener(callback);
      };
    }, [selectedLanguage, manga?._id]),
  );

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

  return { data, firstChapter, chapterData };
}
