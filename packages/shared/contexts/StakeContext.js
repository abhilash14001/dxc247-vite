import React, { createContext, useContext, useState, useEffect } from 'react';
import useCommonData from '../hooks/useCommonData';
import { getCurrentToken } from '../utils/Constants';
const StakeContext = createContext();

// Custom hook to use the stake context
export const useStake = () => {
    const context = useContext(StakeContext);
    if (!context) {
        throw new Error('useStake must be used within a StakeProvider');
    }
    return context;
};

// Provider component
export const StakeProvider = ({ children }) => {
    const [stakeValues, setStakeValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetch, setRefetch] = useState(false);
    const token = getCurrentToken() ;
    
    // Call useCommonData at the top level
    const [commonData] = useCommonData(token, setLoading, setStakeValues, refetch);
    
    // Initialize stake values
    useEffect(() => {
        if (commonData && commonData.stake_values) {
            setStakeValues(commonData.stake_values);
            setLoading(false);
        } else if (commonData && !commonData.stake_values && token) {
            // If we have commonData but no stake_values, try to refetch
            
            setRefetch(true);
        }
    }, [commonData, token]);

    // Reset refetch flag after data is fetched
    useEffect(() => {
        if (refetch && commonData) {
            setRefetch(false);
        }
    }, [refetch, commonData]);

    // Function to refresh stake values
    const refreshStakeValues = async () => {
        try {
            setLoading(true);
            setError(null);
            // Trigger refetch by setting refetch to true
            setRefetch(true);
        } catch (err) {
            setError(err.message || 'Failed to refresh stake values');
            console.error('Error refreshing stake values:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to update a specific stake value
    const updateStakeValue = (index, label, value) => {
       
        setStakeValues(prev => ({
            ...prev,
            [index]: { label, val: value }
        }));
    };

    // Function to update all stake values
    const updateAllStakeValues = (newStakeValues) => {
        setStakeValues(newStakeValues);
    };

    const value = {
        stakeValues,
        setStakeValues: updateAllStakeValues,
        updateStakeValue,
        refreshStakeValues,
        loading,
        error
    };

    return (
        <StakeContext.Provider value={value}>
            {children}
        </StakeContext.Provider>
    );
};

export default StakeContext; 