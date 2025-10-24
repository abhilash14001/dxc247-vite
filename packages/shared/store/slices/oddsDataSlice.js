import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oddsData: {}, // Structure: { [activeTab]: { [matchId]: oddsData } }
  loading: false,
  error: null,
};

const oddsDataSlice = createSlice({
  name: 'oddsData',
  initialState,
  reducers: {
    setOddsData: (state, action) => {
      const { activeTab, listData } = action.payload;
      if (listData && Object.keys(listData).length > 0) {
        // Only update if data has actually changed (performance optimization)
        const currentData = state.oddsData[activeTab];
        if (JSON.stringify(currentData) !== JSON.stringify(listData)) {
          state.oddsData[activeTab] = listData;
        }
      }
    },
    updateMatchOdds: (state, action) => {
      const { activeTab, matchId, oddsData } = action.payload;
      if (!state.oddsData[activeTab]) {
        state.oddsData[activeTab] = {};
      }
      state.oddsData[activeTab][matchId] = oddsData;
    },
    clearOddsData: (state) => {
      state.oddsData = {};
    },
    clearTabOddsData: (state, action) => {
      const { activeTab } = action.payload;
      if (state.oddsData[activeTab]) {
        delete state.oddsData[activeTab];
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setOddsData, 
  updateMatchOdds, 
  clearOddsData, 
  clearTabOddsData, 
  setLoading, 
  setError 
} = oddsDataSlice.actions;

// Selectors for better performance
export const selectOddsDataByTab = (state, activeTab) => state.oddsData.oddsData[activeTab] || {};
export const selectMatchOdds = (state, activeTab, matchId) => {
  const tabData = state.oddsData.oddsData[activeTab];
  if (tabData) {
    return Object.values(tabData).find(item => item.gmid === parseInt(matchId)) || {};
  }
  return {};
};

export default oddsDataSlice.reducer;
