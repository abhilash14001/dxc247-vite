import axiosFetch from "./Constants";

// Simple cache to prevent duplicate API calls
const betDataCache = new Map();
const activeRequests = new Map();

/**
 * Internal function to fetch bet data with caching - gets ALL types in one call
 * @param {string} match_id - The match ID
 * @returns {Promise} - API response with all bet types
 */
const fetchBetDataWithCache = async (match_id) => {
    const cacheKey = `bet_data_${match_id}_all`;
    
    // Check if we already have cached data (less than 5 seconds old)
    const cached = betDataCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < 5000) {
        
        return cached.response;
    }
    
    // Check if there's already an active request for this match_id
    if (activeRequests.has(cacheKey)) {
        
        return activeRequests.get(cacheKey);
    }
    
    // Create new request
    const request = (async () => {
        try {
            
            
            // Single API call to get all bet types
            const response = await axiosFetch(`bet_data/${match_id}`, 'get');
            
            // Cache the response
            betDataCache.set(cacheKey, {
                data: response?.data,
                response: response,
                timestamp: Date.now()
            });
            
            
            return response;
        } catch (error) {
            console.error('Error fetching bet data:', error);
            throw error;
        } finally {
            // Remove from active requests
            activeRequests.delete(cacheKey);
        }
    })();
    
    // Store the active request
    activeRequests.set(cacheKey, request);
    
    return request;
};

/**
 * Common function to get bet list data for a specific match
 * @param {string} match_id - The match ID
 * @param {function} setMyBetModel - State setter function for bet model
 * @returns {Promise} - API response
 */
export const getBetListData = async (match_id, setMyBetModel) => {
    try {
        const response = await fetchBetDataWithCache(match_id);
        if (setMyBetModel) setMyBetModel(response?.data);
        return response;
    } catch (error) {
        console.error('Error fetching bet list data:', error);
        throw error;
    }
};

/**
 * Common function to get active bets for cashout functionality
 * @param {string} match_id - The match ID
 * @param {string} type - The bet type to filter by (optional)
 * @returns {Promise<Array>} - Array of active bets
 */
export const getActiveBets = async (match_id, type=null) => {
    try {
        // Get all bet data in one call
        const response = await fetchBetDataWithCache(match_id);
        
        if (!response || !response.data) {
            console.error('Invalid API response:', response);
            return [];
        }

        const data = response.data;
        
        // Validate the response data structure
        if (!Array.isArray(data)) {
            console.error('API response is not an array:', data);
            return [];
        }

        // Filter by type if specified, otherwise return all
        let filteredData = data;
        if (type) {
            filteredData = data.filter(bet => bet.type === type);
        }

        // Map API response to expected format
        const processedData = filteredData.map(bet => ({
            team_name: bet.team_name ,
            bet_amount: parseFloat(bet.bet_amount),
            bet_odds: parseFloat(bet.bet_odds || 0 ),
            type: bet.type ,
            bet_side: bet.bet_side
        })).filter(bet => 
            // Filter out invalid bets
            bet.team_name && 
            bet.bet_amount > 0 && 
            bet.bet_odds > 0 && 
            ['BACK', 'LAY'].includes(bet.bet_side)
        );
        
        return processedData;

    } catch (error) {
        console.error('Error fetching active bets:', error);
        return [];
    }
};
