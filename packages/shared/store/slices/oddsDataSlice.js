import { createSlice } from '@reduxjs/toolkit';

// Helper function to map sport types to consistent keys
const getSportKey = (activeTab) => {
  switch(activeTab) {
    case 'Cricket':
      return 'Cricket';
    case 'Tennis':
      return 'Tennis';
    case 'Football':
    case 'Soccer':
      return 'Soccer';
    default:
      return 'Cricket';
  }
};

const initialState = {
  oddsData: {
    Cricket: {}, // Separate storage for Cricket
    Tennis: {},  // Separate storage for Tennis  
    Soccer: {},  // Separate storage for Soccer
    Football: {} // Alias for Soccer
  },
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
        // Map sport types to consistent keys
        const sportKey = getSportKey(activeTab);
        
        // Only update if data has actually changed (performance optimization)
        const currentData = state.oddsData[sportKey];
        if (JSON.stringify(currentData) !== JSON.stringify(listData)) {
          state.oddsData[sportKey] = listData;
        }
      }
    },
    updateMatchOdds: (state, action) => {
      const { activeTab, matchId, oddsData } = action.payload;
      const sportKey = getSportKey(activeTab);
      if (!state.oddsData[sportKey]) {
        state.oddsData[sportKey] = {};
      }
      state.oddsData[sportKey][matchId] = oddsData;
    },
    clearOddsData: (state) => {
      state.oddsData = {
        Cricket: {},
        Tennis: {},
        Soccer: {},
        Football: {}
      };
    },
    clearTabOddsData: (state, action) => {
      const { activeTab } = action.payload;
      const sportKey = getSportKey(activeTab);
      if (state.oddsData[sportKey]) {
        state.oddsData[sportKey] = {};
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
export const selectOddsDataByTab = (state, activeTab) => {
  const sportKey = getSportKey(activeTab);
  return state.oddsData.oddsData[sportKey] || {};
};

export const selectMatchOdds = (state, activeTab, matchId) => {
  const sportKey = getSportKey(activeTab);
  
  const tabData = state.oddsData.oddsData[sportKey];
  if (tabData) {
    return Object.values(tabData).find(item => item.gmid === parseInt(matchId)) || {};
  }
  return {};
};

export default oddsDataSlice.reducer;
