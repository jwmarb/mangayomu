import { getErrorMessage } from '@helpers/getErrorMessage';
import { Manga } from '@mangayomu/mangascraper';
import { StatusAPI } from '@redux/slices/explore';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BrowseState {
  states: Record<
    string,
    {
      status: StatusAPI;
      error: string;
      mangas: Manga[];
    }
  >;
  inputSubmitted: boolean;
  loading: boolean;
  query: string;
}

const initialBrowseState: BrowseState = {
  states: {},
  inputSubmitted: false,
  loading: false,
  query: '',
};

const browseSlice = createSlice({
  name: 'browse',
  initialState: initialBrowseState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    universalSearchResultHandler: (
      state,
      action: PayloadAction<
        PromiseSettledResult<{
          source: string;
          manga: Manga[];
        }>[]
      >,
    ) => {
      for (const result of action.payload) {
        switch (result.status) {
          case 'fulfilled':
            if (state.inputSubmitted) {
              state.states[result.value.source].status = 'done';
              state.states[result.value.source].mangas = result.value.manga;
            }
            break;
          case 'rejected':
            state.states[result.reason.source].error = getErrorMessage(
              result.reason.error,
            );
            state.states[result.reason.source].status = 'failed_with_errors';
            break;
        }
        state.loading = false;
      }
    },
    initializeUniversalSearch: (state, action: PayloadAction<string[]>) => {
      state.inputSubmitted = true;
      for (const source of action.payload) {
        state.states[source] = { status: 'loading', error: '', mangas: [] };
      }
      state.loading = true;
    },
    appendUniversalSearchResults: (
      state,
      action: PayloadAction<{ source: string; results: Manga[] }>,
    ) => {
      if (state.inputSubmitted) {
        state.states[action.payload.source].status = 'done';
        state.states[action.payload.source].mangas = action.payload.results;
        for (const source in state.states) {
          if (state.states[source].status === 'loading') {
            state.loading = true;
            break;
          } else state.loading = false;
        }
      }
    },
    errorUniversalSearchResults: (
      state,
      action: PayloadAction<{ source: string; error: unknown }>,
    ) => {
      state.states[action.payload.source].error = getErrorMessage(
        action.payload.error,
      );
      state.states[action.payload.source].status = 'failed_with_errors';
    },
    exitUniversalSearch: (state) => {
      state.states = {};
      state.inputSubmitted = false;
      state.loading = false;
      state.query = '';
    },
  },
});
export const {
  initializeUniversalSearch,
  appendUniversalSearchResults,
  errorUniversalSearchResults,
  exitUniversalSearch,
  universalSearchResultHandler,
  setQuery,
} = browseSlice.actions;

export default browseSlice.reducer;
