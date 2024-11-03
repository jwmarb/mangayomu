import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MangaSource } from '@mangayomu/mangascraper';
import { MangaSourceDeserializer, createPersistConfig } from '@/utils/persist';
import { getErrorMessage } from '@/utils/helpers';

export enum SourceStatus {
  ERROR,
  OK,
}

export type MangaResult = {
  /**
   * Determines the source the manga is derived from
   */
  __source__: string;
};
export type FetchedMangaResults = {
  latest: {
    errors: SourceError[];
    mangas: MangaResult[];
  };
  trending: {
    errors: SourceError[];
    mangas: MangaResult[];
  };
};
export type SourceError = {
  status: SourceStatus.ERROR;
  source: string;
  error: string;
};
export type SourceDone = {
  status: SourceStatus.OK;
  source: string;
  mangas: unknown[];
};
export type SourceResult = SourceDone | SourceError;
type ExploreState = {
  pinnedSources: MangaSource[];
  pinSource(source: string): void;
  unpinSource(source: string): void;
  getMangasFromPinnedSources(): Promise<FetchedMangaResults>;
};

function mapPinnedSourceCreator(key: 'latest' | 'trending') {
  return async function (x: MangaSource): Promise<SourceResult> {
    try {
      const mangas = await x[key]();
      return {
        status: SourceStatus.OK,
        mangas,
        source: x.NAME,
      };
    } catch (e) {
      return {
        status: SourceStatus.ERROR,
        error: getErrorMessage(e),
        source: x.NAME,
      };
    }
  };
}

export const getTrendingFromPinned = mapPinnedSourceCreator('trending');
export const getLatestFromPinned = mapPinnedSourceCreator('latest');

export const titleMapping: Record<keyof FetchedMangaResults, string> = {
  latest: 'Recently updated 🚀',
  trending: 'Trending updates 🔥',
};

const partialize = (state: ExploreState): Partial<ExploreState> => ({
  pinnedSources: state.pinnedSources,
});

export const useExploreStore = create(
  persist<ExploreState>(
    (set, get) => ({
      pinnedSources: [],
      pinSource(source: string) {
        set({
          pinnedSources: [
            ...get().pinnedSources,
            MangaSource.getSource(source) as MangaSource,
          ],
        });
      },
      /**
       * Unpins a source from the list of pinned sources.
       * @param source - The name of the source to remove from the list.
       */
      unpinSource(source: string) {
        set({
          pinnedSources: get().pinnedSources.filter((x) => x.NAME !== source),
        });
      },
      /**
       * Fetches trending and latest manga results from all pinned sources.
       *
       * This function performs asynchronous operations to fetch both trending and latest manga results from a list of pinned sources.
       * It then processes these results to create a structured output containing the manga entries and any errors encountered during the fetching process.
       * The result object includes separate arrays for trending and latest manga, each with their own error and manga lists.
       *
       * @pre    `get().pinnedSources` must be an array of pinned sources that can provide manga data.
       *         Each source should have methods to fetch trending and latest manga results.
       * @post   The result object is populated with the fetched manga entries and any errors encountered.
       *         The original state of `get().pinnedSources` remains unchanged.
       *
       * @returns An object containing two categories: 'trending' and 'latest'.
       *          Each category has an array of manga objects (`mangas`) and an array of error objects (`errors`).
       *          - `result.trending.mangas`: Array of trending manga entries.
       *          - `result.trending.errors`: Array of errors encountered while fetching trending manga.
       *          - `result.latest.mangas`: Array of latest manga entries.
       *          - `result.latest.errors`: Array of errors encountered while fetching latest manga.
       *
       * @example
       * const result = await getMangasFromPinnedSources();
       * console.log(result.trending.mangas); // Array of trending manga entries
       * console.log(result.latest.mangas);   // Array of latest manga entries
       */
      getMangasFromPinnedSources: async () => {
        // Fetch trending and latest manga results from all pinned sources
        const [trendingMangaResults, latestMangaResults] = await Promise.all([
          Promise.all(get().pinnedSources.map(getTrendingFromPinned)),
          Promise.all(get().pinnedSources.map(getLatestFromPinned)),
        ]);

        // Initialize the result object with empty arrays for errors and mangas
        const result: FetchedMangaResults = {
          trending: {
            errors: [],
            mangas: [],
          },
          latest: {
            errors: [],
            mangas: [],
          },
        };

        // Track the maximum number of manga results from any single source for both trending and latest
        let trendingMaxCount = 0;
        let latestMaxCount = 0;

        // Process the trending manga results
        for (let i = 0; i < trendingMangaResults.length; i++) {
          const source = trendingMangaResults[i];
          if (source.status === SourceStatus.ERROR) {
            result.trending.errors.push(source); // Add error to the errors array
          } else {
            trendingMaxCount = Math.max(trendingMaxCount, source.mangas.length); // Update max count
          }
        }

        // Process the latest manga results
        for (let i = 0; i < latestMangaResults.length; i++) {
          const source = latestMangaResults[i];
          switch (source.status) {
            case SourceStatus.ERROR:
              result.latest.errors.push(source); // Add error to the errors array
              break;
            case SourceStatus.OK:
              latestMaxCount = Math.max(latestMaxCount, source.mangas.length); // Update max count
              break;
          }
        }

        // Collect manga results for the latest category
        for (let i = 0; i < latestMaxCount; i++) {
          for (let j = 0; j < latestMangaResults.length; j++) {
            const source = latestMangaResults[j];
            if (source.status === SourceStatus.OK) {
              if (i >= source.mangas.length) continue; // Skip if index is out of bounds
              const manga = source.mangas[i] as MangaResult;
              manga.__source__ = source.source; // Set the source for the manga
              result.latest.mangas.push(manga); // Add manga to the mangas array
            }
          }
        }

        // Collect manga results for the trending category
        for (let i = 0; i < trendingMaxCount; i++) {
          for (let j = 0; j < trendingMangaResults.length; j++) {
            const source = trendingMangaResults[j];
            if (source.status === SourceStatus.OK) {
              if (i >= source.mangas.length) continue; // Skip if index is out of bounds
              const manga = source.mangas[i] as MangaResult;
              manga.__source__ = source.source; // Set the source for the manga
              result.trending.mangas.push(manga); // Add manga to the mangas array
            }
          }
        }

        return result;
      },
    }),
    createPersistConfig<ExploreState>({
      name: 'explore',
      version: 0,
      partialize,
      deserializers: [MangaSourceDeserializer],
    }),
  ),
);
