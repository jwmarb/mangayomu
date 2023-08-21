import React from 'react';
import getErrorMessage from '../helpers/getErrorMessage';
import { MangaHost, Manga } from '@mangayomu/mangascraper';
import { useAddedSources } from '@app/context/sources';
import { inPlaceSort } from 'fast-sort';
import { createWithEqualityFn } from 'zustand/traditional';
import getMangaHost from '@app/helpers/getMangaHost';
import { useMangaProxy } from '@app/context/proxy';

export interface SourceError {
  error: string;
  source: string;
}

export type MangaConcurrencyResult = {
  errors: SourceError[];
  mangas: Manga[];
};

/**
 * A hook that provides the ability to use sources that the user has selected.
 * @returns Returns combined functionality of different sources. Calling a generic method from
 */
export default function useMangaHosts() {
  const proxy = useMangaProxy();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hosts = useAddedSources(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (store) => store.sources,
  );

  const configs = useAddedSources((store) => store.sourcesConfig);
  return React.useMemo(() => {
    for (const host of hosts) {
      getMangaHost(host).proxy = proxy;
    }
    return {
      async getHotMangas(signal: AbortSignal): Promise<MangaConcurrencyResult> {
        const mangaCollection = await Promise.allSettled(
          hosts.map((x) => {
            if (configs[x].useHottestUpdates) {
              const host = getMangaHost(x);
              host.signal = signal;
              return host.listHotMangas();
            }
            return [];
          }),
        );
        const [errors, unsortedMangas] = mangaCollection.reduce(
          (prev, curr, index) => {
            if (curr.status === 'rejected')
              prev[0].push({
                source: hosts[index],
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
        for (let i = 0; i <= largestIndex; i++) {
          for (const collection of unsortedMangas) {
            if (i < collection.mangas.length) mangas.push(collection.mangas[i]);
          }
        }
        return {
          errors,
          mangas,
        };
      },
      async getLatestMangas(
        signal: AbortSignal,
      ): Promise<MangaConcurrencyResult> {
        const mangaCollection = await Promise.allSettled(
          hosts.map((x) => {
            if (configs[x].useLatestUpdates) {
              const host = getMangaHost(x);
              host.signal = signal;
              return host.listRecentlyUpdatedManga();
            }
            return [];
          }),
        );
        const [errors, unsortedMangas] = mangaCollection.reduce(
          (prev, curr, index) => {
            if (curr.status === 'rejected')
              prev[0].push({
                source: hosts[index],
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
        for (let i = 0; i <= largestIndex; i++) {
          for (const collection of unsortedMangas) {
            if (i < collection.mangas.length) mangas.push(collection.mangas[i]);
          }
        }
        return {
          errors,
          mangas,
        };
      },
      async getMangaDirectory(): Promise<MangaConcurrencyResult> {
        const mangaCollection = await Promise.allSettled(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          hosts.map((x) => MangaHost.sourcesMap.get(x)!.listMangas()),
        );
        const [errors, categorizedMangas] = mangaCollection.reduce(
          (prev, curr, index) => {
            if (curr.status === 'rejected')
              prev[0].push({
                source: hosts[index],
                error: getErrorMessage(curr.reason),
              });
            else prev[1].push({ mangas: curr.value });
            return prev;
          },
          [[], []] as [SourceError[], { mangas: Manga[] }[]],
        );
        const largestIndex = categorizedMangas.reduce(
          (prev, curr) => Math.max(0, prev, curr.mangas.length - 1),
          0,
        );
        const mangas: Manga[] = [];
        for (let i = 0; i <= largestIndex; i++) {
          for (const collection of categorizedMangas) {
            if (i < collection.mangas.length) mangas.push(collection.mangas[i]);
          }
        }
        return {
          errors,
          mangas,
        };
      },
    };
  }, [configs, hosts]);
}
