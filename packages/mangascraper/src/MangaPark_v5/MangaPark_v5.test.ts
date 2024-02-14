/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSType, Union, list, t, union } from '@mangayomu/jest-assertions';
import MangaParkv5 from './MangaPark_v5';
import { Assertions } from '../utils/assertions';
import { MangaParkV5MangaMeta } from './MangaPark_v5.interfaces';
import {
  compressURL,
  compressURLWorklet,
  digitsOnly,
  getV3URL,
  getV5URL,
  parseTimestamp,
} from './MangaPark_v5.helpers';
import { sub } from 'date-fns';
import { Manga } from '../scraper/scraper.interfaces';
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

test('compresses url', () => {
  expect(
    compressURL(
      'https://mangapark.net/title/119777-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen/7683399-en-ch.281.1',
    ),
  ).toBe('https://mangapark.net/title/119777/7683399');
  expect(
    compressURLWorklet(
      'https://mangapark.net/title/119777-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen/7683399-en-ch.281.1',
    ),
  ).toBe('https://mangapark.net/title/119777/7683399');
});

test('getV5URL', () => {
  expect(getV5URL('https://mangapark.net/comic/119777')).toBe(
    'https://mangapark.net/title/119777',
  );
});

test('getV3URL', () => {
  expect(
    getV3URL(
      'https://mangapark.net/title/121075-en-tensei-shitara-slime-datta-ken',
    ),
  ).toBe('https://mangapark.net/comic/121075');
  expect(getV3URL('https://mangapark.net/title/121075')).toBe(
    'https://mangapark.net/comic/121075',
  );
});

test('digitsOnly', () => {
  expect(digitsOnly('8.5 stars')).toBe('8.5');
  expect(digitsOnly('8 times')).toBe('8');
});

test('parseTimestamp', () => {
  expect(parseTimestamp('5 days ago')).toBe(
    sub(Date.now(), { days: 5 }).toString(),
  );
  expect(parseTimestamp('1 day ago')).toBe(
    sub(Date.now(), { days: 1 }).toString(),
  );
  expect(parseTimestamp('1 hour ago')).toBe(
    sub(Date.now(), { hours: 1 }).toString(),
  );
  expect(parseTimestamp('12 hours ago')).toBe(
    sub(Date.now(), { hours: 12 }).toString(),
  );
  expect(parseTimestamp('1 minute ago')).toBe(
    sub(Date.now(), { minutes: 1 }).toString(),
  );
  expect(parseTimestamp('2 minutes ago')).toBe(
    sub(Date.now(), { minutes: 2 }).toString(),
  );
  expect(parseTimestamp('59 secs ago')).toBe(
    sub(Date.now(), { seconds: 59 }).toString(),
  );
  expect(parseTimestamp('1 sec ago')).toBe(
    sub(Date.now(), { seconds: 1 }).toString(),
  );
  expect(() => parseTimestamp('500')).toThrow();
});

test('searches mangas', async () => {
  const results1 = await MangaParkv5.search('One Piece');
  expect(results1).toEqual(
    expect.arrayContaining([
      expect.objectContaining<Manga>({
        title: 'One Piece',
        source: MangaParkv5.name,
        link: expect.any(String),
      }),
    ]),
  );

  expect(results1).toMatchType<Manga[]>(list([Assertions.Manga]));

  const results2 = await MangaParkv5.search('');
  MangaParkv5.addPage();
  const results3 = await MangaParkv5.search('');
  MangaParkv5.resetPage();
  const results4 = await MangaParkv5.search('');
  expect(results2).not.toEqual(results3);
  expect(results2).toMatchType<Manga[]>(list([Assertions.Manga]));
  expect(results2).toEqual(results4);
  expect(results3).toMatchType<Manga[]>(list([Assertions.Manga]));
  expect(results4).toMatchType<Manga[]>(list([Assertions.Manga]));
});

test('searches mangas w/ filters', async () => {
  const filterSample1 = structuredClone(MangaParkv5.filterSchema.schema);
  const filterSample2 = structuredClone(MangaParkv5.filterSchema.schema);
  const filterSample3 = structuredClone(MangaParkv5.filterSchema.schema);

  filterSample1.Genres.include = ['action', 'adventure', 'comedy'];
  filterSample1.Genres.exclude = ['adult', 'mature'];
  filterSample2.Genres.exclude = ['action', 'action', 'adventure'];
  filterSample3.Type.include = ['Manga'];
  filterSample3['Number of Chapters'].value = '300+';

  const [universalQuery, filteredQuery1, filteredQuery2, filteredQuery3] =
    await Promise.all([
      MangaParkv5.search(''),
      MangaParkv5.search('', filterSample1),
      MangaParkv5.search('', filterSample2),
      MangaParkv5.search('One Piece', filterSample3),
    ]);

  expect(filteredQuery1).toMatchType<Manga[]>(list([Assertions.Manga]));
  expect(filteredQuery2).toMatchType<Manga[]>(list([Assertions.Manga]));
  expect(filteredQuery3).toMatchType<Manga[]>(list([Assertions.Manga]));

  expect(universalQuery).not.toEqual(filteredQuery1);
  expect(universalQuery).not.toEqual(filteredQuery2);

  expect(filteredQuery1).not.toEqual(filteredQuery2);
  expect(filteredQuery3).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: 'One Piece',
      }),
    ]),
  );
});
