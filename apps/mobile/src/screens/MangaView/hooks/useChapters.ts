import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import {
  SORT_CHAPTERS_BY,
  SORT_CHAPTERS_BY_LEGACY,
  useManga,
} from '@database/schemas/Manga';
import integrateSortedList from '@helpers/integrateSortedList';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';

export default function useChapters(
  manga: ReturnType<typeof useManga>['manga'],
  meta: ReturnType<typeof useManga>['meta'],
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
          meta?._id,
          selectedLanguage,
        ) ?? [],
  );

  const [chapterData, setChapterData] = React.useState<
    Record<string, ChapterSchema>
  >(() =>
    realm
      .objects(ChapterSchema)
      .filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        meta?._id,
        selectedLanguage,
      )
      .reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {} as Record<string, ChapterSchema>),
  );

  React.useEffect(() => {
    const localCallback: Realm.CollectionChangeCallback<LocalChapterSchema> = (
      collection,
    ) => {
      setChapters(
        collection.filtered(
          '_mangaId = $0 AND language = $1 SORT(index ASC)',
          meta?._id,
          selectedLanguage,
        ),
      );
    };
    const callback: Realm.CollectionChangeCallback<ChapterSchema> = (
      collection,
    ) => {
      setChapterData(
        collection
          .filtered(
            '_mangaId = $0 AND language = $1 SORT(index ASC)',
            manga?._id,
            selectedLanguage,
          )
          .reduce((prev, curr) => {
            prev[curr._id] = curr;
            return prev;
          }, {} as Record<string, ChapterSchema>),
      );
    };
    const localChapters = localRealm
      .objects(LocalChapterSchema)
      .filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        meta?._id,
        selectedLanguage,
      );
    const chapters = realm
      .objects(ChapterSchema)
      .filtered(
        '_mangaId = $0 AND language = $1 SORT(index ASC)',
        meta?._id,
        selectedLanguage,
      );
    localChapters.addListener(localCallback);
    chapters.addListener(callback);
    return () => {
      localChapters.removeListener(localCallback);
      chapters.removeListener(callback);
    };
  }, [selectedLanguage, meta?._id]);

  const data = React.useMemo(() => {
    if (meta != null && chapters.length > 0) {
      const sorted = sort(Array.from(chapters))[
        meta.reversedSort ? 'desc' : 'asc'
      ](SORT_CHAPTERS_BY[meta.sortChaptersBy]);
      return sorted;
    }

    return [];
  }, [
    manga?.selectedLanguage,
    meta?.sortChaptersBy,
    meta?.reversedSort,
    chapters,
  ]);

  const firstChapter =
    chapters.length > 0 ? chapters[chapters.length - 1] : undefined;

  return { data, firstChapter, chapterData };
}
