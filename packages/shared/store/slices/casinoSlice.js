import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubmitDisabled: true,
  casinoList: [],
  cricketList: [],
};

const casinoSlice = createSlice({
  name: "casino",
  initialState,
  reducers: {
    setIsSubmitDisabled: (state, action) => {
      state.isSubmitDisabled = action.payload;
    },
    setCasinoList: (state, action) => {
      state.casinoList = action.payload;
    },
    setCricketList: (state, action) => {
      state.cricketList = action.payload;
    },
    resetCasinoState: () => initialState,
  },
});

export const {
  setIsSubmitDisabled,
  setCasinoList,
  setCricketList,
  resetCasinoState,
} = casinoSlice.actions;

export default casinoSlice.reducer;
