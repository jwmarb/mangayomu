import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { SortLanguages } from '@database/schemas/Manga';
import integrateSortedList from '@helpers/integrateSortedList';
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  MangaChapter,
  MangaMeta,
  MangaMultilingualChapter,
  Manga,
  MangaHost,
} from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import Realm from 'realm';

function deepEqual(
  a: Omit<MangaChapter, 'link'>,
  b: Omit<MangaChapter, 'link'>,
) {
  return a.date === b.date && a.index === b.index && a.name === b.name;
}

export default function writeLocalChapters(
  localRealm: Realm,
  meta: MangaMeta & Manga,
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const host = MangaHost.sourcesMap.get(meta.source)!;
  const chapters: string[] = [];
  const availableLanguages: ISOLangCode[] = [];
  const mangaLanguage = meta.language ?? host.defaultLanguage;
  localRealm.write(() => {
    const uniqChapters: Set<string> = new Set();
    const lookup = new Set<string>();
    for (const x of meta.chapters) {
      chapters.push(x.link);
      uniqChapters.add(x.link);
      if ((x as MangaMultilingualChapter)['language'] != null) {
        const multilingualChapter = x as MangaMultilingualChapter;
        if (!lookup.has(multilingualChapter.language)) {
          integrateSortedList(availableLanguages, SortLanguages).add(
            multilingualChapter.language,
          );
          lookup.add(multilingualChapter.language);
        }
      } else if (!lookup.has(mangaLanguage)) {
        availableLanguages.push(mangaLanguage);
        lookup.add(mangaLanguage);
      }

      const existingChapter = localRealm.objectForPrimaryKey(
        LocalChapterSchema,
        x.link,
      );
      if (
        (existingChapter != null && !deepEqual(existingChapter, x)) ||
        existingChapter == null
      ) {
        const copy = { ...x };
        (copy as unknown as LocalChapterSchema)._mangaId = meta.link;
        (copy as unknown as LocalChapterSchema)._id = x.link;
        (copy as unknown as LocalChapterSchema).language =
          (x as MangaMultilingualChapter).language ?? 'en';
        delete (copy as Partial<MangaChapter>).link;
        localRealm.create<LocalChapterSchema>(
          LocalChapterSchema,
          copy,
          Realm.UpdateMode.Modified,
        );
      }
    }
    const localChapters = localRealm
      .objects(LocalChapterSchema)
      .filtered('_mangaId = $0', meta.link);

    /**
     * If the host deleted a chapter, it shall also be deleted here. Without deletion, collisions with `index` field occurs
     */
    for (const chapter of localChapters) {
      if (!uniqChapters.has(chapter._id)) localRealm.delete(chapter);
    }
  });

  return { chapters, availableLanguages };
}
