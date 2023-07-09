import { SourceError, SourceManga, redis, slugify, getErrorMessage } from '../';
import { Manga, MangaHost } from '@mangayomu/mangascraper';

export default async function getListMangas(
  sources: string[],
  key: string,
  mangaFetchFn: keyof {
    [K in keyof MangaHost as MangaHost[K] extends () => Promise<Manga[]>
      ? K
      : never]: never;
  },
) {
  let isStale = false;
  const mangaCollection = await Promise.allSettled(
    sources.map(async (source) => {
      const redisKey = source + '/' + key;
      const cached = await redis.get(redisKey);
      const host = MangaHost.sourcesMap.get(source);
      if (host == null) throw new Error(`Invalid host "${source}"`);
      if (cached == null) {
        isStale = true;
        const data = await host[mangaFetchFn]();
        await redis.setex(redisKey, 60, JSON.stringify(data));
        return data;
      }
      return JSON.parse(cached) as Manga[];
    }),
  );
  const [errors, unsortedMangas] = mangaCollection.reduce(
    (prev, curr, i) => {
      if (curr.status === 'rejected')
        prev[0].push({
          source: sources[i],
          error: getErrorMessage(curr.reason),
        });
      else prev[1].push({ mangas: curr.value });
      return prev;
    },
    [[], []] as [SourceError[], { mangas: Manga[] }[]],
  );

  const largestIndex = unsortedMangas.reduce(
    (prev, curr) => Math.max(0, prev, curr.mangas.length - 1),
    0,
  );
  const mangas: Manga[] = [];
  const sourceMangas: Parameters<typeof SourceManga.bulkWrite<SourceManga>>[0] =
    [];
  for (let i = 0; i <= largestIndex; i++) {
    for (const collection of unsortedMangas) {
      if (i < collection.mangas.length) {
        mangas.push(collection.mangas[i]);
        if (isStale) {
          const _id = getId(collection.mangas[i]);
          sourceMangas.push({
            updateOne: {
              upsert: true,
              filter: { _id },
              update: [
                {
                  $set: { _id, url: collection.mangas[i].link },
                },
              ],
            },
          });
        }
      }
    }
  }

  if (isStale)
    await Promise.all([
      SourceManga.bulkWrite(sourceMangas),
      Promise.all(
        mangas.map(async (x) => {
          const _id = getId(x);
          await redis.setex(_id, 86400, x.link);
        }),
      ),
    ]);

  return { errors, mangas };
}

function getId(manga: Manga) {
  return `${slugify(manga.source)}/${slugify(manga.title)}`;
}
