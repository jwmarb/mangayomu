import { MangaSchema } from '@database/schemas/Manga';
import {
  FilterState,
  toggleBetweenFilters,
} from '@redux/slices/mainSourceSelector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LibrarySortOption = keyof typeof SORT_LIBRARY_BY;

export const SORT_LIBRARY_BY = {
  'Age in library': (a: MangaSchema) => a.dateAddedInLibrary,
  'Number of updates': (a: MangaSchema) => a.modifyNewChaptersCount,
  'Number of available chapters (multilingual)': (a: MangaSchema) =>
    a.chapters.length,
  'Number of available languages': (a: MangaSchema) =>
    a.availableLanguages.length,
  'Number of authors': (a: MangaSchema) => a.authors?.length ?? 1, // 1 author minimum
  Rating: (a: MangaSchema) =>
    a.rating != null
      ? typeof a.rating.value === 'string'
        ? 0
        : a.rating.value
      : 0,
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
    Sources: Record<string, undefined>;
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
    sortLibrary: (state, action: PayloadAction<LibrarySortOption>) => {
      state.sortBy = action.payload;
    },
    toggleLibraryReverse: (state) => {
      state.reversed = !state.reversed;
    },
    toggleSourceVisibility: (state, action: PayloadAction<string>) => {
      if (action.payload in state.filters.Sources) {
        delete state.filters.Sources[action.payload];
        state.numberOfSelectedSourcesInFilter++;
      } else {
        state.filters.Sources[action.payload] = undefined;
        state.numberOfSelectedSourcesInFilter--;
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
  },
});

export const {
  sortLibrary,
  toggleLibraryReverse,
  toggleGenre,
  toggleSourceVisibility,
} = librarySlice.actions;

export default librarySlice.reducer;
