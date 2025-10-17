import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
  isFetching: false,
  liveModeData: [],
  theme: {
    // User theme
    primary: '#0383C4',
    primary90: '#0383C4E6',
    primary65: '#0383C4A5',
    textPrimary: '#FFFFFF',
    secondary: '#000000',
    secondary70: '#000000B3',
    secondary85: '#000000D9',
    textSecondary: '#FFFFFF',
    news: ''
  },
  adminTheme: {
    // Admin theme
    primary: '#A26C6C',
    secondary: '#A26C6C',
    gradient: {
      from: '#A26C6C',
      to: '#A26C6C'
    }
  }
};

const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
    setCommonData: (state, action) => {
      
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
      state.isFetching = false;
    },
    setCommonDataLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    updateStakeValues: (state, action) => {
      if (state.data && state.data.stake_values) {
        state.data.stake_values = action.payload;
      }
    },
    setCommonDataError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isFetching = false;
    },
    setLiveModeData: (state, action) => {
      state.liveModeData = action.payload;
    },
    clearLiveModeData: (state) => {
      state.liveModeData = [];
    },
    setTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    setAdminTheme: (state, action) => {
      state.adminTheme = { ...state.adminTheme, ...action.payload };
    },
    resetTheme: (state) => {
      state.theme = initialState.theme;
    },
    resetAdminTheme: (state) => {
      state.adminTheme = initialState.adminTheme;
    },
    // Latest Events reducers
    
    resetCommonDataState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCommonData,
  setCommonDataLoading,
  setCommonDataError,
  setFetching,
  updateStakeValues,
  setLiveModeData,
  clearLiveModeData,
  setTheme,
  setAdminTheme,
  resetTheme,
  resetAdminTheme,
  
  resetCommonDataState,
} = commonDataSlice.actions;

export default commonDataSlice.reducer;
