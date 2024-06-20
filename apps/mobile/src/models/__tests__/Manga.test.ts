import { Manga as MManga, MangaSee } from '@mangayomu/mangascraper';
import { database } from 'database';
import { Manga } from '@/models/Manga';

afterEach(async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
});

const mockManga: MManga = {
  link: 'hi',
  source: MangaSee.NAME,
  title: 'mock manga',
};

it('creates a manga if it does not exist in db and returns an existing one', async () => {
  const createSpy = jest.spyOn(Manga, 'create');
  const manga = await Manga.toManga(mockManga, database);
  expect(manga.link).toEqual('hi');
  expect(manga.title).toEqual('mock manga');
  expect(createSpy).toHaveBeenCalledTimes(1);

  const manga2 = await Manga.toManga(mockManga, database);
  expect(manga2.id).toEqual(manga.id);
  expect(createSpy).toHaveBeenCalledTimes(1);
});
