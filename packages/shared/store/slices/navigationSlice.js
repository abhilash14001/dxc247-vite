import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  navigateTo: null,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigate: (state, action) => {
      state.navigateTo = action.payload;
    },
    clearNavigation: (state) => {
      state.navigateTo = null;
    },
  },
});

export const { navigate, clearNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;
