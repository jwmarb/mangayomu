import { ChapterSchema } from '@database/schemas/Chapter';
import { SortLanguages } from '@database/schemas/Manga';
import integrateSortedList from '@helpers/integrateSortedList';
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  MangaChapter,
  MangaMeta,
  MangaMultilingualChapter,
  Manga,
} from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';

function deepEqual(
  a: Omit<MangaChapter, 'link'>,
  b: Omit<MangaChapter, 'link'>,
) {
  return a.date === b.date && a.index === b.index && a.name === b.name;
}

export default function writeLocalChapters(
  realm: Realm,
  currentUser: ReturnType<typeof useUser>,
  meta: MangaMeta & Manga,
) {
  const chapters: string[] = [];
  const availableLanguages: ISOLangCode[] = [];
  const lookup = new Set<string>();
  realm.write(() => {
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
      const existingChapter = realm.objectForPrimaryKey(ChapterSchema, x.link);
      if (
        (existingChapter != null && !deepEqual(existingChapter, x)) ||
        existingChapter == null
      ) {
        const copy = x;
        (copy as unknown as ChapterSchema)._mangaId = meta.link;
        (copy as unknown as ChapterSchema)._id = x.link;
        (copy as unknown as ChapterSchema)._realmId = currentUser.id;
        (copy as unknown as ChapterSchema).language =
          (x as MangaMultilingualChapter).language ?? 'en';
        delete (copy as Partial<MangaChapter>).link;
        realm.create<ChapterSchema>(
          ChapterSchema,
          copy,
          Realm.UpdateMode.Modified,
        );
      }
    }
  });
  return { chapters, availableLanguages };
}
