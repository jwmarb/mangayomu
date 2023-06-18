import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { binary } from '@mangayomu/algorithms';
import React from 'react';

export default function useUnfinishedManga(
  manga: MangaSchema,
  chapters: ArrayLike<ChapterSchema & Realm.Object<unknown, never>>,
) {
  if (manga.currentlyReadingChapter == null)
    throw Error(
      `Cannot use ${manga._id} as an UnfinishedManga because there is no chapter the user is currently reading`,
    );
  const localRealm = useLocalRealm();
  const currentChapter = localRealm.objectForPrimaryKey(
    ChapterSchema,
    manga.currentlyReadingChapter._id,
  );
  const nextChapterIndex: number = React.useMemo(
    () =>
      currentChapter == null
        ? -1
        : binary.search(chapters, currentChapter, (a, b) => a.index - b.index),
    [manga.currentlyReadingChapter._id, chapters.length],
  );
  const nextChapter:
    | (ChapterSchema & Realm.Object<unknown, never>)
    | undefined =
    nextChapterIndex !== -1 ? chapters[nextChapterIndex] : undefined;
  return { nextChapter, currentChapter };
}
