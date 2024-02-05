/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSType, Union, list, t, union } from '@mangayomu/jest-assertions';
import MangaParkv5 from './MangaPark_v5';
import { Assertions } from '../utils/assertions';
import { MangaParkV5MangaMeta } from './MangaPark_v5.interfaces';
const MANGAS = [
  'https://mangapark.net/title/10953-en-one-piece',
  'https://mangapark.net/title/11600-en-kingdom',
  'https://mangapark.net/title/119682-en-mushoku-tensei-isekai-ittara-honki-dasu',
  'https://mangapark.net/title/392563-en-hardcore-leveling-warrior-earth-game',
  'https://mangapark.net/title/392562-en-it-s-you',
];
const MANGA_METAS = Promise.all(
  MANGAS.map((x) => MangaParkv5.getMeta({ link: x })),
);

test('listHotMangas matches type', async () => {
  const hotMangas = await MangaParkv5.listHotMangas();
  expect(hotMangas).toMatchType<typeof hotMangas>(list([Assertions.Manga]));
});

test('listRecentlyUpdatedManga matches type', async () => {
  const recentlyUpdated = await MangaParkv5.listRecentlyUpdatedManga();
  expect(recentlyUpdated).toMatchType<typeof recentlyUpdated>(
    list([Assertions.Manga]),
  );
});

test('manga meta matches type', async () => {
  const metas = await MANGA_METAS;
  const assertion: JSType<MangaParkV5MangaMeta> = {
    ...Assertions.MangaMeta,
    status: {
      scan: union([t.string, t.undefined, t.null]),
      publish: t.string,
    },
    rating: {
      value: union(['N/A', t.number]),
      voteCount: t.number,
    },
    authors: list([t.string]),
  };
  for (const key in assertion) {
    const result = assertion[key as keyof typeof assertion];

    expect(
      metas.map((x) => (x as any)[key as any] as any) as any[],
    ).toMatchType<any>(
      list(
        result instanceof Union ? [...(result.toArray() as any[])] : [result],
      ) as any,
    );
  }
});
test('chapter pages match type', async () => {
  const metas = await MANGA_METAS;
  const pages = await Promise.all(
    metas.flatMap(({ chapters }) =>
      chapters.slice(0, 2).map((x) => MangaParkv5.getPages(x)),
    ),
  );
  expect(pages).toMatchType<string[][]>(list([list([t.string])]));
});
