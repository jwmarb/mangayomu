import languages from '@mangayomu/language-codes';
import { Manga, MangaChapter, MangaMeta } from '../scraper/scraper.interfaces';
import { t, union, list, JSType } from '@mangayomu/jest-assertions';
export const Assertions = {
  Manga: {
    imageCover: union<t.string | t.null | t.undefined>([
      t.undefined,
      t.string,
      t.null,
    ]),
    source: t.string,
    language: union([
      t.undefined,
      t.null,
      ...(Object.keys(languages) as unknown as (keyof typeof languages)[]),
    ]),
    link: t.string,
    title: t.string,
  } as JSType<Manga>,
  MangaMeta: {
    imageCover: union<t.string | t.null | t.undefined>([
      t.string,
      t.null,
      t.undefined,
    ]),
    source: t.string,
    language: union([
      t.undefined,
      t.null,
      ...(Object.keys(languages) as unknown as (keyof typeof languages)[]),
    ]),
    link: t.string,
    title: t.string,
    chapters: list([
      {
        name: t.string,
        date: t.string,
        index: t.number,
        link: t.string,
        subname: union([t.string, t.undefined, t.null]),
      },
    ]),
    description: union([t.string, t.undefined, t.null]),
    genres: list([t.string]),
  } as JSType<Manga & MangaMeta<MangaChapter>>,
};
