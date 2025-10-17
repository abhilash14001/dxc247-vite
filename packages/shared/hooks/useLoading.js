import { useState } from 'react';

export const useLoading = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);
    const setLoading = (loading) => setIsLoading(loading);
    
    return {
        isLoading,
        showLoading,
        hideLoading,
        setLoading
    };
};