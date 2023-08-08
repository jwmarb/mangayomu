import React from 'react';
import getErrorMessage from '../helpers/getErrorMessage';
import { MangaHost, Manga } from '@mangayomu/mangascraper';
import { useAddedSources } from '@app/context/sources';
import { inPlaceSort } from 'fast-sort';
import { createWithEqualityFn } from 'zustand/traditional';

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
  const p = MangaHost.sourcesMap;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hosts = useAddedSources(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (store) => store.sources,
  );

  const configs = useAddedSources((store) => store.sourcesConfig);
  return React.useMemo(() => {
    return {
      async getHotMangas(): Promise<MangaConcurrencyResult> {
        const response = await fetch(
          `/api/v1/trending_updates?${hosts
            .filter((x) => configs[x].useHottestUpdates)
            .map((x) => `source=${x}`)
            .join('&')}`,
        );
        const { data }: { data: MangaConcurrencyResult } =
          await response.json();
        return data;
      },
      async getLatestMangas(): Promise<MangaConcurrencyResult> {
        const response = await fetch(
          `/api/v1/recent_updates?${hosts
            .filter((x) => configs[x].useLatestUpdates)
            .map((x) => `source=${x}`)
            .join('&')}`,
        );
        const { data }: { data: MangaConcurrencyResult } =
          await response.json();
        return data;
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
