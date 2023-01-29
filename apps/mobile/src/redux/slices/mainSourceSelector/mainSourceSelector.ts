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
  reversed: boolean;
  sort: keyof typeof SORT_HOSTS_BY;
  filters: {
    showNSFW: FilterState;
    hasHotUpdates: FilterState;
    hasLatestUpdates: FilterState;
    hasMangaDirectory: FilterState;
  };
}

const initialMainSourceSelectorState: MainSourceSelectorState = {
  reversed: false,
  sort: 'Alphabetically',
  filters: {
    showNSFW: FilterState.ANY,
    hasHotUpdates: FilterState.INCLUDE,
    hasLatestUpdates: FilterState.INCLUDE,
    hasMangaDirectory: FilterState.ANY,
  },
};

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
      switch (state.filters[action.payload]) {
        case FilterState.ANY:
          state.filters[action.payload] = FilterState.INCLUDE;
          break;
        case FilterState.INCLUDE:
          state.filters[action.payload] = FilterState.EXCLUDE;
          break;
        case FilterState.EXCLUDE:
          state.filters[action.payload] = FilterState.ANY;
          break;
      }
    },
  },
});

export const { setSort, toggleReverse, applyFilter, switchStateOfFilter } =
  mainSourceSelectorSlice.actions;
export default mainSourceSelectorSlice.reducer;
