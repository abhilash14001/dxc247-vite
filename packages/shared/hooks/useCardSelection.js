import { useSelector, useDispatch } from 'react-redux';
import { 
    selectCard, 
    removeCard, 
    clearBetTypeSelection, 
    clearAllSelections, 
    resetCardSelection,
    setBetType,
    selectSelectedCards,
    selectCurrentBetType,
    selectIsSelectionComplete,
    selectSelectedCardsForBetType,
    selectSelectedCardCount,
    
} from '../store/slices/cardSelectionSlice';

// Custom hook for card selection functionality
export const useCardSelection = () => {
    const dispatch = useDispatch();
    
    // Selectors
    const selectedCards = useSelector(selectSelectedCards);
    const currentBetType = useSelector(selectCurrentBetType);
    const isSelectionComplete = useSelector(selectIsSelectionComplete);

    // Actions
    const handleSelectCard = (betType, cardValue) => {
        dispatch(selectCard({ betType, cardValue }));
    };

    const handleRemoveCard = (betType, cardValue) => {
        dispatch(removeCard({ betType, cardValue }));
    };

    const handleClearBetTypeSelection = (betType) => {
        dispatch(clearBetTypeSelection({ betType }));
    };

    const handleClearAllSelections = () => {
        dispatch(clearAllSelections());
    };

    const handleResetCardSelection = () => {
        dispatch(resetCardSelection());
    };

    const handleSetBetType = (betType) => {
        dispatch(setBetType(betType));
    };

    // Helper functions
    const getSelectedCardsForBetType = (betType) => {
        return selectedCards[betType] || [];
    };

    const getSelectedCardCount = (betType) => {
        return selectedCards[betType]?.length || 0;
    };

    const isCardSelected = (betType, cardValue) => {
        return selectedCards[betType]?.includes(cardValue) || false;
    };

    const getSelectedCardsAsString = (betType) => {
        const cards = selectedCards[betType] || [];
        return cards.join(' ');
    };

    const canSelectMore = (betType) => {
        const count = getSelectedCardCount(betType);
        return count < 3;
    };

    const isBetTypeBlocked = (betType) => {
        return currentBetType && currentBetType !== betType;
    };

    const canSelectInBetType = (betType) => {
        return !currentBetType || currentBetType === betType;
    };

    return {
        // State
        selectedCards,
        currentBetType,
        isSelectionComplete,
        
        // Actions
        selectCard: handleSelectCard,
        removeCard: handleRemoveCard,
        clearBetTypeSelection: handleClearBetTypeSelection,
        clearAllSelections: handleClearAllSelections,
        resetCardSelection: handleResetCardSelection,
        setBetType: handleSetBetType,
        
        // Helper functions
        getSelectedCardsForBetType,
        getSelectedCardCount,
        isCardSelected,
        getSelectedCardsAsString,
        canSelectMore,
        isBetTypeBlocked,
        canSelectInBetType
    };
};

// Hook for specific bet type selection
export const useBetTypeCardSelection = (betType) => {
    const dispatch = useDispatch();
    const selectedCards = useSelector(selectSelectedCardsForBetType(betType));
    const selectedCount = useSelector(selectSelectedCardCount(betType));
    const currentBetType = useSelector(selectCurrentBetType);
    
    const isCardSelected = (cardValue) => {
        return selectedCards?.includes(cardValue) || false;
    };

    const selectCard = (cardValue) => {
        dispatch(selectCard({ betType, cardValue }));
    };

    const removeCard = (cardValue) => {
        dispatch(removeCard({ betType, cardValue }));
    };

    const clearSelection = () => {
        dispatch(clearBetTypeSelection({ betType }));
    };

    return {
        selectedCards,
        selectedCount,
        isActive: currentBetType === betType,
        isCardSelected,
        selectCard,
        removeCard,
        clearSelection,
        canSelectMore: selectedCount < 3,
        isComplete: selectedCount === 3
    };
};
