import { t, list, union, JSType } from '@mangayomu/jest-assertions';
import { Assertions } from '../utils/assertions';
import MangaSee, { mapLatestHottestManga } from './MangaSee';
import { Directory, MangaSeeMangaMeta } from './MangaSee.interfaces';
import { Manga } from '../scraper/scraper.interfaces';

describe('helper functions', () => {
  it('mapLatestHottestManga', () => {
    expect(
      mapLatestHottestManga(
        [
          {
            SeriesName: 'test',
            Chapter: '',
            Date: '',
            Genres: '',
            IndexName: 'test',
            IsEdd: false,
            ScanStatus: '',
            SeriesID: '',
          },
        ],
        'test',
        '{{Result.i}}',
        'test',
      ),
    ).toBe(
      JSON.stringify([
        {
          title: 'test',
          link: 'https://test/manga/test',
          imageCover: 'test',
          source: 'test',
        },
      ]),
    );
  });
  it('getImageCover', () => {
    expect(() => MangaSee['getImageCover'](null, 'test')).toThrow(
      'HTML cannot be null to get image cover',
    );
    expect(() =>
      MangaSee['getImageCover']('<script></script>', 'test'),
    ).toThrow('Image URL base is null');
    expect(
      MangaSee['getImageCover'](
        '<script>https://imagedomain.com/{{Result.i}}.jpg</script>',
        'test',
      ),
    ).toBe('https://imagedomain.com/test.jpg');
  });
});

describe('directory', () => {
  it('gets manga directory and parses raw json', async () => {
    const directory = await MangaSee.getDirectory();
    const assertion: JSType<Directory> = {
      a: list([t.string]),
      al: list([t.string]),
      g: list([t.string]),
      h: t.boolean,
      i: t.string,
      ls: union([t.number, t.string]),
      lt: t.number as any,
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
  it('lists directory manga', () => {
    MangaSee.listMangas().then((directory) => {
      expect(directory).toBeTruthy();
      expect(directory.length).toBeGreaterThan(0);
      expect(directory).toMatchType<Manga[]>(list([Assertions.Manga]));
    });
  });
});

describe('manga type definitions scraped correctly', () => {
  it('fetches mangas', async () => {
    const mangas = await MangaSee.listHotMangas();
    expect(mangas).toBeTruthy();
    expect(mangas.length).toBeGreaterThan(0);
    expect(mangas).toMatchType<Manga[]>(list([Assertions.Manga]));
  });
  it('fetches mangas', async () => {
    const mangas = await MangaSee.listRecentlyUpdatedManga();
    expect(mangas).toBeTruthy();
    expect(mangas.length).toBeGreaterThan(0);
    expect(mangas).toMatchType<Manga[]>(list([Assertions.Manga]));
  });
  it('fetches manga meta', async () => {
    const directory = await MangaSee.listMangas();
    const randomIndices = Math.floor(directory.length * Math.random());
    const assertion: JSType<MangaSeeMangaMeta> = {
      ...Assertions.MangaMeta,
      status: {
        scan: union([t.string, t.undefined]),
        publish: t.string,
      },
      date: {
        modified: t.string,
        published: t.string,
      },
      type: t.string,
      yearReleased: t.string,
      authors: list([t.string]),
    };

    const metas = await Promise.all(
      directory
        .slice(Math.max(randomIndices - 5, 0), randomIndices)
        .map((x) => MangaSee.getMeta(x)),
    );
    expect(metas).toMatchType<MangaSeeMangaMeta[]>(list([assertion]));
  }, 30000);
  it('manga pages fetched correctly', async () => {
    const chapters = [
      'https://mangasee123.com/read-online/Heroine-Voice-chapter-10.html',
      'https://mangasee123.com/read-online/Dou-ka-Ore-wo-Houtte-Oitekure-chapter-6.html',
      'https://mangasee123.com/read-online/Itai-No-Wa-Iya-Nanode-Bougyo-ryoku-Ni-Kyokufuri-Shitai-To-Omoimasu-chapter-27.html',
      'https://mangasee123.com/read-online/Jujutsu-Kaisen-chapter-249.html',
      'https://mangasee123.com/read-online/Berserk-chapter-2.html',
    ];
    const result = await Promise.all(
      chapters.map((x) => MangaSee.getPages({ link: x })),
    );
    expect(result).toMatchType<string[][]>(list([list([t.string])]));
  });
});
