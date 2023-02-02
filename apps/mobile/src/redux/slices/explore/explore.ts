import { MangaConcurrencyResult, SourceError } from '@helpers/getMangaHost';
import { Manga } from '@mangayomu/mangascraper';
import {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo/lib/typescript/src/internal/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatusAPI =
  | 'loading'
  | 'done'
  | 'done_with_errors'
  | 'failed_with_errors';

export interface ExploreState {
  states: {
    hot: Manga[];
    latest: Manga[];
  };
  errors: {
    hot: SourceError[];
    latest: SourceError[];
  };
  status: {
    hot: StatusAPI;
    latest: StatusAPI;
  };
  internetStatus: 'offline' | 'online' | null;
}

const initialExploreState: ExploreState = {
  states: {
    hot: [],
    latest: [],
  },
  errors: {
    hot: [],
    latest: [],
  },
  status: {
    hot: 'loading',
    latest: 'loading',
  },
  internetStatus: null,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState: initialExploreState,
  reducers: {
    setExplorerState: (
      state,
      action: PayloadAction<{
        hot?: MangaConcurrencyResult;
        latest?: MangaConcurrencyResult;
      }>,
    ) => {
      if (action.payload.hot) {
        state.states.hot = action.payload.hot.mangas;
        state.errors.hot = action.payload.hot.errors;
        state.status.hot = 'done';
        if (action.payload.hot.errors.length > 0)
          state.status.hot = 'done_with_errors';
        if (
          action.payload.hot.errors.length > 0 &&
          action.payload.hot.mangas.length === 0
        )
          state.status.hot = 'failed_with_errors';
      }
      if (action.payload.latest) {
        state.states.latest = action.payload.latest.mangas;
        state.errors.latest = action.payload.latest.errors;
        state.status.latest = 'done';
        if (action.payload.latest.errors.length > 0)
          state.status.latest = 'done_with_errors';
        if (
          action.payload.latest.errors.length > 0 &&
          action.payload.latest.mangas.length === 0
        )
          state.status.latest = 'failed_with_errors';
      }
      console.log('called');
    },
    refreshExplorerState: (state) => {
      state.status.latest = 'loading';
      state.status.hot = 'loading';
    },
    explorerNetworkStateListenerHandler: (
      state,
      action: PayloadAction<NetInfoState>,
    ) => {
      if (!action.payload.isInternetReachable) state.internetStatus = 'offline';
      else state.internetStatus = 'online';
    },
  },
});

export const {
  setExplorerState,
  refreshExplorerState,
  explorerNetworkStateListenerHandler,
} = exploreSlice.actions;

export default exploreSlice.reducer;
