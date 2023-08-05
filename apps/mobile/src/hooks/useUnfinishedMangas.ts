import {
  useRealm,
  useLocalRealm,
  useQuery,
  useLocalQuery,
} from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { MangaSchema } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import Realm from 'realm';

export default function useUnfinishedMangas() {
  const localRealm = useLocalRealm();
  const chapters = useLocalQuery(LocalChapterSchema);
  const currentlyReadingMangas = useQuery(MangaSchema, (collection) =>
    collection.filtered('currentlyReadingChapter != null AND inLibrary = true'),
  );

  const isNotSynced = currentlyReadingMangas.some(
    (manga) =>
      manga.currentlyReadingChapter != null &&
      localRealm.objectForPrimaryKey(
        LocalChapterSchema,
        manga.currentlyReadingChapter._id,
      ) == null,
  );

  const unfinishedDictionary = currentlyReadingMangas.reduce((prev, curr) => {
    prev[curr.link] = chapters
      .filtered(
        '_mangaId == $0 && language == $1',
        curr.link,
        curr.selectedLanguage !== 'Use default language'
          ? curr.selectedLanguage
          : DEFAULT_LANGUAGE,
      )
      .sorted('index');
    return prev;
  }, {} as Record<string, Realm.Results<LocalChapterSchema>>);
  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) =>
      manga.currentlyReadingChapter?._id !==
      unfinishedDictionary[manga.link][0]?._id,
  );

  return [unfinishedMangas, unfinishedDictionary, isNotSynced] as const;
}
