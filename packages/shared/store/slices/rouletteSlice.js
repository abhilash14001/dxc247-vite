import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChip: 25,
  bets: [],
  lastBet: null,
  card: null,
  placeBets: [],
  ourroulleteRates: {Single: 0, Split: 0, Street: 0, Corner: 0},
  statisticsData: {},
};

const rouletteSlice = createSlice({
  name: "roulette",
  initialState,
  reducers: {
    selectChip: (state, action) => {
      state.selectedChip = action.payload;
    },
    resetBet: (state) => {
      state.bets = [];
      state.lastBet = null;
    },
    clearBet: (state) => {
      state.bets = [];
      state.lastBet = null;
    },
    setCard: (state, action) => {
      state.card = action.payload;
    },
    repeatBet: (state, action) => {
      if (action.payload) {
        state.bets.push(action.payload);
        state.lastBet = action.payload;
      }
    },
    setPlaceBets: (state, action) => {
      if (!state.placeBets) {
        state.placeBets = [];
      }

      
      // Always add the bet (allow multiple bets on same number)
      state.placeBets.push(action.payload);
    },
    undoBet: (state) => {
      if (state.placeBets.length > 0) {
        state.placeBets.pop();
      }
    },
    resetPlaceBets: (state) => {
      state.placeBets = [];
    },
    setOurroulleteRates: (state, action) => {
      state.ourroulleteRates = action.payload;
    },
    setStatisticsData: (state, action) => {
      state.statisticsData = action.payload;
    },
    resetState: () => initialState

  },
});

// Helper function to calculate roulette odds based on bet type and number of positions
export const calculateRouletteOdds = (n, betSide = 'back') => {
  // Define the odds mapping based on the table
  const backOdds = {
    1: 36,    // Straight bet - 35:1
    2: 18,    // Split bet - 17:1  
    3: 12,    // Street bet - 11:1
    4: 9,     // Corner bet - 8:1
    12: 3,    // Dozen bet - 2:1
    18: 2     // Half board - 1:1
  };

  const layOdds = {
    1: 40,      // Straight bet - 39:1
    2: 19.5,    // Split bet - 19.5:1
    3: 14,      // Street bet - 13:1
    4: 10.75,    // Corner bet - 9.75:1
    12: 4.25,   // Dozen bet - 3.25:1
    18: 3.1     // Half board - 2.1:1
  };

  // Get the odds based on bet side
  const oddsMap = betSide === 'lay' ? layOdds : backOdds;
  
  // Return the odds for the given number of positions, or 0 if not found
  return oddsMap[n] || 0;
};

// Helper function to get bet type name based on number of positions
export const getBetTypeName = (n) => {
  const betTypes = {
    'Single': 1,
    'Straight': 1,
    'Split': 2,
    'Street': 3,
    'Corner': 4,
    'Dozen': 12,
    'Column': 12,
    'Half': 18
  };
    
  
  return betTypes[n] || 'Unknown bet';
};


export const {
  selectChip,
  resetBet,
  clearBet,
  repeatBet,
  setCard,
  setPlaceBets, 
  resetPlaceBets,
  undoBet,
  resetState,
  setOurroulleteRates,
  setStatisticsData
} = rouletteSlice.actions;
export default rouletteSlice.reducer;
