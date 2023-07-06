import integrateSortedList from '@helpers/integrateSortedList';
import { MangaHost } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HostState {
  name: string[];
  pinned: Record<string, null>;
  lastUsed: string;
  comparatorKey: keyof typeof SORT_HOSTS_BY;
  reversed: boolean;
  suspendRendering: boolean;
  hostsConfig: Record<string, HostConfigState>;
}

export interface HostConfigState {
  useWithUniversalSearch: boolean;
  useLatestUpdates: boolean;
  useHottestUpdates: boolean;
}

const initialState: HostState = {
  name: [],
  pinned: {},
  lastUsed: '',
  comparatorKey: 'Alphabetically',
  reversed: false,
  suspendRendering: false,
  hostsConfig: {},
};

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
export const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    enableRerendering: (state) => {
      state.suspendRendering = false;
    },
    suspendRendering: (state) => {
      state.suspendRendering = true;
    },
    pinSource: (state, action: PayloadAction<string>) => {
      state.pinned[action.payload] = null;
    },
    unpinSource: (state, action: PayloadAction<string>) => {
      delete state.pinned[action.payload];
    },
    toggleSourcePin: (state, action: PayloadAction<string>) => {
      if (action.payload in state.pinned) delete state.pinned[action.payload];
      else state.pinned[action.payload] = null;
    },
    addSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.sourcesMap.get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      integrateSortedList(
        state.name,
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      ).add(source.name);
      if (action.payload in state.hostsConfig === false) {
        state.hostsConfig[action.payload] = {
          useWithUniversalSearch: true,
          useHottestUpdates: source.hasHotMangas(),
          useLatestUpdates: source.hasLatestMangas(),
        };
      }
    },
    removeSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.sourcesMap.get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      integrateSortedList(
        state.name,
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      ).remove(source.name);
      delete state.pinned[action.payload];
    },
    toggleReversedList: (state) => {
      state.reversed = !state.reversed;
    },
    sortHostsBy: (state, action: PayloadAction<keyof typeof SORT_HOSTS_BY>) => {
      state.comparatorKey = action.payload;
    },
    addAllSources: (state) => {
      const sources = MangaHost.sources;
      state.name = sources.sort(
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      );
      for (const name of sources) {
        if (name in state.hostsConfig === false) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const source = MangaHost.sourcesMap.get(name)!;
          state.hostsConfig[name] = {
            useWithUniversalSearch: true,
            useHottestUpdates: source.hasHotMangas(),
            useLatestUpdates: source.hasLatestMangas(),
          };
        }
      }
    },
    removeAllSources: (state) => {
      state.name = [];
      state.pinned = {};
    },
    toggleConfig: (
      state,
      action: PayloadAction<{ source: string; key: keyof HostConfigState }>,
    ) => {
      state.hostsConfig[action.payload.source][action.payload.key] =
        !state.hostsConfig[action.payload.source][action.payload.key];
    },
  },
});

export const {
  addSource,
  removeSource,
  sortHostsBy,
  toggleReversedList,
  addAllSources,
  enableRerendering,
  removeAllSources,
  suspendRendering,
  pinSource,
  unpinSource,
  toggleSourcePin,
  toggleConfig,
} = hostSlice.actions;
export default hostSlice.reducer;
