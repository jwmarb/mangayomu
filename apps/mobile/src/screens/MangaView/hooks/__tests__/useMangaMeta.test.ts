import { Manga, MangaSee } from '@mangayomu/mangascraper';
import { database } from 'database';
import { Q } from '@nozbe/watermelondb';
import { getMangaMeta } from '@/screens/MangaView/hooks/useMangaMeta';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';
import { SourceTimeoutException } from '@/exceptions/SourceTimeoutException';

afterEach(async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
});

const manga: Manga = {
  link: 'https://mangasee123.com/manga/One-Piece',
  title: 'One Piece',
  imageCover: 'https://temp.compsci88.com/cover/One-Piece.jpg',
  source: 'MangaSee',
  language: 'en',
};

const controller = new AbortController();

it('gets manga meta and stores it locally in database', async () => {
  const data = await getMangaMeta({
    manga,
    database,
    source: MangaSee,
    signal: controller.signal,
  });
  const meta = data[1];
  expect(meta.link).toEqual(manga.link);
  const mangas = database.get<LocalManga>(Table.LOCAL_MANGAS);
  const found = await mangas.query(Q.where('link', meta.link));
  expect(found.length).toBeGreaterThan(0);
  expect(found[0].link).toEqual(meta.link);
});

it('falls back to local version', async () => {
  const spiedMeta = jest.spyOn(MangaSee, 'meta');
  const spiedToMangaMeta = jest.spyOn(MangaSee, 'toMangaMeta');

  // create local copy
  await getMangaMeta({
    manga,
    database,
    source: MangaSee,
    signal: controller.signal,
  });
  expect(spiedToMangaMeta).toHaveBeenCalledTimes(1);

  // mock error from fetch function
  spiedMeta.mockImplementationOnce(() => {
    throw new Error('mock error');
  });
  const data = await getMangaMeta({
    manga,
    database,
    source: MangaSee,
    signal: controller.signal,
  });
  const meta = data[1];

  expect(meta.link).toEqual(manga.link);
  expect(spiedToMangaMeta).toHaveBeenCalledTimes(1);
});

it('throws error when no local copy of manga available', () => {
  const spiedMeta = jest.spyOn(MangaSee, 'meta');
  spiedMeta.mockImplementationOnce(() => {
    throw new Error('mock error');
  });

  expect(() => {
    return getMangaMeta({
      manga,
      database,
      source: MangaSee,
      signal: controller.signal,
    });
  }).rejects.toThrow(SourceTimeoutException);
});
