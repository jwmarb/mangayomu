import integrateSortedList from '@helpers/integrateSortedList';
import { MangaHost } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HostState {
  name: string[];
  comparatorKey: keyof typeof SORT_HOSTS_BY;
  reversed: boolean;
  suspendRendering: boolean;
}

const initialState: HostState = {
  name: [],
  comparatorKey: 'Alphabetically',
  reversed: false,
  suspendRendering: false,
};

export const SORT_HOSTS_BY = {
  Alphabetically: (reversed: boolean) => (n1: string, n2: string) =>
    reversed ? n2.localeCompare(n1) : n1.localeCompare(n2),
  Version: (reversed: boolean) => (n1: string, n2: string) => {
    const source1 = MangaHost.getAvailableSources().get(n1);
    const source2 = MangaHost.getAvailableSources().get(n2);
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
    addSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.getAvailableSources().get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      integrateSortedList(
        state.name,
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      ).add(source.getName());
    },
    removeSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.getAvailableSources().get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      integrateSortedList(
        state.name,
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      ).remove(source.getName());
    },
    toggleReversedList: (state) => {
      state.reversed = !state.reversed;
    },
    sortHostsBy: (state, action: PayloadAction<keyof typeof SORT_HOSTS_BY>) => {
      state.comparatorKey = action.payload;
    },
    addAllSources: (state) => {
      const sources = MangaHost.getListSources();
      state.name = sources.sort(
        SORT_HOSTS_BY[state.comparatorKey](state.reversed),
      );
    },
    removeAllSources: (state) => {
      state.name = [];
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
} = hostSlice.actions;
export default hostSlice.reducer;
