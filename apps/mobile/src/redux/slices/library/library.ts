import { MangaSchema } from '@database/schemas/Manga';
import {
  FilterState,
  toggleBetweenFilters,
} from '@redux/slices/mainSourceSelector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LibrarySortOption = keyof typeof SORT_LIBRARY_BY;

export const SORT_LIBRARY_BY = {
  Alphabetically: (a: MangaSchema) => a.title,
  '# of updates': (a: MangaSchema) => a.modifyNewChaptersCount,
  Source: (a: MangaSchema) => a.source,
  '# of chapters': (a: MangaSchema) => a.chapters,
  'Age in library': (a: MangaSchema) => a.dateAddedInLibrary,
  '# of authors': (a: MangaSchema) => a.authors?.length ?? 0,
};

export const SORT_LIBRARY_OPTIONS = Object.keys(
  SORT_LIBRARY_BY,
) as LibrarySortOption[];

export interface LibraryState {
  sortBy: LibrarySortOption;
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
  sortBy: 'Alphabetically',
  reversed: false,
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
      state.filters.Sources[action.payload] =
        !state.filters.Sources[action.payload] ?? false;
    },
    toggleGenre: (state, action: PayloadAction<string>) => {
      state.filters.Genres[action.payload] = toggleBetweenFilters(
        state.filters.Genres[action.payload] ?? FilterState.ANY,
      );
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
