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
      unpinSource(source: string) {
        set({
          pinnedSources: get().pinnedSources.filter((x) => x.NAME !== source),
        });
      },
      getMangasFromPinnedSources: async () => {
        // todo
        const [trendingMangaResults, latestMangaResults] = await Promise.all([
          Promise.all(get().pinnedSources.map(getTrendingFromPinned)),
          Promise.all(get().pinnedSources.map(getLatestFromPinned)),
        ]);

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
        let trendingMaxCount = 0;
        let latestMaxCount = 0;

        for (let i = 0; i < trendingMangaResults.length; i++) {
          const source = trendingMangaResults[i];
          if (source.status === SourceStatus.ERROR) {
            result.trending.errors.push(source);
          } else {
            trendingMaxCount = Math.max(trendingMaxCount, source.mangas.length);
          }
        }

        for (let i = 0; i < latestMangaResults.length; i++) {
          const source = latestMangaResults[i];
          switch (source.status) {
            case SourceStatus.ERROR:
              result.latest.errors.push(source);
              break;
            case SourceStatus.OK:
              latestMaxCount = Math.max(latestMaxCount, source.mangas.length);
              break;
          }
        }

        for (let i = 0; i < latestMaxCount; i++) {
          for (let j = 0; j < latestMangaResults.length; j++) {
            const source = latestMangaResults[j];
            if (source.status === SourceStatus.OK) {
              if (i >= source.mangas.length) continue;
              const manga = source.mangas[i] as MangaResult;
              manga.__source__ = source.source;
              result.latest.mangas.push(manga);
            }
          }
        }

        for (let i = 0; i < trendingMaxCount; i++) {
          for (let j = 0; j < trendingMangaResults.length; j++) {
            const source = trendingMangaResults[j];
            if (source.status === SourceStatus.OK) {
              if (i >= source.mangas.length) continue;
              const manga = source.mangas[i] as MangaResult;
              manga.__source__ = source.source;
              result.trending.mangas.push(manga);
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
