import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Manga, MangaSource } from '@mangayomu/mangascraper';
import { createPersistConfig } from '@/utils/persist';

type SourceError = { source: string; error: string };
type ExploreState = {
  pinnedSources: MangaSource[];
  pinSource(source: string): void;
  unpinSource(source: string): void;
  getMangasFromPinnedSources(): Promise<{
    latest: {
      errors: SourceError[];
      mangas: Manga[];
    };
    trending: {
      errors: SourceError[];
      mangas: Manga[];
    };
  }>;
};

const useExploreStore = create(
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
      },
    }),
    createPersistConfig<ExploreState>({
      name: 'explore',
      version: 0,
      partialize: (state) => ({ pinnedSources: state.pinnedSources }),
    }),
  ),
);
