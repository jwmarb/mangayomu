import { Manga, MangaMeta } from '../scraper/scraper.interfaces';
import MangaParkV5 from './MangaPark_v5';
import { JSType, list, t, union } from '@mangayomu/jest-assertions';
import { Assertions } from '../utils/assertions';
let manga: Manga;
let results: Awaited<ReturnType<typeof MangaParkV5.search>>;
let meta: ReturnType<typeof MangaParkV5.meta>;

beforeAll(async () => {
  results = await MangaParkV5.search('One Piece', 1);
  manga = MangaParkV5.toManga(results[0]);
});

test('searches for manga correctly', async () => {
  const assertion: JSType<(typeof results)[number]> = {
    data: {
      name: t.string,
      tranLang: union([t.string, t.undefined]),
      urlCoverOri: union([t.string, t.null]),
      urlPath: t.string,
    },
  };
  for (let i = 0; i < results.length; i++) {
    expect(results[i]).toMatchType<(typeof results)[number]>(assertion);
  }
  expect(manga).toMatchType<Manga>(Assertions.Manga);

  const [results1, results2, results3] = await Promise.all([
    MangaParkV5.search('', 1),
    MangaParkV5.search('', 2),
    MangaParkV5.search('', 3),
  ]);
  for (let i = 0; i < results1.length; i++) {
    expect(results1[i]).toMatchType<(typeof results)[number]>(assertion);
  }

  for (let i = 0; i < results2.length; i++) {
    expect(results2[i]).toMatchType<(typeof results)[number]>(assertion);
  }

  for (let i = 0; i < results3.length; i++) {
    expect(results3[i]).toMatchType<(typeof results)[number]>(assertion);
  }
});

test('gets manga meta correctly', async () => {
  meta = MangaParkV5.meta(manga);

  const assertion: JSType<Awaited<typeof meta>> = {
    data: {
      get_comicNode: {
        data: {
          authors: list([t.string]),
          genres: list([t.string]),
          name: t.string,
          originalStatus: t.string,
          score_bay: t.number,
          summary: t.string,
          tranLang: t.string,
          uploadStatus: t.string,
          urlCoverOri: t.string,
          urlPath: t.string,
          votes: t.number,
        },
      },
      get_comicChapterList: list([
        {
          data: {
            dateCreate: t.number,
            dname: t.string,
            title: union([t.null, t.string]),
            urlPath: t.string,
          },
        },
      ]),
    },
  };

  expect(await meta).toMatchType<Awaited<typeof meta>>(assertion);
});

test('gets pages correctly', async () => {
  const result = MangaParkV5.toMangaMeta(await meta);
  const pages = await MangaParkV5.pages(
    MangaParkV5.toChapter(result.chapters[0]),
  );
  expect(pages).toMatchType<string[]>(list([t.string]));
});
