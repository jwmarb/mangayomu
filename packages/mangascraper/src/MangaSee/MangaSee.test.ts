import MangaSee from './MangaSee';
import MangaSource from '../scraper/scraper';
import { JSType, list, t, union } from '@mangayomu/jest-assertions';
import { Directory, HotUpdateJSON, LatestJSON } from './MangaSee.interfaces';
import { Manga, MangaChapter, MangaMeta } from '../scraper/scraper.interfaces';
import { Assertions } from '../utils/assertions';
import { MANGASEE_INFO } from './MangaSee.constants';

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
  expect(directory.map((x) => MangaSee.toManga(x))).toMatchType<Manga[]>(
    list([Assertions.Manga]),
  );
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
  expect(latest.map((x) => MangaSee.toManga(x))).toMatchType<Manga[]>(
    list([Assertions.Manga]),
  );
  expect(trending.map((x) => MangaSee.toManga(x))).toMatchType<Manga[]>(
    list([Assertions.Manga]),
  );
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
  expect(MangaSee.toMangaMeta(meta)).toMatchType<
    MangaMeta<(typeof meta.chapters)[number]>
  >({ ...Assertions.MangaMeta, chapters: assertion.chapters });
  expect(meta.chapters.map((x) => MangaSee.toChapter(x, meta))).toMatchType<
    MangaChapter[]
  >(Assertions.MangaMeta.chapters);
});

test('gets pages', async () => {
  const CHAPTER = {
    link: 'https://mangasee123.com/read-online/Sakamoto-Days-chapter-1-page-1.html',
  };

  const pages = await MangaSee.pages(CHAPTER);

  expect(pages).toMatchType<string[]>(list([t.string]));
});

test('invalid `toManga`', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => MangaSee.toManga({} as any)).toThrow();
  expect(() => MangaSee.toManga(undefined as any)).toThrow();
});

test('chapter parsing', async () => {
  const meta = await MangaSee.meta({
    link: 'https://mangasee123.com/manga/Dandadan',
  });
  expect(
    MangaSee.toChapter(
      {
        Chapter: '101420',
        Type: 'Chapter',
        Date: '2024-02-26 18:03:10',
        ChapterName: null,
      },
      meta,
    ),
  ).toEqual<MangaChapter>({
    date: Date.parse('2024-02-26 18:03:10'),
    link: 'https://mangasee123.com/read-online/Dandadan-chapter-142',
    name: 'Chapter 142',
    index: 0,
  });
});

test('signal cancels search results', async () => {
  const controller = new AbortController();
  const [result] = await Promise.all([
    MangaSee.search('', 1, controller.signal),
    new Promise<void>((res) => {
      res();
      controller.abort();
    }),
  ]);
  expect(result).toEqual([]);
});

test('search filters work as intended', async () => {
  const filters = structuredClone(MANGASEE_INFO.filters.schema);
  filters.Genres.include = [
    'Shounen',
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
  ];
  filters['Official Translation'].value = 'Official Translation Only';
  filters['Publish Status'].value = 'Ongoing';
  filters['Scan Status'].value = 'Ongoing';
  filters['Sort By'].value = 'Popularity (All Time)';
  filters['Type'].value = 'Manga';

  let result = await MangaSee.search('One Piece', 1, undefined, filters);
  type Manga = Partial<(typeof result)[number]>;
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining<Manga>({
        y: '1997',
        s: 'One Piece',
      }),
    ]),
  );

  filters.Genres.include = [];
  filters.Genres.exclude = ['Adult', 'Ecchi'];
  filters['Official Translation'].value = 'Any';
  filters['Publish Status'].value = 'Any';
  filters['Scan Status'].value = 'Any';
  filters['Sort By'].value = 'Alphabetical';
  filters['Type'].value = 'Any';

  result = await MangaSee.search('', 1, undefined, filters);

  expect(result).not.toEqual(
    expect.arrayContaining([
      expect.objectContaining<Manga>({
        s: 'Parallel Paradise',
      }),
      expect.objectContaining<Manga>({
        s: 'Gushing Over Magical Girls',
      }),
    ]),
  );
  for (let i = 0; i < result.length; i++) {
    const manga = result[i] as { g: string[] };
    expect(manga.g).not.toContain('Adult');
    expect(manga.g).not.toContain('Ecchi');
  }

  filters.Genres.exclude = ['Mature'];

  result = await MangaSee.search('Berserk', 1, undefined, filters);

  expect(result).not.toEqual(
    expect.arrayContaining([
      expect.objectContaining<Manga>({
        s: 'Berserk',
      }),
    ]),
  );

  filters.Genres.exclude = [];

  filters['Sort By'].value = 'Popularity (All Time)';

  result = await MangaSee.search('', 1, undefined, filters);

  expect(MangaSee.toManga(result[0])).toEqual(
    expect.objectContaining({ title: 'One Piece' }),
  );

  filters['Sort By'].reversed = true;

  result = await MangaSee.search('', 1, undefined, filters);

  expect(MangaSee.toManga(result[0])).not.toEqual(
    expect.objectContaining({ title: 'One Piece' }),
  );
});
