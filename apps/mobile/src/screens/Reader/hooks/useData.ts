import {
  useRealm,
  useLocalRealm,
  useLocalQuery,
  useLocalObject,
} from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import useCombinedMangaWithLocal from '@hooks/useCombinedMangaWithLocal';
import { useUser } from '@realm/react';
import React from 'react';

/**
 * A hook that gets the objects of given keys
 * @param mangaKey The key of the manga
 * @param chapterKey The key of the chapter, which is in local db
 * @returns Returns objects derived from Realm
 */
export default function useData(mangaKey: string, chapterKey: string) {
  const realm = useRealm();
  const user = useUser();
  const manga = useCombinedMangaWithLocal(mangaKey, true);

  const chapter = useLocalObject(LocalChapterSchema, chapterKey);

  const chapterWithDataInitializer = () => {
    let existingChapter: ChapterSchema | undefined = realm
      .objects(ChapterSchema)
      .filtered('link = $0', chapterKey)[0];
    if (existingChapter == null) {
      realm.write(() => {
        existingChapter = realm.create(
          ChapterSchema,
          {
            link: chapterKey,
            _realmId: user.id,
            _mangaId: manga._id,
            indexPage: 0,
          },
          Realm.UpdateMode.Modified,
        );
      });
    }
    return existingChapter as ChapterSchema;
  };
  const [chapterWithData, setChapterWithData] = React.useState<ChapterSchema>(
    chapterWithDataInitializer,
  );

  React.useEffect(() => {
    setChapterWithData(chapterWithDataInitializer);
  }, [chapterKey]);

  if (chapter == null)
    throw Error(
      'Chapter does not exist. This error is thrown because data about the chapter is null. The user should fetch the manga first before reading a chapter.',
    );

  const readableChapters = useLocalQuery(
    LocalChapterSchema,
    (localChapters) =>
      localChapters.filtered(
        'language == $0 && _mangaId == $1 SORT(index ASC)',
        chapter.language,
        chapter._mangaId,
      ),
    [chapter.language, chapter._mangaId],
  );

  return [manga, chapter, readableChapters, chapterWithData] as const;
}
