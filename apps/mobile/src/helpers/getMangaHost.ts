import integrateSortedList from '@helpers/integrateSortedList';

import { AppState } from '@redux/main';
import { inPlaceSort } from 'fast-sort';
import React from 'react';
import { getErrorMessage } from './getErrorMessage';
import { MangaHost, Manga } from '@mangayomu/mangascraper';

export interface SourceError {
  error: string;
  source: string;
}

export type MangaConcurrencyResult = {
  errors: SourceError[];
  mangas: Manga[];
};

/**
 * Get the MangaHost from redux or not. Comes with safety from edge cases.
 * @param state The App state from redux
 * @param overrideSource Name of a different source. Use this parameter if the code does not need to use the user-defined selected source.
 * @returns
 */
export default function getMangaHost(state: AppState) {
  const p = MangaHost.sourcesMap;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hosts = state.host.name.map((host) => p.get(host)!);
  return {
    getSourcesLength() {
      return hosts.length;
    },
    hasNoSources() {
      return hosts.length === 0;
    },
    /**
     * Get all genres from all sources combined, merging their genres into one array. This method is only available in a component.
     * @returns Returns [Set<genres>, Array<genres>]
     */
    getUniqGenres() {
      const set = React.useMemo(
        () => new Set(hosts.flatMap((x) => x.genres)),
        state.host.name,
      );
      return [
        set,
        React.useMemo(() => inPlaceSort([...set]).desc(), [set]),
      ] as const;
    },
    getGenres() {
      const genres = hosts
        .flatMap((x) =>
          x.genres.map((y, i) => ({ genre: y, source: x.name, index: i })),
        )
        .sort((a, b) => a.genre.localeCompare(b.genre));
      return genres;
    },
    getRawGenres() {
      return hosts.reduce((prev, curr) => {
        prev[curr.name] = curr.getFormattedGenres();
        return prev;
      }, {} as Record<string, string[]>);
    },
    async getHotMangas(): Promise<MangaConcurrencyResult> {
      const mangaCollection = await Promise.allSettled(
        hosts.map((x) =>
          state.host.hostsConfig[x.name].useHottestUpdates
            ? x.listHotMangas()
            : ([] as Manga[]),
        ),
      );
      const [errors, unsortedMangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].name,
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
    async getLatestMangas(): Promise<MangaConcurrencyResult> {
      const mangaCollection = await Promise.allSettled(
        hosts.map((x) =>
          state.host.hostsConfig[x.name].useLatestUpdates
            ? x.listRecentlyUpdatedManga()
            : ([] as Manga[]),
        ),
      );
      const [errors, unsortedMangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].name,
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
        hosts.map((x) => x.listMangas()),
      );
      const [errors, categorizedMangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].name,
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
}
