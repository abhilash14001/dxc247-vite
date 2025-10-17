import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCards: {}, // { YES: ['card1', 'card2'], NO: ['card3'] }
  currentBetType: null, // 'YES' or 'NO'
  maxCardsPerType: 3,
  isSelectionComplete: false,
};

const cardSelectionSlice = createSlice({
  name: "cardSelection",
  initialState,
  reducers: {
    // Select a card for specific bet type
    selectCard: (state, action) => {
      const { betType, cardValue } = action.payload;

      // If there's already a current bet type and it's different, don't allow selection
      if (state.currentBetType && state.currentBetType !== betType) {
        return; // Block selection in different bet type
      }

      // Initialize array if doesn't exist
      if (!state.selectedCards[betType]) {
        state.selectedCards[betType] = [];
      }

      // Check if card already selected
      if (state.selectedCards[betType].includes(cardValue)) {
        return; // Already selected, do nothing
      }

      // Check max limit
      if (state.selectedCards[betType].length >= state.maxCardsPerType) {
        return; // Max limit reached
      }

      // Add card to selection
      state.selectedCards[betType].push(cardValue);
      state.currentBetType = betType;

      // Check if selection is complete
      state.isSelectionComplete =
        state.selectedCards[betType].length === state.maxCardsPerType;
    },

    // Remove a specific card
    removeCard: (state, action) => {
      const { betType, cardValue } = action.payload;

      if (state.selectedCards[betType]) {
        state.selectedCards[betType] = state.selectedCards[betType].filter(
          (card) => card !== cardValue
        );

        // Update completion status
        state.isSelectionComplete =
          state.selectedCards[betType] &&
          state.selectedCards[betType].length === state.maxCardsPerType;
      }
    },

    // Clear selection for specific bet type
    clearBetTypeSelection: (state, action) => {
      const { betType } = action.payload;
      delete state.selectedCards[betType];

      if (state.currentBetType === betType) {
        state.currentBetType = null;
      }
      state.isSelectionComplete = false;
    },

    // Clear all selections
    clearAllSelections: (state) => {
      state.selectedCards = {};
      state.currentBetType = null;
      state.isSelectionComplete = false;
    },

    // Reset to initial state (for bet errors)
    resetCardSelection: (state) => {
      return initialState;
    },

    // Set bet type
    setBetType: (state, action) => {
      state.currentBetType = action.payload;
    },
  },
});

export const {
  selectCard,
  removeCard,
  clearBetTypeSelection,
  clearAllSelections,
  resetCardSelection,
  setBetType,
} = cardSelectionSlice.actions;

// Selectors
export const selectSelectedCards = (state) => state.cardSelection.selectedCards;
export const selectCurrentBetType = (state) =>
  state.cardSelection.currentBetType;
export const selectIsSelectionComplete = (state) =>
  state.cardSelection.isSelectionComplete;
export const selectSelectedCardsForBetType = (betType) => (state) =>
  state.cardSelection.selectedCards[betType] || [];
export const selectSelectedCardCount = (betType) => (state) =>
  state.cardSelection.selectedCards[betType]?.length || 0;
export const selectIsCardSelected = (betType, cardValue) => (state) =>
  state.cardSelection.selectedCards[betType]?.includes(cardValue) || false;
export const selectIsBetTypeBlocked = (betType) => (state) =>
  state.cardSelection.currentBetType &&
  state.cardSelection.currentBetType !== betType;
export const selectCanSelectInBetType = (betType) => (state) =>
  !state.cardSelection.currentBetType ||
  state.cardSelection.currentBetType === betType;

export default cardSelectionSlice.reducer;
