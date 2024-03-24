/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheManager } from '../src/utils/cachemanager';
import {
  Manga,
  MangaChapter,
  MangaSee,
  MangaSource,
  WithAltTitles,
  WithAuthors,
  WithGenres,
  WithHentai,
  WithModificationDate,
  WithOfficialTranslations,
  WithRating,
  WithStatus,
  WithType,
  WithYearReleased,
} from '../src';
import createSchema from '@mangayomu/schema-creator';
import { isFiltersEqual } from '../src/scraper/scraper.helpers';

const MOCK_DATA = [];
type Genres = ['a', 'b', 'c', 'd', 'e'];
type Type = ['a', 'b', 'c'];
type SortBy = ['alphabetical', 'length'];
type TManga = {
  title: string;
  genres: Genres;
  type: Type;
};
type FilterSchema = typeof filters.schema;
class MockSource extends MangaSource<TManga, unknown, unknown, FilterSchema> {
  public toManga(tmanga: unknown): Manga {
    throw new Error('Method not implemented.');
  }
  public toMangaMeta(tmangameta: unknown): Manga & {
    chapters: unknown[];
    description?: string | null | undefined;
    imageCover?: string | null | undefined;
  } & Partial<
      WithGenres &
        WithAltTitles &
        WithAuthors &
        WithHentai &
        WithModificationDate &
        WithOfficialTranslations &
        WithRating &
        WithStatus &
        WithType &
        WithYearReleased
    > {
    throw new Error('Method not implemented.');
  }
  public toChapter(tchapter: unknown, tmangameta: unknown): MangaChapter {
    throw new Error('Method not implemented.');
  }
  public search(
    query: string,
    page: number,
    signal?: AbortSignal | undefined,
    filters?: FilterSchema,
  ): Promise<TManga[]> {
    throw new Error();
  }
  public pages(
    payload: Pick<MangaChapter, 'link'>,
    signal?: AbortSignal | undefined,
  ): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  public meta(
    payload: Pick<Manga, 'link'>,
    signal?: AbortSignal | undefined,
  ): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}

const filters = createSchema(
  ({
    createOptionFilter,
    createInclusiveExclusiveFilter,
    createSortFilter,
  }) => ({
    sortBy: createSortFilter({
      options: ['alphabetical', 'length'],
      default: 'alphabetical',
    }),
    genres: createInclusiveExclusiveFilter({
      fields: ['a', 'b', 'c', 'd', 'e'],
    }),
    type: createOptionFilter({ options: ['a', 'b', 'c'], default: 'a' }),
  }),
);

const MockSourceInstance = new MockSource({
  containsNSFW: false,
  filters,
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

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('cache helpers', () => {
  expect(isFiltersEqual({}, {})).toEqual(true);
  const filter = structuredClone(filters.schema);
  const filter2 = structuredClone(filters.schema);
  expect(isFiltersEqual(filter, filters.schema)).toEqual(true);

  filter.genres.include = ['a'];
  expect(isFiltersEqual(filter, filters.schema)).toEqual(false);

  filter2.genres.include = ['b', 'a'];
  filter.genres.include = ['a', 'b'];
  expect(isFiltersEqual(filter, filter2)).toEqual(true);

  filter2.genres.include = ['b'];
  expect(isFiltersEqual(filter, filter2)).toEqual(false);

  filter.genres.include = ['b'];
  filter.genres.exclude = ['a', 'c', 'd', 'e'];
  filter2.genres.exclude = ['a', 'c', 'd', 'e'];

  filter.sortBy.value = 'length';

  expect(isFiltersEqual(filter, filter2)).toEqual(false);

  filter2.sortBy.value = 'length';
  expect(isFiltersEqual(filter, filter2)).toEqual(true);

  filter.type.value = 'c';
  expect(isFiltersEqual(filter, filter2)).toEqual(false);

  filter2.type.value = 'c';
  expect(isFiltersEqual(filter, filter2)).toEqual(true);
});

test('cache correctly implemented', () => {
  const cache = new CacheManager(MockSourceInstance, 1);
  const filter = structuredClone(filters.schema);

  expect(cache.add('hello world', ['a', 'b', 'c'], filter)).toBe(true);
  expect(cache.get('hello world', filter)).toEqual(['a', 'b', 'c']);
  expect(cache.add('hello world', ['a', 'b', 'c', 'd'], filter)).toBe(true);
  expect(cache.get('hello world', filter)).toEqual(['a', 'b', 'c', 'd']);
  expect(cache.get('invalid', filter)).toEqual(null);
  setTimeout(() => {
    expect(cache.get('hello world', filter)).toEqual(['a', 'b', 'c', 'd']);
    expect(
      cache.getEntries().find((a) => a != null && a[0] === 'hello world'),
    ).not.toBeNull();
  }, 5000);
  setTimeout(() => {
    expect(cache.get('hello world', filter)).toEqual(null);
    expect(
      cache.getEntries().find((a) => a != null && a[0] === 'hello world'),
    ).toBeFalsy();
  }, CacheManager.TTL + 1000);

  jest.runOnlyPendingTimers();

  cache.clear();

  const filter2 = structuredClone(filters.schema);
  filter2.genres.exclude = ['a', 'b'];
  filter2.genres.include = ['c', 'd'];
  filter2.sortBy.value = 'alphabetical';
  filter2.type.value = 'a';

  expect(cache.add('a', ['some', 'result'], filter2)).toEqual(true);

  expect(cache.get('a', filter2)).toEqual(['some', 'result']);

  const filter3 = structuredClone(filters.schema);
  filter3.genres.exclude = ['b', 'a'];
  filter3.genres.include = ['d', 'c'];
  filter3.sortBy.value = 'alphabetical';
  filter3.type.value = 'a';

  expect(cache.add('a', ['some', 'result'], filter2)).toEqual(true);
  expect(cache.get('a', filter2)).toEqual(['some', 'result']);
  expect(cache.get('a', filter3)).toEqual(['some', 'result']);

  for (let i = 0; i < 100; i++) {
    expect(
      cache.add(String.fromCharCode(i), [String.fromCharCode(i)], filter3),
    ).toBeTruthy();
  }

  for (let i = 0; i < 100; i++) {
    expect(cache.get(String.fromCharCode(i), filter2)).toEqual([
      String.fromCharCode(i),
    ]);
  }
});

test('handles collisions correctly', () => {
  const cache = new CacheManager(MockSourceInstance);
  jest.spyOn(cache, 'hash').mockImplementation(() => 0);

  expect(cache.add('a', ['aa'], filters.schema)).toBeTruthy();
  expect(cache.add('b', ['bb'], filters.schema)).toBeTruthy();
  expect(cache.add('c', ['cc'], filters.schema)).toBeTruthy();
  expect(cache.add('d', ['dd'], filters.schema)).toBeTruthy();
  expect(cache.add('e', ['ee'], filters.schema)).toBeTruthy();
  expect(cache.add('f', ['ff'], filters.schema)).toBeTruthy();
  expect(cache.add('g', ['gg'], filters.schema)).toBeTruthy();
  expect(cache.add('h', ['hh'], filters.schema)).toBeTruthy();
  expect(cache.add('i', ['ii'], filters.schema)).toBeTruthy();
  expect(cache.add(' ', ['  '], filters.schema)).toBeTruthy();

  expect(cache.getEntries()[0][2][0]).toEqual('aa');
  expect(cache.getEntries()[1][2][0]).toEqual('bb');
  expect(cache.getEntries()[2][2][0]).toEqual('cc');
  expect(cache.getEntries()[3][2][0]).toEqual('dd');
  expect(cache.getEntries()[4][2][0]).toEqual('ee');
  expect(cache.getEntries()[5][2][0]).toEqual('ff');
  expect(cache.getEntries()[6][2][0]).toEqual('gg');
  expect(cache.getEntries()[7][2][0]).toEqual('hh');
  expect(cache.getEntries()[8][2][0]).toEqual('ii');
  expect(cache.getEntries()[9][2][0]).toEqual('  ');

  for (let i = 0; i < 100; i++) {
    expect(
      cache.add(
        String.fromCharCode(i),
        [String.fromCharCode(i)],
        filters.schema,
      ),
    ).toBeTruthy();
  }

  for (let i = 0; i < 100; i++) {
    const result = cache.get(String.fromCharCode(i), filters.schema);
    expect(result).toEqual([String.fromCharCode(i)]);
  }
});

test('handles replaces correctly', () => {
  const cache = new CacheManager(MockSourceInstance);
  expect(cache.add('a', [''], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['a'], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['b'], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['c'], filters.schema)).toBeTruthy();

  for (let i = 0; i < 100; i++) {
    expect(
      cache.add(
        String.fromCharCode(i),
        [String.fromCharCode(i)],
        filters.schema,
      ),
    ).toBeTruthy();
  }

  expect(cache.add('a', ['hello world'], filters.schema)).toBeTruthy();

  expect(cache.get('a', filters.schema)).toEqual(['hello world']);

  cache.clear();

  jest.spyOn(cache, 'hash').mockImplementation(() => 0);

  expect(cache.add('a', [''], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['a'], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['b'], filters.schema)).toBeTruthy();
  expect(cache.add('a', ['c'], filters.schema)).toBeTruthy();

  expect(cache.get('a', filters.schema)).toEqual(['c']);

  for (let i = 0; i < 100; i++) {
    expect(
      cache.add(
        String.fromCharCode(i),
        [String.fromCharCode(i)],
        filters.schema,
      ),
    ).toBeTruthy();
  }

  expect(cache.get('a', filters.schema)).toEqual(['a']);

  expect(cache.add('a', ['hello world'], filters.schema)).toBeTruthy();
  expect(cache.get('a', filters.schema)).toEqual(['hello world']);
});

test('resizing', () => {
  const cache = new CacheManager(MockSourceInstance, 2);

  cache.lockResizing();

  expect(cache.add('hello', [], filters.schema)).toBeTruthy();
  expect(cache.add('world', [], filters.schema)).toBeTruthy();
  expect(cache.size()).toEqual(2);
  expect(cache.capacity()).toEqual(2);
  expect(cache.add('foobar', [], filters.schema)).toBeFalsy();
  expect(cache.get('foobar', filters.schema) == null).toBeTruthy();

  cache.unlockResizing();
  expect(cache.size()).toEqual(2);
  expect(cache.capacity()).toEqual(8);

  setTimeout(() => {
    expect(cache.get('hello', filters.schema)).toBeFalsy();
    expect(cache.get('world', filters.schema)).toBeFalsy();
    expect(cache.size()).toEqual(0);
    expect(cache.capacity()).toEqual(2);
  }, CacheManager.TTL + 1000);

  jest.runOnlyPendingTimers();
});

test('resizing with collisions', () => {
  const cache = new CacheManager(MockSourceInstance, 10);

  cache.lockResizing();

  for (let i = 0; i < 10; i++) {
    const char = String.fromCharCode(i);
    expect(cache.add(char, [char], filters.schema)).toBeTruthy();
  }

  for (let i = 0; i < 10; i++) {
    const char = String.fromCharCode(i);
    expect(cache.get(char, filters.schema)).toEqual([char]);
  }

  for (let i = 0; i < 10; i++) {
    const char = String.fromCharCode(i);
    expect(cache.add(char, [char, char], filters.schema)).toBeTruthy();
  }

  for (let i = 0; i < 10; i++) {
    const char = String.fromCharCode(i);
    expect(cache.get(char, filters.schema)).toEqual([char, char]);
  }

  for (let i = 10; i < 20; i++) {
    const char = String.fromCharCode(i);
    expect(cache.add(char, [char], filters.schema)).toBeFalsy();
  }

  expect(cache.size()).toEqual(10);
  expect(cache.capacity()).toEqual(10);

  cache.unlockResizing();

  expect(cache.size()).toEqual(10);
  expect(cache.capacity()).toEqual(40); // 10 * 2 * 2 meaning 2 resizing operations
});
