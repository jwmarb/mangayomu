import { Page } from 'puppeteer';
import {
  SourceError,
  SourceManga,
  redis,
  slugify,
  getErrorMessage,
  ISourceManga,
} from '../';
import { launchPuppeteer } from '@mangayomu/puppeteer';
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
  let client: Awaited<ReturnType<typeof launchPuppeteer>> | null = null;

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
        console.error(
          `Failed getting updates with fetch implementation. Got error: ${getErrorMessage(
            e,
          )}`,
        );
        if (client == null) {
          console.log(`launching puppeteer for ${source}`);
          client = await launchPuppeteer();
        }
        let page: Page;
        switch (i) {
          case 0:
            page = (await client.pages())[0];
            break;
          default:
            page = await client.newPage();
            break;
        }
        await page.exposeFunction('x', () => host[mangaFetchFn]());
        await page.goto(`https://${host.link}/duiasu8d82y8u13`, {
          waitUntil: 'domcontentloaded',
        });
        const data = await page.evaluate(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (window as typeof window & { x: () => Promise<any> }).x();
        });
        setExpPipeline.setex(source + '/' + key, 60, JSON.stringify(data));
        return data;
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
