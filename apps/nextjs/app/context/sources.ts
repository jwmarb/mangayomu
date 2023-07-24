import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { binary } from '@mangayomu/algorithms';
import { MangaHost } from '@mangayomu/mangascraper';

interface HostConfigState {
  useWithUniversalSearch: boolean;
  useLatestUpdates: boolean;
  useHottestUpdates: boolean;
}

interface AddedSourcesStore {
  sources: string[];
  sortBy: HostSortType;
  reversed: boolean;
  sourcesConfig: Record<string, HostConfigState>;
  addSource: (src: string) => void;
  removeSource: (src: string) => void;
}

export type HostSortType = keyof typeof SORT_HOSTS_BY;

export const SORT_HOSTS_BY = {
  Alphabetically: (reversed: boolean) => (n1: string, n2: string) =>
    reversed ? n2.localeCompare(n1) : n1.localeCompare(n2),
  Version: (reversed: boolean) => (n1: string, n2: string) => {
    const source1 = MangaHost.sourcesMap.get(n1);
    const source2 = MangaHost.sourcesMap.get(n2);
    if (source1 == null || source2 == null)
      throw Error('Cannot compare sources that do not exist.');
    return reversed
      ? source2.getVersion().localeCompare(source1.getVersion())
      : source1.getVersion().localeCompare(source2.getVersion());
  },
} as const;

export const useAddedSources = create(
  persist<AddedSourcesStore>(
    (set, get) => ({
      sources: [],
      reversed: false,
      sortBy: 'Alphabetically',
      sourcesConfig: {},
      addSource: (src: string) => {
        if (get().sources.length === 0)
          set({
            sources: [src],
            sourcesConfig: {
              ...get().sourcesConfig,
              [src]: {
                ...get().sourcesConfig[src],
                useHottestUpdates: true,
                useWithUniversalSearch: true,
                useLatestUpdates: true,
              },
            },
          });
        else {
          const newArray = [...get().sources];
          const index = binary.suggest(
            newArray,
            src,
            SORT_HOSTS_BY[get().sortBy](get().reversed),
          );
          newArray.splice(index, 0, src);
          set({
            sources: newArray,
            sourcesConfig: {
              ...get().sourcesConfig,
              [src]: {
                ...(src in get().sourcesConfig ? get().sourcesConfig[src] : {}),
                useHottestUpdates: true,
                useWithUniversalSearch: true,
                useLatestUpdates: true,
              },
            },
          });
        }
      },
      removeSource: (src: string) => {
        if (get().sources.length === 0) set({ sources: [] });
        else {
          const newArray = [...get().sources];
          const index = binary.search(
            newArray,
            src,
            SORT_HOSTS_BY[get().sortBy](get().reversed),
          );
          newArray.splice(index, 1);
          set({ sources: newArray });
        }
      },
    }),
    { name: 'sources' },
  ),
);
