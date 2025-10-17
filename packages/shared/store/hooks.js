import { useDispatch, useSelector } from 'react-redux';
import { setCashoutTeam, clearCashoutTeam } from './cashoutTeamSlice';

// Typed hooks for better development experience
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Hook to get cashout team
export const useCashoutTeam = () => {
  return useSelector((state) => state.cashoutTeam.cashoutTeam);
};

// Hook to set cashout team
export const useSetCashoutTeam = () => {
  const dispatch = useDispatch();
  
  const setTeam = (teamName) => {
    dispatch(setCashoutTeam(teamName));
  };

  const clearTeam = () => {
    dispatch(clearCashoutTeam());
  };

  return { setTeam, clearTeam };
};

// Custom hook for team bets (if needed)
export const useTeamBets = () => {
  const dispatch = useDispatch();
  const teamBets = useSelector((state) => state.teamBets || {});

  return {
    ...teamBets,
    dispatch
  };
};
