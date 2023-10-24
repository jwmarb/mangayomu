import { MangaSchema } from '@database/schemas/Manga';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LibrarySortOption = keyof typeof SORT_LIBRARY_BY;

export const SORT_LIBRARY_BY = {
  'Age in library': (a: MangaSchema) => a.dateAddedInLibrary,
  'Number of updates': (a: MangaSchema) => a.notifyNewChaptersCount,

  Source: (a: MangaSchema) => a.source,
  Title: (a: MangaSchema) => a.title,
};

export const SORT_LIBRARY_OPTIONS = Object.keys(
  SORT_LIBRARY_BY,
) as LibrarySortOption[];

export interface LibraryState {
  sortBy: LibrarySortOption;
  numberOfSelectedSourcesInFilter: number;
  numberOfFiltersApplied: number;
  reversed: boolean;
  filters: {
    Sources: Record<string, boolean>;
    Genres: Record<string, FilterState>;
  };
}

export type LibraryStateFilters = {
  title: keyof LibraryState['filters'];
  data: string[];
}[];

const initialLibraryState: LibraryState = {
  sortBy: 'Title',
  reversed: false,
  numberOfSelectedSourcesInFilter: 0,
  numberOfFiltersApplied: 0,
  filters: {
    Sources: {},
    Genres: {},
  },
};

const librarySlice = createSlice({
  name: 'library',
  initialState: initialLibraryState,
  reducers: {
    addIfNewSourceToLibrary: (state, action: PayloadAction<string>) => {
      if (action.payload in state.filters.Sources === false) {
        state.filters.Sources[action.payload] = true;
        state.numberOfSelectedSourcesInFilter++;
      }
    },
    sortLibrary: (state, action: PayloadAction<LibrarySortOption>) => {
      state.sortBy = action.payload;
    },
    toggleLibraryReverse: (state) => {
      state.reversed = !state.reversed;
    },
    toggleSourceVisibility: (state, action: PayloadAction<string>) => {
      if (state.filters.Sources[action.payload]) {
        state.filters.Sources[action.payload] = false;
        state.numberOfSelectedSourcesInFilter--;
      } else {
        state.filters.Sources[action.payload] = true;
        state.numberOfSelectedSourcesInFilter++;
      }
    },
    toggleGenre: (state, action: PayloadAction<string>) => {
      switch (state.filters.Genres[action.payload]) {
        default:
          state.filters.Genres[action.payload] = FilterState.INCLUDE;
          state.numberOfFiltersApplied++;
          break;
        case FilterState.INCLUDE:
          state.filters.Genres[action.payload] = FilterState.EXCLUDE;
          break;
        case FilterState.EXCLUDE:
          delete state.filters.Genres[action.payload];
          state.numberOfFiltersApplied--;
          break;
      }
    },
    resetFilters: (state, action: PayloadAction<string[]>) => {
      state.filters.Genres = {};
      state.numberOfSelectedSourcesInFilter = action.payload.length;
      state.numberOfFiltersApplied = 0;
      for (const source of action.payload) {
        state.filters.Sources[source] = true;
      }
    },
  },
});

export const {
  sortLibrary,
  toggleLibraryReverse,
  toggleGenre,
  toggleSourceVisibility,
  resetFilters,
  addIfNewSourceToLibrary,
} = librarySlice.actions;

export default librarySlice.reducer;
