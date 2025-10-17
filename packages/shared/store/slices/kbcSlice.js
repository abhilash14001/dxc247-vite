import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedQuestions: {redBlack : null, oddEven : null, upDown : null, cardJudgement : null, suits : null},
};

const kbcSlice = createSlice({
  name: "kbc",
  initialState,
  reducers: {
    setSelectQuestions: (state, action) => {
      if (action.payload) {
       
        state.selectedQuestions = {
          ...state.selectedQuestions,
          ...action.payload
        };
      }
    },
    resetSelectQuestions: (state) => {
      state.selectedQuestions = initialState.selectedQuestions;
    }
  },
});

export const { setSelectQuestions, resetSelectQuestions } = kbcSlice.actions;
export default kbcSlice.reducer;
