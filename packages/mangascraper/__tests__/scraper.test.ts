import { InvalidSourceException } from '../src/exceptions';
import MangaSource from '../src/scraper/scraper';
import {
  Manga,
  MangaChapter,
  WithGenres,
} from '../src/scraper/scraper.interfaces';
type MockManga = { name: string; href: string; coverURI: string };
type MockMangaMeta = MockManga & {
  summary: string;
  chapters: MockMangaChapter[];
};
type MockMangaChapter = {
  title: string;
  volume: string;
  number: string;
  href: string;
  releaseDate: number;
};
class MockSource extends MangaSource<
  MockManga,
  MockMangaMeta,
  MockMangaChapter
> {
  public toMangaMeta(tmangameta: MockMangaMeta): Manga & {
    chapters: MockMangaChapter[];
    description?: string | null | undefined;
    imageCover?: string | null | undefined;
  } & WithGenres {
    return {
      title: tmangameta.name,
      imageCover: tmangameta.coverURI,
      link: tmangameta.href,
      chapters: tmangameta.chapters,
      source: this.NAME,
      genres: ['action', 'comedy'],
      description: 'foobar',
    };
  }
  public search(query: string): Promise<MockManga[]> {
    return Promise.resolve<MockManga[]>([
      { name: 'a', href: '/a', coverURI: 'a.png' },
      { name: 'b', href: '/b', coverURI: 'b.png' },
      { name: 'c', href: '/c', coverURI: 'c.png' },
    ]);
  }
  public pages(payload: Pick<MangaChapter, 'link'>): Promise<string[]> {
    return Promise.resolve<string[]>(['1.png', '2.png', '3.png']);
  }
  public meta(payload: Pick<Manga, 'link'>): Promise<MockMangaMeta> {
    return Promise.resolve<MockMangaMeta>({
      name: 'a',
      href: '/a',
      coverURI: 'a.png',
      summary: 'lorem ipsum',
      chapters: [
        {
          href: '/a/1',
          number: '1',
          volume: '0',
          title: 'A',
          releaseDate: Date.now(),
        },
        {
          href: '/a/2',
          number: '2',
          volume: '0',
          title: 'B',
          releaseDate: Date.now(),
        },
        {
          href: '/a/3',
          number: '3',
          volume: '0',
          title: 'C',
          releaseDate: Date.now(),
        },
      ],
    });
  }
  public toManga(tmanga: MockManga): Manga {
    return {
      title: tmanga.name,
      imageCover: tmanga.coverURI,
      link: tmanga.href,
      source: this.NAME,
    };
  }
  public toChapter(tchapter: MockMangaChapter): MangaChapter {
    return {
      date: tchapter.releaseDate,
      index: -1,
      name: `Vol ${tchapter.volume}. Ch ${tchapter.number}: ${tchapter.title}`,
      link: tchapter.href,
    };
  }

  public async latest(): Promise<MockManga[]> {
    return [
      { name: 'a', href: '/a', coverURI: 'a.png' },
      { name: 'b', href: '/b', coverURI: 'b.png' },
      { name: 'c', href: '/c', coverURI: 'c.png' },
    ];
  }

  public async trending(): Promise<MockManga[]> {
    return [
      { name: 'a', href: '/a', coverURI: 'a.png' },
      { name: 'b', href: '/b', coverURI: 'b.png' },
      { name: 'c', href: '/c', coverURI: 'c.png' },
    ];
  }
}
const MockSourceInstance = new MockSource({
  containsNSFW: false,
  genres: ['action', 'comedy'],
  hasLatestMangas: true,
  hasMangaDirectory: true,
  hasTrendingMangas: true,
  host: 'https://mocksource.com/',
  icon: 'https://mocksource.com/favico.png',
  language: 'en',
  name: 'Mocks4Life',
  version: '1.0.0',
});
test('scraper constructor', () => {
  expect(MockSourceInstance.API_VERSION).toBe('1.0.0');
  expect(MockSourceInstance.GENRES).toEqual(['action', 'comedy']);
  expect(MockSourceInstance.CONTAINS_NSFW).toBe(false);
  expect(MockSourceInstance.DEFAULT_LANGUAGE).toBe('en');
  expect(MockSourceInstance.ICON_URI).toBe('https://mocksource.com/favico.png');
  expect(MockSourceInstance.NAME).toEqual('Mocks4Life');
  expect(MockSourceInstance.SUPPORTS_LATEST_MANGAS).toBe(true);
  expect(MockSourceInstance.SUPPORTS_TRENDING_MANGAS).toBe(true);
  expect(MockSourceInstance.URL.hostname).toBe('mocksource.com');
});

test('MangaSource getSource', () => {
  expect(() => MangaSource.getSource('Mocks4Life')).not.toThrow(
    new InvalidSourceException('Mocks4Life'),
  );
  expect(() => MangaSource.getSource('invalid')).toThrow(
    new InvalidSourceException('invalid'),
  );
});

test('scraper json serialization', () => {
  expect(JSON.stringify(MockSourceInstance)).toEqual(
    JSON.stringify({
      _type: 'MangaHost',
      _name: 'Mocks4Life',
      _version: '1.0.0',
    }),
  );
});

test('scraper methods', () => {
  const mangas = [
    { name: 'a', href: '/a', coverURI: 'a.png' },
    { name: 'b', href: '/b', coverURI: 'b.png' },
    { name: 'c', href: '/c', coverURI: 'c.png' },
  ];
  const mockChapter: MockMangaChapter = {
    href: '/a/1',
    number: '1',
    volume: '0',
    releaseDate: Date.now(),
    title: 'A',
  };
  const mockManga: MockManga = mangas[0];
  expect(MockSourceInstance.latest()).resolves.toEqual(mangas);
  expect(MockSourceInstance.trending()).resolves.toEqual(mangas);
  expect(MockSourceInstance.search('test')).resolves.toEqual(mangas);
  expect(MockSourceInstance.pages({ link: '' })).resolves.toEqual([
    '1.png',
    '2.png',
    '3.png',
  ]);

  expect(MockSourceInstance.toChapter(mockChapter)).toEqual({
    date: mockChapter.releaseDate,
    index: -1,
    name: `Vol ${mockChapter.volume}. Ch ${mockChapter.number}: ${mockChapter.title}`,
    link: mockChapter.href,
  });
  expect(MockSourceInstance.toManga(mockManga)).toEqual({
    title: mockManga.name,
    imageCover: mockManga.coverURI,
    link: mockManga.href,
    source: 'Mocks4Life',
  });
});
