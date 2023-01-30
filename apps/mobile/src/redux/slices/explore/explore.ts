import { MangaConcurrencyResult, SourceError } from '@helpers/getMangaHost';
import { Manga } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ExploreState {
  hot: Manga[];
  latest: Manga[];
  errors: {
    hot: SourceError[];
    latest: SourceError[];
  };
}

const initialExploreState: ExploreState = {
  hot: [],
  latest: [],
  errors: {
    hot: [],
    latest: [],
  },
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState: initialExploreState,
  reducers: {
    setExplorerState: (
      state,
      action: PayloadAction<{
        hot: MangaConcurrencyResult;
        latest: MangaConcurrencyResult;
      }>,
    ) => {
      state.hot = action.payload.hot.mangas;
      state.latest = action.payload.latest.mangas;
      state.errors = {
        hot: action.payload.hot.errors,
        latest: action.payload.latest.errors,
      };
    },
  },
});

export const { setExplorerState } = exploreSlice.actions;

export default exploreSlice.reducer;
