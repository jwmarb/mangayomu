import displayMessage from '@helpers/displayMessage';
import { MangaHost } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HostState {
  name: string | null;
}

const initialState: HostState = {
  name: null,
};

export const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    changeSource: (state, action: PayloadAction<string>) => {
      const source = MangaHost.getAvailableSources().get(action.payload);
      if (source == null)
        throw Error(`${action.payload} does not exist as a manga source.`);
      state.name = action.payload;
      displayMessage(`Set ${action.payload} as main source`);
    },
  },
});

export const { changeSource } = hostSlice.actions;
export default hostSlice.reducer;
