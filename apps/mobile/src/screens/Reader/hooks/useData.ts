import { useRealm, useObject, useLocalRealm } from '@database/main';
import { ChapterSchema, IChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { MangaSchema } from '@database/schemas/Manga';
import { useUser } from '@realm/react';
import React from 'react';

/**
 * A hook that gets the objects of given keys
 * @param mangaKey The key of the manga
 * @param chapterKey The key of the chapter, which is in local db
 * @returns Returns objects derived from Realm
 */
export default function useData(mangaKey: string, chapterKey: string) {
  const localRealm = useLocalRealm();
  const realm = useRealm();
  const user = useUser();
  const manga = useObject(MangaSchema, mangaKey);
  const [chapter, setChapter] = React.useState(
    localRealm.objectForPrimaryKey(LocalChapterSchema, chapterKey),
  );
  const chapterWithDataInitializer = () => {
    const existingChapter = realm.objectForPrimaryKey(
      ChapterSchema,
      chapterKey,
    );
    if (existingChapter == null) {
      let newChapter: ChapterSchema = {} as ChapterSchema;
      const localChapter = localRealm.objectForPrimaryKey(
        LocalChapterSchema,
        chapterKey,
      );
      if (localChapter == null)
        throw new Error(
          `Tried to use ${chapterKey} from LocalChapter collection, but the value was undefined`,
        );
      realm.write(() => {
        newChapter = realm.create(ChapterSchema, {
          _id: chapterKey,
          _realmId: user.id,
          _mangaId: mangaKey,
          indexPage: 0,
        });
      });
      return newChapter;
    }
    return existingChapter;
  };
  const [chapterWithData, setChapterWithData] = React.useState<ChapterSchema>(
    chapterWithDataInitializer,
  );
  const collection = localRealm.objects(LocalChapterSchema);

  React.useEffect(() => {
    setChapter(localRealm.objectForPrimaryKey(LocalChapterSchema, chapterKey));
    setChapterWithData(chapterWithDataInitializer);
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
  ) as LocalChapterSchema[];

  return [manga, chapter, readableChapters, chapterWithData] as const;
}
