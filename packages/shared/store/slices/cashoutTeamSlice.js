import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  defaultCashoutTeam: null,
  isLoading: false,
  error: null
};

const cashoutTeamSlice = createSlice({
  name: 'cashoutTeam',
  initialState,
  reducers: {
    setDefaultCashoutTeam: (state, action) => {
      state.defaultCashoutTeam = action.payload;
      state.error = null;
    },
    clearDefaultCashoutTeam: (state) => {
      state.defaultCashoutTeam = null;
      state.error = null;
    },
    setCashoutTeamLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCashoutTeamError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { 
  setDefaultCashoutTeam, 
  clearDefaultCashoutTeam, 
  setCashoutTeamLoading, 
  setCashoutTeamError 
} = cashoutTeamSlice.actions;

export default cashoutTeamSlice.reducer;
