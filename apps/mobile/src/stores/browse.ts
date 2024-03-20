import { create } from 'zustand';
import {
  MangaSource,
  PromiseCancelledException,
} from '@mangayomu/mangascraper';
import { useExploreStore } from '@/stores/explore';
import { getErrorMessage } from '@/utils/helpers';

const TTL = 1000 * 60 * 3; // 3 minutes

type SourceBrowseState =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'done'; mangas: unknown[] };

const cache = new Map<string, { expiration: number; result: unknown[] }>();

export type BrowseState = {
  searchResults: Record<string, SourceBrowseState>;
  abortController?: AbortController;
  query: string;
  setQuery: (query: string) => void;
  searchMangasFromPinnedSources(): void;
  /**
   * Performs a basic search query for the source. This method cannot be called alone.
   * @param source A MangaSource class
   */
  searchMangasFromSource(source: MangaSource): void;

  /**
   * Cancels all pending searches
   */
  cancelPendingSearches(): void;

  /**
   * Generates a cache key from query and the source
   * @param source A MangaSource class
   */
  transformToCacheKey(source: MangaSource): string;
};

export const useBrowseStore = create<BrowseState>((set, get) => ({
  searchResults: {},
  query: '',
  setQuery(query: string) {
    get().cancelPendingSearches();
    set({ query: query.toLowerCase().trim() });
    get().searchMangasFromPinnedSources();
  },
  searchMangasFromPinnedSources() {
    const abortController = new AbortController();
    set({ abortController });
    const pinnedSources = useExploreStore.getState().pinnedSources;

    // initializes loading state
    const searchResults: Record<string, SourceBrowseState> = {};
    for (const source of pinnedSources) {
      searchResults[source.NAME] = { state: 'loading' };
    }
    if (!abortController.signal.aborted) set({ searchResults });
    for (const source of pinnedSources) {
      if (!abortController.signal.aborted) get().searchMangasFromSource(source);
    }
  },
  cancelPendingSearches() {
    get().abortController?.abort();
  },
  transformToCacheKey(source: MangaSource) {
    return `${source.NAME}/${get().query}`;
  },
  async searchMangasFromSource(source: MangaSource) {
    const signal = get().abortController?.signal;
    const query = get().query;
    const cacheKey = get().transformToCacheKey(source);
    const cached = cache.get(cacheKey);
    if (cached != null && Date.now() - cached.expiration > 0) {
      set({
        searchResults: {
          ...get().searchResults,
          [source.NAME]: { state: 'done', mangas: cached.result },
        },
      });
      return;
    } else {
      cache.delete(cacheKey);
    }

    try {
      const mangas = await source.search(query, 1, signal);
      if (!signal?.aborted)
        set({
          searchResults: {
            ...get().searchResults,
            [source.NAME]: { state: 'done', mangas },
          },
        });
      cache.set(cacheKey, { expiration: Date.now() + TTL, result: mangas });
    } catch (e) {
      if (e instanceof PromiseCancelledException === false && !signal?.aborted)
        set({
          searchResults: {
            ...get().searchResults,
            [source.NAME]: { state: 'error', error: getErrorMessage(e) },
          },
        });
    }
  },
}));
