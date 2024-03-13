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
        get().pinnedSources.push(MangaSource.getSource(source) as MangaSource);
        set({
          pinnedSources: Array.from(get().pinnedSources),
        });
      },
      unpinSource(source: string) {
        get().pinnedSources.splice(
          get().pinnedSources.indexOf(
            MangaSource.getSource(source) as MangaSource,
          ),
          1,
        );
        set({
          pinnedSources: Array.from(get().pinnedSources),
        });
      },
    }),
    createPersistConfig({
      name: 'explore',
      version: 0,
    }),
  ),
);
