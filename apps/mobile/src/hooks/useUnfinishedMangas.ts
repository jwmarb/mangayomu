import { useLocalRealm, useQuery, useLocalQuery } from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { MangaSchema } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';

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

  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) =>
      manga.currentlyReadingChapter?._id !==
      chapters.filtered(
        '_mangaId == $0 AND language == $1 AND index = 0',
        manga.link,
        manga.selectedLanguage !== 'Use default language'
          ? manga.selectedLanguage
          : DEFAULT_LANGUAGE,
      )[0]?._id,
  );

  return [unfinishedMangas, isNotSynced] as const;
}
