import displayMessage from '@helpers/displayMessage';
import integrateSortedList from '@helpers/integrateSortedList';
import { Comparator } from '@mangayomu/algorithms';
import { MangaHost } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HostState {
  name: string[]
  comparatorKey: keyof typeof SORT_HOSTS_BY
}

const initialState: HostState = {
  name: [],
  comparatorKey: 
};

export const SORT_HOSTS_BY = {
  'Alphabetically': (n1: string, n2: string) => n1.localeCompare(n2),
  'Version': (n1: string, n2: string) => {
    const source1 = MangaHost.getAvailableSources().get(n1);
    const source2 = MangaHost.getAvailableSources().get(n2);
    if (source1 == null || source2 == null) throw Error(`Cannot compare sources that do not exist.`);
    return source1.getVersion().localeCompare(source2.getVersion());

  }
} as const
export const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    addSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.getAvailableSources().get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      integrateSortedList(state.name, ).add(source.getName());
      displayMessage(`Set ${action.payload} as main source`);
    },
    removeSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.getAvailableSources().get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      state.name.delete(source.getName());
    },
    addSources: (state, action: PayloadAction<string[]>) => {
      for (const x of action.payload) {
        const source = MangaHost.getAvailableSources().get(x);
        if (source == null)
          throw Error(`${action.payload} does not exist as a manga source.`);
        state.name.add(source.getName());
      }
    },
    removeSources: (state, action: PayloadAction<string[]>) => {
      for (const x of action.payload) {
        const source = MangaHost.getAvailableSources().get(x);
        if (source == null)
          throw Error(`${action.payload} does not exist as a manga source.`);
        state.name.delete(source.getName());
      }
    },
  },
});

export const { addSource, addSources, removeSource, removeSources } =
  hostSlice.actions;
export default hostSlice.reducer;
