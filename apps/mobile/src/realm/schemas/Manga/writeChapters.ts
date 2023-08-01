import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { SortLanguages } from '@database/schemas/Manga';
import integrateSortedList from '@helpers/integrateSortedList';
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  MangaChapter,
  MangaMeta,
  MangaMultilingualChapter,
  Manga,
} from '@mangayomu/mangascraper/src';

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
  const chapters: string[] = [];
  const availableLanguages: ISOLangCode[] = [];
  const lookup = new Set<string>();
  localRealm.write(() => {
    const outdatedChapters = localRealm
      .objects(LocalChapterSchema)
      .filtered('_mangaId = $0', meta.link);
    localRealm.delete(outdatedChapters); // new or deleted chapters place indexes out of order and must be recreated accordingly
    for (const x of meta.chapters) {
      chapters.push(x.link);
      if ('language' in x) {
        const multilingualChapter = x as MangaMultilingualChapter;
        if (!lookup.has(multilingualChapter.language)) {
          integrateSortedList(availableLanguages, SortLanguages).add(
            multilingualChapter.language,
          );
          lookup.add(multilingualChapter.language);
        }
      } else if (!lookup.has('en')) {
        availableLanguages.push('en');
        lookup.add('en');
      }

      const copy = x;
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
  });
  return { chapters, availableLanguages };
}
