/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  Manga,
  MangaChapter,
  MangaMeta,
  MangaParkV5,
  MangaSee,
  MangaSource,
} from '@mangayomu/mangascraper';
import createSchema from '@mangayomu/schema-creator';
import {
  FetchedMangaResults,
  MangaResult,
  SourceStatus,
  useExploreStore,
} from '@/stores/explore';
import { mmkv } from '@/utils/persist';

const mockFilters = createSchema(() => ({}));

class MockSource extends MangaSource {
  toManga() {
    return {} as Manga;
  }
  toMangaMeta() {
    return {} as MangaMeta & Manga;
  }
  toChapter() {
    return {} as MangaChapter;
  }
  search(): Promise<unknown[]> {
    return Promise.resolve([{ t: 'one' }, { t: 'two' }, { t: 'three' }] as {
      t: string;
    }[]);
  }
  pages(): Promise<string[]> {
    return Promise.resolve([]);
  }
  meta(): Promise<unknown> {
    return Promise.resolve({});
  }

  trending(): Promise<unknown[]> {
    return Promise.resolve([{ t: 'one' }, { t: 'two' }, { t: 'three' }] as {
      t: string;
    }[]);
  }

  latest(): Promise<unknown[]> {
    return Promise.resolve([{ t: 'one' }, { t: 'two' }, { t: 'three' }] as {
      t: string;
    }[]);
  }
}

const MockSource1Instance = new MockSource({
  name: 'MockSource1',
  filters: mockFilters as any,
  host: 'https://mocksourceone.com/',
  language: 'en',
  genres: [],
  icon: '',
  hasLatestMangas: true,
  hasMangaDirectory: true,
  hasTrendingMangas: true,
  version: '1',
  containsNSFW: false,
});

const MockSource2Instance = new MockSource({
  name: 'MockSource2',
  filters: mockFilters as any,
  host: 'https://mocksourcetwo.com/',
  language: 'en',
  genres: [],
  icon: '',
  hasLatestMangas: true,
  hasMangaDirectory: true,
  hasTrendingMangas: true,
  version: '1',
  containsNSFW: false,
});

const MockSource3Instance = new MockSource({
  name: 'MockSource3',
  filters: mockFilters as any,
  host: 'https://mocksourcethree.com/',
  language: 'en',
  genres: [],
  icon: '',
  hasLatestMangas: true,
  hasMangaDirectory: true,
  hasTrendingMangas: true,
  version: '1',
  containsNSFW: false,
});

test('fetches with sources', () => {
  useExploreStore.setState({
    pinnedSources: [MockSource1Instance, MockSource2Instance],
  });
  expect(
    useExploreStore.getState().getMangasFromPinnedSources(),
  ).resolves.toEqual({
    latest: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource1', t: 'two' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource1', t: 'three' },
        { __source__: 'MockSource2', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
    trending: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource1', t: 'two' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource1', t: 'three' },
        { __source__: 'MockSource2', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
  } as FetchedMangaResults);
});

test('works with no sources', () => {
  expect(
    useExploreStore.getState().getMangasFromPinnedSources(),
  ).resolves.toEqual({
    latest: {
      errors: [],
      mangas: [],
    },
    trending: {
      errors: [],
      mangas: [],
    },
  } as FetchedMangaResults);
});

test('works with manga list returned great/less than others', () => {
  jest
    .spyOn(MockSource1Instance, 'trending')
    .mockImplementationOnce(() => Promise.resolve([{ t: 'one' }]));
  jest
    .spyOn(MockSource1Instance, 'latest')
    .mockImplementationOnce(() => Promise.resolve([{ t: 'one' }]));

  jest
    .spyOn(MockSource3Instance, 'trending')
    .mockImplementationOnce(() =>
      Promise.resolve([
        { t: 'one' },
        { t: 'two' },
        { t: 'three' },
        { t: 'four' },
        { t: 'five' },
      ]),
    );
  jest
    .spyOn(MockSource3Instance, 'latest')
    .mockImplementationOnce(() =>
      Promise.resolve([
        { t: 'one' },
        { t: 'two' },
        { t: 'three' },
        { t: 'four' },
        { t: 'five' },
      ]),
    );
  useExploreStore.setState({
    pinnedSources: [
      MockSource1Instance,
      MockSource2Instance,
      MockSource3Instance,
    ],
  });
  expect(
    useExploreStore.getState().getMangasFromPinnedSources(),
  ).resolves.toEqual({
    latest: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource3', t: 'one' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource3', t: 'two' },
        { __source__: 'MockSource2', t: 'three' },
        { __source__: 'MockSource3', t: 'three' },
        { __source__: 'MockSource3', t: 'four' },
        { __source__: 'MockSource3', t: 'five' },
      ] as (MangaResult & { t: string })[],
    },
    trending: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource3', t: 'one' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource3', t: 'two' },
        { __source__: 'MockSource2', t: 'three' },
        { __source__: 'MockSource3', t: 'three' },
        { __source__: 'MockSource3', t: 'four' },
        { __source__: 'MockSource3', t: 'five' },
      ] as (MangaResult & { t: string })[],
    },
  } as FetchedMangaResults);
});

test('errors are in result', () => {
  jest
    .spyOn(MockSource1Instance, 'trending')
    .mockImplementationOnce(() => Promise.reject(new Error('error')));
  useExploreStore.setState({
    pinnedSources: [MockSource1Instance, MockSource2Instance],
  });

  expect(
    useExploreStore.getState().getMangasFromPinnedSources(),
  ).resolves.toEqual({
    trending: {
      errors: [
        {
          status: SourceStatus.ERROR,
          error: 'error',
          source: 'MockSource1',
        },
      ],
      mangas: [
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource2', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
    latest: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource1', t: 'two' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource1', t: 'three' },
        { __source__: 'MockSource2', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
  } as FetchedMangaResults);

  jest
    .spyOn(MockSource2Instance, 'latest')
    .mockImplementationOnce(() => Promise.reject(new Error('error')));

  expect(
    useExploreStore.getState().getMangasFromPinnedSources(),
  ).resolves.toEqual({
    trending: {
      errors: [],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource2', t: 'one' },
        { __source__: 'MockSource1', t: 'two' },
        { __source__: 'MockSource2', t: 'two' },
        { __source__: 'MockSource1', t: 'three' },
        { __source__: 'MockSource2', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
    latest: {
      errors: [
        {
          error: 'error',
          source: 'MockSource2',
          status: SourceStatus.ERROR,
        },
      ],
      mangas: [
        { __source__: 'MockSource1', t: 'one' },
        { __source__: 'MockSource1', t: 'two' },
        { __source__: 'MockSource1', t: 'three' },
      ] as (MangaResult & { t: string })[],
    },
  } as FetchedMangaResults);
});

test('actual sources get added', () => {
  useExploreStore.getState().pinSource(MangaSee.NAME);
  useExploreStore.getState().pinSource(MangaParkV5.NAME);
  expect(useExploreStore.getState().pinnedSources).toContain(MangaSee);
  expect(useExploreStore.getState().pinnedSources).toContain(MangaParkV5);

  useExploreStore.getState().unpinSource(MangaSee.NAME);
  expect(useExploreStore.getState().pinnedSources).not.toContain(MangaSee);

  useExploreStore.getState().unpinSource(MangaParkV5.NAME);
  expect(useExploreStore.getState().pinnedSources).not.toContain(MangaParkV5);
});

test('persisted properties saved in mmkv', async () => {
  useExploreStore.getState().pinSource(MangaSee.NAME);
  useExploreStore.getState().pinSource(MangaParkV5.NAME);
  expect(mmkv.contains('explore')).toBeTruthy();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { state } = JSON.parse(mmkv.getString('explore')!);
  expect(state.pinnedSources).toEqual([
    MangaSee.toJSON(),
    MangaParkV5.toJSON(),
  ]);
  expect(Object.keys(state)).toEqual(['pinnedSources']);

  useExploreStore.getState().pinnedSources = [];

  await useExploreStore.persist.rehydrate();

  expect(useExploreStore.getState().pinnedSources).toEqual([
    MangaSee,
    MangaParkV5,
  ]);
});
