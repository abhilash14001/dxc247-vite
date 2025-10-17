import React from 'react';

//This will create a context
export const CasinoContext = React.createContext();

// Default context values
export const defaultCasinoContext = {
    userBetData: null,
    setUserBetData: () => {},

    // New: Store multiple bets across different games
    userBets: [], // Array of bet objects
    addUserBet: () => {},
    removeUserBet: () => {},
    updateUserBet: () => {}
};