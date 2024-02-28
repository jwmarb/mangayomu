import { getErrorMessage } from '@helpers/getErrorMessage';
import { Manga } from '@mangayomu/mangascraper/src';
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
  exitUniversalSearch,
  universalSearchResultHandler,
  setQuery,
} = browseSlice.actions;

export default browseSlice.reducer;
