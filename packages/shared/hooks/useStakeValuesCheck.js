import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStakeValues, setCommonData } from '../store/slices/commonDataSlice';
import { useStake } from '../contexts/StakeContext';
import axiosFetch, { getCurrentToken } from '../utils/Constants';

/**
 * Custom hook to check and dispatch stake values when they're empty
 * Follows DRY principle by centralizing stake values logic
 */
const useStakeValuesCheck = () => {
  const dispatch = useDispatch();
  const { stakeValues, refreshStakeValues, setStakeValues } = useStake();
  const commonData = useSelector((state) => state.commonData?.data);
  const hasFetchedRef = useRef(false);

  // Check and dispatch stake values when component mounts or stakeValues changes
  useEffect(() => {
    // Only proceed if stakeValues is empty and we haven't fetched yet
    if ((!stakeValues || Object.keys(stakeValues).length === 0) && !hasFetchedRef.current) {
      // Always fetch from API when stakeValues is empty (only once)
      hasFetchedRef.current = true;
      const fetchStakeValues = async () => {
        try {
          const token = getCurrentToken();
          if (!token) {
            
            hasFetchedRef.current = false;
            return;
          }

          const response = await axiosFetch('common_detail_data', 'get');
          
          if (response && response.data) {
            // Update common data in Redux
            dispatch(setCommonData(response.data));
            
            // Set stake values if available
            if (response.data.stake_values) {
              dispatch(updateStakeValues(response.data.stake_values));
              setStakeValues(response.data.stake_values);
            }
          }
        } catch (error) {
          console.error('Error fetching stake values:', error);
          hasFetchedRef.current = false;
          // Fallback to refreshStakeValues if API call fails
          refreshStakeValues();
        }
      };

      fetchStakeValues();
    }

    
  }, [stakeValues, commonData, dispatch, setStakeValues, refreshStakeValues]);

  return {
    stakeValues,
    refreshStakeValues
  };
};

export default useStakeValuesCheck;
