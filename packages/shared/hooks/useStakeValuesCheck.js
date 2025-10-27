import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStakeValues } from '../store/slices/commonDataSlice';
import { useStake } from '../contexts/StakeContext';

/**
 * Custom hook to check and dispatch stake values when they're empty
 * Follows DRY principle by centralizing stake values logic
 */
const useStakeValuesCheck = () => {
  const dispatch = useDispatch();
  const { stakeValues, refreshStakeValues } = useStake();
  const commonData = useSelector((state) => state.commonData?.data);

  const checkAndDispatchStakeValues = () => {
    // Check if stakeValues is empty or has no values
    
    if (!stakeValues || Object.keys(stakeValues).length === 0) {
      // If we have common data with stake values, dispatch them
      if (commonData && commonData.stake_values) {
        dispatch(updateStakeValues(commonData.stake_values));
      } else {
        // If no common data, try to refresh stake values
        refreshStakeValues();
      }
    }
  };

  // Check and dispatch stake values when component mounts or stakeValues changes
  useEffect(() => {
    checkAndDispatchStakeValues();
  }, [stakeValues, commonData]);

  return {
    checkAndDispatchStakeValues,
    stakeValues,
    refreshStakeValues
  };
};

export default useStakeValuesCheck;
