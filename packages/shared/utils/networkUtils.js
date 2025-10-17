// Network utility functions for handling API requests and errors
import { useState, useEffect } from 'react';

/**
 * Enhanced fetch with timeout, retry logic, and better error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Request timeout in milliseconds (default: 10000)
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise} - Enhanced fetch promise
 */
export const enhancedFetch = async (url, options = {}, timeout = 10000, retries = 3) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
        ...options,
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        }
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (attempt === retries) {
                // Last attempt failed, throw the error
                if (error.name === 'AbortError') {
                    throw new Error(`Request timed out after ${timeout}ms`);
                } else if (error.message.includes('Failed to fetch')) {
                    throw new Error('Network error - please check your internet connection');
                } else {
                    throw error;
                }
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            console.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value if env var is not defined
 * @returns {string} - Environment variable value or fallback
 */
export const getEnvVar = (key, fallback = null) => {
    const value = process.env[key];
    if (!value) {
        console.warn(`Environment variable ${key} is not defined${fallback ? `, using fallback: ${fallback}` : ''}`);
        return fallback;
    }
    return value;
};

/**
 * Check if the application is online
 * @returns {boolean} - Network status
 */
export const isOnline = () => {
    return navigator.onLine;
};

/**
 * Wait for network to come back online
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} - Resolves when online or timeout
 */
export const waitForOnline = (timeout = 30000) => {
    return new Promise((resolve) => {
        if (isOnline()) {
            resolve(true);
            return;
        }

        const timeoutId = setTimeout(() => {
            window.removeEventListener('online', onlineHandler);
            resolve(false);
        }, timeout);

        const onlineHandler = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('online', onlineHandler);
            resolve(true);
        };

        window.addEventListener('online', onlineHandler);
    });
};

/**
 * Network status hook for React components
 */
export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

// Default API endpoints with fallbacks
export const API_ENDPOINTS = {
    EXPRESS_URL: getEnvVar('REACT_APP_EXPRESS_URL', 'https://api.dxc247.com'),
    SOCKET_URL: getEnvVar('REACT_APP_SOCKET_URL', 'wss://dxc247.com:4005'),
    CARD_PATH: getEnvVar('REACT_APP_CARD_PATH', 'https://g1ver.sprintstaticdata.com/v69/static/front/img/cards/')
};
