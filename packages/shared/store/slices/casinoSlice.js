import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubmitDisabled: true,
   
};

const casinoSlice = createSlice({
  name: "casino",
  initialState,
  reducers: {
    setIsSubmitDisabled: (state, action) => {
      state.isSubmitDisabled = action.payload;
    },
    
    resetCasinoState: () => initialState,
  },
});

export const {
  setIsSubmitDisabled,
    resetCasinoState,
} = casinoSlice.actions;

export default casinoSlice.reducer;
