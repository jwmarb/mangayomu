import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MangaSource } from '@mangayomu/mangascraper';
import { createPersistConfig } from '@/utils/persist';

type ExploreState = {
  sources: MangaSource[];
};

const useExploreStore = create(
  persist<ExploreState>(
    (set, get) => ({
      sources: [],
    }),
    createPersistConfig({
      name: 'explore',
      version: 0,
    }),
  ),
);
