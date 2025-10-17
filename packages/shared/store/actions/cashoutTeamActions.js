import { 
  setDefaultCashoutTeam, 
  clearDefaultCashoutTeam, 
  setCashoutTeamLoading, 
  setCashoutTeamError 
} from '../slices/cashoutTeamSlice';

// Action creators for cashout team management
export const cashoutTeamActions = {
  // Set the default cashout team
  setDefaultTeam: (teamName) => (dispatch) => {
    try {
      dispatch(setCashoutTeamLoading(true));
      dispatch(setDefaultCashoutTeam(teamName));
      dispatch(setCashoutTeamLoading(false));
    } catch (error) {
      dispatch(setCashoutTeamError(error.message));
    }
  },

  // Clear the default cashout team
  clearDefaultTeam: () => (dispatch) => {
    dispatch(clearDefaultCashoutTeam());
  },

  // Set loading state
  setLoading: (isLoading) => (dispatch) => {
    dispatch(setCashoutTeamLoading(isLoading));
  },

  // Set error state
  setError: (error) => (dispatch) => {
    dispatch(setCashoutTeamError(error));
  }
};

// Export individual actions for direct use
export { 
  setDefaultCashoutTeam, 
  clearDefaultCashoutTeam, 
  setCashoutTeamLoading, 
  setCashoutTeamError 
};
