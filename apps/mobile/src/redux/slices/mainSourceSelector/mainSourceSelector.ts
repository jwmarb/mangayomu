import { SORT_HOSTS_BY } from '@redux/slices/host';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum FilterState {
  INCLUDE = 1,
  EXCLUDE = 2,
  ANY = 0,
}

export function applyFilterState(value: boolean, s: FilterState) {
  switch (s) {
    case FilterState.ANY:
      return true;
    case FilterState.EXCLUDE:
      return value === false;
    case FilterState.INCLUDE:
      return value === true;
  }
}

export type MainSourceFilterKeys = keyof MainSourceSelectorState['filters'];

interface MainSourceSelectorState {
  index: number;
  reversed: boolean;
  sort: keyof typeof SORT_HOSTS_BY;
  query: string;
  filters: {
    showNSFW: FilterState;
    hasHotUpdates: FilterState;
    hasLatestUpdates: FilterState;
    hasMangaDirectory: FilterState;
  };
}

const initialMainSourceSelectorState: MainSourceSelectorState = {
  index: 0,
  reversed: false,
  sort: 'Alphabetically',
  query: '',
  filters: {
    showNSFW: FilterState.ANY,
    hasHotUpdates: FilterState.INCLUDE,
    hasLatestUpdates: FilterState.INCLUDE,
    hasMangaDirectory: FilterState.ANY,
  },
};

export function toggleBetweenFilters(filter: FilterState) {
  switch (filter) {
    case FilterState.ANY:
      return FilterState.INCLUDE;
    case FilterState.INCLUDE:
      return FilterState.EXCLUDE;
    case FilterState.EXCLUDE:
      return FilterState.ANY;
  }
}

const mainSourceSelectorSlice = createSlice({
  initialState: initialMainSourceSelectorState,
  name: 'mainSourceSelector',
  reducers: {
    setSort: (state, action: PayloadAction<keyof typeof SORT_HOSTS_BY>) => {
      state.sort = action.payload;
    },
    toggleReverse: (state) => {
      state.reversed = !state.reversed;
    },
    applyFilter: (
      state,
      action: PayloadAction<[MainSourceFilterKeys, FilterState]>,
    ) => {
      const [key, value] = action.payload;
      state.filters[key] = value;
    },
    switchStateOfFilter: (
      state,
      action: PayloadAction<MainSourceFilterKeys>,
    ) => {
      state.filters[action.payload] = toggleBetweenFilters(
        state.filters[action.payload],
      );
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const {
  setSort,
  toggleReverse,
  applyFilter,
  switchStateOfFilter,
  setIndex,
  setQuery,
} = mainSourceSelectorSlice.actions;
export default mainSourceSelectorSlice.reducer;
