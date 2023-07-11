import { MangaConcurrencyResult, SourceError } from '@app/hooks/useMangaHosts';
import { Manga } from '@mangayomu/mangascraper';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ExploreCategory = 'trending' | 'recent';
type ExploreFetchState = 'loading' | 'done' | 'done_with_errors';

interface ExploreStoreState {
  errors: Record<ExploreCategory, SourceError[]>;
  mangas: Record<ExploreCategory, Manga[]>;
  state: Record<ExploreCategory, ExploreFetchState>;
  appendMangas: (
    result: MangaConcurrencyResult,
    where: ExploreCategory,
  ) => void;
  appendAllMangas: (
    result: Record<ExploreCategory, MangaConcurrencyResult>,
  ) => void;
  loading: (where: ExploreCategory) => void;
  loadingAll: () => void;
}

export const useExploreStore = create(
  immer<ExploreStoreState>((set) => ({
    errors: { recent: [], trending: [] },
    mangas: { recent: [], trending: [] },
    state: { recent: 'loading', trending: 'loading' },
    appendAllMangas: (result) =>
      set((state) => {
        for (const key in result) {
          state.mangas[key as ExploreCategory] =
            result[key as ExploreCategory].mangas;
          state.errors[key as ExploreCategory] =
            result[key as ExploreCategory].errors;
          state.state[key as ExploreCategory] =
            result[key as ExploreCategory].errors.length > 0
              ? 'done_with_errors'
              : 'done';
        }
      }),
    appendMangas: (result, key) => {
      const { errors, mangas } = result;
      set((state) => {
        state.errors[key] = errors;
        state.mangas[key] = mangas;
        state.state[key] = errors.length > 0 ? 'done_with_errors' : 'done';
      });
    },
    loading: (where) =>
      set((state) => {
        state.state[where] = 'loading';
      }),
    loadingAll: () =>
      set((state) => {
        for (const key in state.state) {
          state.state[key as ExploreCategory] = 'loading';
        }
      }),
  })),
);
