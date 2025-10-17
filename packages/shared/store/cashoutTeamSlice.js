import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cashoutTeam: null
};

const cashoutTeamSlice = createSlice({
  name: 'cashoutTeam',
  initialState,
  reducers: {
    setCashoutTeam: (state, action) => {
      state.cashoutTeam = action.payload;
    },
    clearCashoutTeam: (state) => {
      state.cashoutTeam = null;
    }
  }
});

export const { setCashoutTeam, clearCashoutTeam } = cashoutTeamSlice.actions;
export default cashoutTeamSlice.reducer;
