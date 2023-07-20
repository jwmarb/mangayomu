import { useRealm, useLocalRealm } from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { MangaSchema } from '@database/schemas/Manga';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import React from 'react';
import Realm from 'realm';

export default function useUnfinishedMangas() {
  const s = performance.now();
  const localRealm = useLocalRealm();
  const [chapters, setChapters] = React.useState<
    Realm.Collection<LocalChapterSchema>
  >(localRealm.objects(LocalChapterSchema));
  // const isFocused = useMutableObject(focused);
  const realm = useRealm();

  const [currentlyReadingMangas, setCurrentlyReadingMangas] = React.useState<
    Realm.Results<MangaSchema>
  >(
    realm
      .objects(MangaSchema)
      .filtered('currentlyReadingChapter != null && inLibrary == true'),
  );
  useFocusEffect(
    React.useCallback(() => {
      const callback: Realm.CollectionChangeCallback<MangaSchema> = (
        collection,
      ) => {
        setCurrentlyReadingMangas(
          collection.filtered(
            'currentlyReadingChapter != null && inLibrary == true',
          ),
        );
      };
      const chaptersCallback: Realm.CollectionChangeCallback<
        LocalChapterSchema
      > = (collection) => {
        setChapters(collection);
      };
      const mangas = realm.objects(MangaSchema);
      const chapters = localRealm.objects(LocalChapterSchema);
      mangas.addListener(callback);
      chapters.addListener(chaptersCallback);
      return () => {
        mangas.removeListener(callback);
        chapters.removeListener(chaptersCallback);
      };
    }, [setCurrentlyReadingMangas, setChapters]),
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
  }, {} as Record<string, Realm.Results<LocalChapterSchema>>);
  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) =>
      manga.currentlyReadingChapter?._id !==
      unfinishedDictionary[manga._id][0]?._id,
  );

  return [unfinishedMangas, unfinishedDictionary, isNotSynced] as const;
}
