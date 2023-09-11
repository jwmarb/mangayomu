import { inPlaceSort } from 'fast-sort';
import React from 'react';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaHost, Manga } from '@mangayomu/mangascraper/src';
import { EqualityFn } from 'react-redux';
import useAppSelector from '@hooks/useAppSelector';

export interface SourceError {
  error: string;
  source: string;
}

export type MangaConcurrencyResult = {
  errors: SourceError[];
  mangas: Manga[];
};

export const equalityMangaHostFn: EqualityFn<
  ReturnType<typeof getMangaHost>
> = (a, b) => {
  const p = new Set(a.getHosts());
  for (const source of b.getHosts()) {
    if (!p.has(source)) return false;
  }
  return true;
};

/**
 * Get the MangaHost from redux or not. Comes with safety from edge cases.
 * @param state The App state from redux
 * @param overrideSource Name of a different source. Use this parameter if the code does not need to use the user-defined selected source.
 * @returns
 */
export default function getMangaHost() {
  const p = MangaHost.sourcesMap;
  const sources = useAppSelector((state) => state.host.name);
  const configs = useAppSelector((state) => state.host.hostsConfig);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hosts = sources.map((host) => p.get(host)!);
  return React.useMemo(
    () => ({
      getHosts() {
        return sources;
      },
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
          sources,
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
            configs[x.name].useHottestUpdates
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
            configs[x.name].useLatestUpdates
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
    }),
    [sources, configs],
  );
}
