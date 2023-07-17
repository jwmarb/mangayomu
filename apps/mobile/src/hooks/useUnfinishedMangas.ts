import { useLocalQuery, useLocalRealm, useQuery } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';

export default function useUnfinishedMangas() {
  const mangas = useQuery(MangaSchema);
  const chapters = useLocalQuery(ChapterSchema);
  const currentlyReadingMangas = mangas.filtered(
    'currentlyReadingChapter != null && inLibrary == true',
  );
  const localRealm = useLocalRealm();
  const isNotSynced = currentlyReadingMangas.some(
    (manga) =>
      manga.currentlyReadingChapter == null ||
      (manga.currentlyReadingChapter != null &&
        localRealm.objectForPrimaryKey(
          ChapterSchema,
          manga.currentlyReadingChapter._id,
        ) == null),
  );
  const unfinishedDictionary = currentlyReadingMangas.reduce((prev, curr) => {
    prev[curr._id] = chapters
      .filtered(
        '_mangaId == $0 && language == $1',
        curr._id,
        curr.selectedLanguage !== 'Use default language'
          ? curr.selectedLanguage
          : DEFAULT_LANGUAGE,
      )
      .sorted('index');
    return prev;
  }, {} as Record<string, Realm.Results<ChapterSchema>>);
  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) =>
      manga.currentlyReadingChapter?._id !==
      unfinishedDictionary[manga._id][0]?._id,
  );

  return [unfinishedMangas, unfinishedDictionary, isNotSynced] as const;
}
