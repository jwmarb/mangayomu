import { useRealm, useObject } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';

/**
 * A hook that gets the objects of given keys
 * @param mangaKey The key of the manga
 * @param chapterKey The key of the chapter, which is in local db
 * @returns Returns objects derived from Realm
 */
export default function useData(mangaKey: string, chapterKey: string) {
  const realm = useRealm();
  const manga = useObject(MangaSchema, mangaKey);
  const [chapter, setChapter] = React.useState(
    realm.objectForPrimaryKey(ChapterSchema, chapterKey),
  );
  const collection = realm.objects(ChapterSchema);

  React.useEffect(() => {
    setChapter(realm.objectForPrimaryKey(ChapterSchema, chapterKey));
  }, [chapterKey]);

  if (manga == null)
    throw Error(
      `Manga does not exist. This error is thrown because it will not be possible to get next chapters without an existing manga object.\nThe value of mangaKey is: ${mangaKey}`,
    );
  if (chapter == null)
    throw Error(
      'Chapter does not exist. This error is thrown because data about the chapter is null. The user should fetch the manga first before reading a chapter.',
    );

  const readableChapters = React.useMemo(
    () =>
      collection.filtered(
        'language == $0 && _mangaId == $1 SORT(index ASC)',
        chapter.language,
        chapter._mangaId,
      ) as unknown,
    [chapter.language, chapter._mangaId],
  ) as (ChapterSchema & Realm.Object<ChapterSchema, never>)[];

  return [manga, chapter, readableChapters] as const;
}
