import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosFetch, { getCurrentToken } from '../utils/Constants';
import { setCommonData, setCommonDataLoading, setCommonDataError, setFetching } from '../store/slices/commonDataSlice';
import { setBannerDetails } from '../store/slices/userSlice';



// Global flag to prevent multiple simultaneous API calls
let isApiCallInProgress = false;

const useCommonData = (token = null, setShowLoader = null, setValue = null, refetch = false) => {
    const dispatch = useDispatch();
    const commonDataState = useSelector(state => state.commonData);
    
    const getStakeValue = (setValue, data) => {
        if (data && data.stake_values) {
            setValue(data.stake_values);
        }
    };

    const currentToken = getCurrentToken();
    const previousTokenRef = useRef(currentToken);

    useEffect(() => {
        // Check if token changed (new login)
        const tokenChanged = previousTokenRef.current !== currentToken;
        
        // Update previous token reference
        previousTokenRef.current = currentToken;
        
        // If we already have data and not refetching and token hasn't changed, use it
        if (commonDataState.data && !refetch && !tokenChanged) {
            if (setValue && commonDataState.data) {
                getStakeValue(setValue, commonDataState.data);
            }
            return;
        }
     
          // If already fetching or loading, don't make another request
          if (commonDataState.isFetching || commonDataState.loading || isApiCallInProgress) {
            
            return;
        }
        
        // Only fetch if we have a token
        if (!currentToken) {
            return;
        }
        
        // If token changed (new login), clear existing data to force refetch
        if (tokenChanged && commonDataState.data) {
            dispatch(setCommonData(null));
        }

        
        
        // Set global flag and Redux flag immediately to prevent other components from making the same call
        isApiCallInProgress = true;
        dispatch(setFetching(true));
        
        const fetchData = async () => {
            try {
                dispatch(setCommonDataLoading(true));
                dispatch(setCommonDataError(null));
                let bannerResponse = await axiosFetch('banner_data', 'get');
                dispatch(setBannerDetails(bannerResponse.data.banner_data));


                let response = await axiosFetch('common_detail_data', 'get');
                
                // Fetch banner data separately
                
                // Store in Redux
                dispatch(setCommonData(response.data));

                // Call setValue if provided
                if (setValue && response.data) {
                    getStakeValue(setValue, response.data);
                }
                
            } catch (error) {
                throw error;
                console.error('Error fetching common data:', error);
                dispatch(setCommonDataError(error.message));
            } finally {
                // Reset global flag when done
                isApiCallInProgress = false;
            }
        };

        fetchData();

    }, [currentToken, refetch]);

    
    return [commonDataState.data];
};

export default useCommonData;