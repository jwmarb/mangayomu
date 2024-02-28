import { useLocalQuery, useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { MangaSchema } from '@database/schemas/Manga';
import { binary } from '@mangayomu/algorithms';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import React from 'react';

export default function useUnfinishedManga(manga: MangaSchema) {
  if (manga.currentlyReadingChapter == null)
    throw Error(
      `Cannot use ${manga._id} as an UnfinishedManga because there is no chapter the user is currently reading`,
    );
  const chapters = useLocalQuery(
    LocalChapterSchema,
    (collection) =>
      collection.filtered(
        '_mangaId = $0 AND language = $1',
        manga.link,
        manga.selectedLanguage === 'Use default language'
          ? DEFAULT_LANGUAGE
          : manga.selectedLanguage,
      ),
    [manga.selectedLanguage, manga.link],
  );
  const localRealm = useLocalRealm();
  const currentChapter = localRealm.objectForPrimaryKey(
    LocalChapterSchema,
    manga.currentlyReadingChapter._id,
  );
  const nextChapterIndex: number = React.useMemo(
    () =>
      currentChapter == null
        ? -1
        : binary.search(chapters, currentChapter, (a, b) => {
            const val = localRealm.objectForPrimaryKey(
              LocalChapterSchema,
              b._id,
            );
            if (val == null)
              throw new Error(
                `Tried accessing key ${b._id} but it doesn't exist locally. Fetch chapters first, then this expression can be called`,
              );
            return a.index - val.index;
          }),
    [manga.currentlyReadingChapter._id, chapters.length],
  );
  const nextChapter: LocalChapterSchema | undefined =
    nextChapterIndex !== -1 ? chapters[nextChapterIndex - 1] : undefined;
  return { nextChapter, currentChapter };
}
