import languages from '@mangayomu/language-codes';
import { Manga, MangaChapter, MangaMeta } from '../scraper/scraper.interfaces';
import { t, union, list, JSType } from '@mangayomu/jest-assertions';
import { extractNumbers } from './helpers';
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
        date: union([t.number, t.string]),
        index: t.number,
        link: t.string,
        subname: union([t.string, t.undefined, t.null]),
      },
    ]),
    description: union([t.string, t.undefined, t.null]),
    genres: list([t.string]),
  } as JSType<Manga & MangaMeta<MangaChapter>>,
};

export function toMatchChapterOrder(
  received: MangaChapter[],
): jest.CustomMatcherResult {
  if (received.length <= 1)
    return {
      pass: true,
      message: () => 'Expected chapters to not be ordered correctly',
    };

  for (let i = 0; i < received.length; i++) {
    const nextIdxChapter = i >= received.length ? null : received[i + 1];
    const currentIdxChapter = received[i];
    const currentChNumber = extractNumbers(currentIdxChapter.name);
    const previousChNumber = (n: number) =>
      nextIdxChapter != null ? extractNumbers(nextIdxChapter.name) : n;

    const isIndexOrderVariant1 =
      currentIdxChapter.index === i && nextIdxChapter != null
        ? currentChNumber > previousChNumber(-1)
        : true;
    const isIndexOrderVariant2 =
      currentIdxChapter.index === received.length - 1 - i &&
      nextIdxChapter != null
        ? currentChNumber < previousChNumber(received.length)
        : true;
    if (!isIndexOrderVariant1 && !isIndexOrderVariant2) {
      return {
        pass: false,
        message: () =>
          'Expected chapters to ordered correctly\n\nThe index property is in the wrong order. Latest chaptest should have the highest index and the earliest should have the smallest index.\n(e.g. If Chapter 10 is the latest chapter and Chapter 0 is the earliest, then Chapter 10 should be at index 0 and Chapter 0 should be at index 9)\n\nReceived:\n' +
          JSON.stringify(
            [
              { name: received[i].name, index: received[i].index },
              ...(nextIdxChapter
                ? [{ name: nextIdxChapter.name, index: nextIdxChapter.index }]
                : []),
              '__placeholder__',
            ],
            null,
            2,
          ).replace(
            '"__placeholder__"',
            `...and ${received.length} more chapter${
              received.length !== 1 ? 's' : ''
            }`,
          ),
      };
    }
  }

  return {
    pass: true,
    message: () => 'Expected chapters to not be ordered correctly',
  };
}
