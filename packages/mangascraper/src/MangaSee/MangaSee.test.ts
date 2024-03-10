import MangaSee from './MangaSee';
import MangaSource from '../scraper/scraper';
import { JSType, list, t, union } from '@mangayomu/jest-assertions';
import { Directory, HotUpdateJSON, LatestJSON } from './MangaSee.interfaces';

test('ensures that module is registered in map', () => {
  expect(MangaSource.getSource(MangaSee.NAME)).toEqual(MangaSee);
});

test('gets the directory', async () => {
  const directory = await MangaSee['directory']();
  const assertion: JSType<Directory> = {
    a: list([t.string]),
    al: list([t.string]),
    g: list([t.string]),
    h: t.boolean,
    i: t.string,
    ls: union([t.number, t.string]),
    lt: t.number,
    o: t.string,
    ps: t.string,
    s: t.string,
    ss: t.string,
    t: t.string,
    v: t.string,
    vm: t.string,
    y: t.string,
  } as const;

  expect(directory).toMatchType<Directory[]>(list([assertion]));
});

test('gets latest & trending', async () => {
  const [latest, trending] = await Promise.all([
    MangaSee.latest(),
    MangaSee.trending(),
  ]);

  const latestAssertion: JSType<LatestJSON[]> = list([
    {
      Chapter: t.string,
      Date: t.string,
      Genres: t.string,
      IndexName: t.string,
      IsEdd: t.boolean,
      ScanStatus: t.string,
      SeriesID: t.string,
      SeriesName: t.string,
    },
  ]);

  const trendingAssertion: JSType<HotUpdateJSON[]> = list([
    {
      Chapter: t.string,
      Date: t.string,
      IndexName: t.string,
      IsEdd: t.boolean,
      SeriesID: t.string,
      SeriesName: t.string,
    },
  ]);

  expect(latest).toMatchType<LatestJSON[]>(latestAssertion);
  expect(trending).toMatchType<HotUpdateJSON[]>(trendingAssertion);
});

test('gets meta', async () => {
  const MANGA = { link: 'https://mangasee123.com/manga/Sakamoto-Days' };
  const meta = await MangaSee.meta(MANGA);

  const assertion: JSType<typeof meta> = {
    mainEntity: {
      '@type': t.string,
      about: t.string,
      alternateName: list([t.string]),
      author: list([t.string]),
      dateModified: t.string,
      datePublished: t.string,
      genre: list([t.string]),
      name: t.string,
    },
    IndexName: t.string,
    chapters: list([
      {
        Chapter: t.string,
        ChapterName: union([t.string, t.null]),
        Date: t.string,
        Type: t.string,
      },
    ]),
    description: t.string,
    imageCover: union([t.string, t.undefined]),
    link: t.string,
    publishStatus: t.string,
    scanStatus: t.string,
    type: t.string,
    yearReleased: t.string,
  };
  expect(meta).toMatchType<typeof meta>(assertion);
});

test('gets pages', async () => {
  const CHAPTER = {
    link: 'https://mangasee123.com/read-online/Sakamoto-Days-chapter-1-page-1.html',
  };

  const pages = await MangaSee.pages(CHAPTER);

  expect(pages).toMatchType<string[]>(list([t.string]));
});
