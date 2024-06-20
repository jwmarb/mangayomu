import { MangaSee } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { database } from 'database';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

afterEach(async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
});

it('creates a local manga if it does not exist in db while updating chapters', async () => {
  // toLocalManga() requires an actual manga sample to work
  const localMangas = database.get<LocalManga>(Table.LOCAL_MANGAS);
  const spiedPrepareCreate = jest.spyOn(localMangas, 'prepareCreate');
  const mangaSample = await MangaSee.meta({
    link: 'https://mangasee123.com/manga/Naruto',
  });
  const mangaMeta = MangaSee.toMangaMeta(mangaSample);
  await LocalManga.toLocalManga(mangaMeta, mangaSample, database);

  expect(spiedPrepareCreate).toHaveBeenCalledTimes(1);

  const found = await localMangas.query(Q.where('link', mangaSample.link));
  const spiedPrepareUpdate = jest.spyOn(found[0], 'prepareUpdate');
  expect(found.length).toBeGreaterThan(0);
  expect(found[0].title).toEqual(mangaMeta.title);

  await LocalManga.toLocalManga(mangaMeta, mangaSample, database);

  expect(spiedPrepareUpdate).toHaveBeenCalled();
  expect(spiedPrepareCreate).toHaveBeenCalledTimes(1);
});
