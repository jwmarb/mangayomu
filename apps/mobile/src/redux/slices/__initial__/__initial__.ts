import { createSlice } from '@reduxjs/toolkit';

export interface __InitialState__ {
  firstTimeUser: boolean;
}
const initialState: __InitialState__ = {
  firstTimeUser: true,
};

export const __initialSlice__ = createSlice({
  name: '__initial__',
  initialState,
  reducers: {
    disableWelcomeScreen: (state) => {
      state.firstTimeUser = !state.firstTimeUser;
    },
  },
});

export const { disableWelcomeScreen } = __initialSlice__.actions;

export default __initialSlice__.reducer;
