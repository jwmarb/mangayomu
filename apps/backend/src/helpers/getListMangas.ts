import {
  SourceError,
  SourceManga,
  redis,
  slugify,
  getErrorMessage,
  ISourceManga,
} from '../';
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
  const s = performance.now();
  const cachedValues = await redis.mget(
    sources.map((source) => source + '/' + key),
  );
  const setExpPipeline = redis.pipeline();

  const mangaCollection = await Promise.allSettled(
    sources.map(async (source, i) => {
      const cached = cachedValues[i];
      const host = MangaHost.sourcesMap.get(source);
      if (host == null) throw new Error(`Invalid host "${source}"`);
      if (cached) return JSON.parse(cached) as Manga[];

      try {
        const data = await host[mangaFetchFn]();
        setExpPipeline.setex(source + '/' + key, 60, JSON.stringify(data));
        return data;
      } catch (e) {
        throw new Error(
          `Failed getting updates with fetch implementation. Got error: ${getErrorMessage(
            e,
          )}`,
        );
      }
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
  const sourceMangas: Parameters<
    typeof SourceManga.bulkWrite<ISourceManga>
  >[0] = [];
  const hasMissedCache = cachedValues.some((val) => val == null);
  const uniq = new Set<string>();
  for (let i = 0; i <= largestIndex; i++) {
    for (const collection of unsortedMangas) {
      if (i < collection.mangas.length) {
        mangas.push(collection.mangas[i]);
        if (hasMissedCache) {
          const _id = getId(collection.mangas[i]);
          if (!uniq.has(_id)) {
            uniq.add(_id);
            sourceMangas.push({
              updateOne: {
                upsert: true,
                filter: { _id },
                update: [
                  {
                    $set: { _id, ...collection.mangas[i] },
                  },
                ],
              },
            });
          }
        }
      }
    }
  }

  if (hasMissedCache)
    await Promise.all([
      SourceManga.bulkWrite(sourceMangas),
      setExpPipeline.exec(),
    ]);

  return { runtime: performance.now() - s, errors, mangas };
}

function getId(manga: Manga) {
  return `${slugify(manga.source)}/${slugify(manga.title)}`;
}
