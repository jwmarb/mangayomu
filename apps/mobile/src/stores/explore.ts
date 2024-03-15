import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MangaSource } from '@mangayomu/mangascraper';
import { createPersistConfig } from '@/utils/persist';

type ExploreState = {
  pinnedSources: MangaSource[];
  pinSource(source: string): void;
  unpinSource(source: string): void;
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
    }),
    createPersistConfig({
      name: 'explore',
      version: 0,
    }),
  ),
);
