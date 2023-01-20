import { createSlice } from '@reduxjs/toolkit';

export const __initialSlice__ = createSlice({
  name: '__initial__',
  initialState: true,
  reducers: {
    disableWelcomeScreen: (state) => {
      state = !state;
    },
  },
});

export const { disableWelcomeScreen } = __initialSlice__.actions;

export default __initialSlice__.reducer;
