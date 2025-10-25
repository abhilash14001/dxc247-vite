import {Buffer} from 'buffer';
import { decryptAndVerifyResponse } from './decryptAndVerifyResponse';
/**
 * Common function to process casino socket data for both Desktop and Mobile
 * @param {Object} casino_socket - Socket instance
 * @param {string} socket_game - Socket game event name
 * @param {function} setData - Function to set game data
 * @param {function} setLastResult - Function to set last results
 * @param {function} setRoundId - Function to set round ID
 */
export const createGameConnect = (casino_socket, socket_game, setData, setLastResult, setRoundId, setStatisticsData) => {
    
    // Initialize persistent state outside the socket handler
    let persistentData = {
        data: {},
        lastResults: {},
    };
    
    // Store previous data for comparison
    let previousStatisticsData = null;
    let previousData = null;
    let previousLastResults = null;
    let previousRoundId = null;
    
    const gameConnect = () => {
        casino_socket.on(socket_game, decryptSportData => {
            
            const sportData = decryptAndVerifyResponse(decryptSportData)
            
            if (sportData !== null) {
                
                let fetchedData = sportData
                const parsedData = sportData[0]; // Assuming this is the data you want to work with.
                
                // Use existing data as base instead of resetting
                const processedData = {
                    data: { ...persistentData.data },
                    lastResults: { ...persistentData.lastResults },
                };

                // Process main game data
                if (parsedData && Object.keys(parsedData).length > 0) {
                    
                    if (parsedData.hasOwnProperty('t1')) {
                        processedData.data.t1 = parsedData.t1;
                    }
                    if (parsedData.hasOwnProperty('t2')) {
                        processedData.data.t2 = parsedData.t2;
                    } else if (parsedData && parsedData.hasOwnProperty('sub')) {
                        processedData.data = { ...processedData.data, ...parsedData }; // Merge with existing data if 'sub' exists.
                    }
                }
                
                // Process last results - handle both Desktop and Mobile data structures
                if (fetchedData[1]) {
                                      
                    // Desktop structure: fetchedData[1].last_result.res

                    
                    if (fetchedData[1].last_result && fetchedData[1].last_result.hasOwnProperty('res')) {
                        processedData.lastResults = fetchedData[1].last_result.res.res || fetchedData[1].last_result.res;
                    }
                    // Mobile structure: fetchedData[1].res
                    else if (fetchedData[1].hasOwnProperty('res')) {
                        processedData.lastResults = fetchedData[1].res.res || fetchedData[1].res;
                        
                    }

                    if(fetchedData[1].last_result.hasOwnProperty('g')) {
                        const newStatisticsData = fetchedData[1].last_result.g;
                        
                        // Only update if the data is different from previous
                        if (JSON.stringify(newStatisticsData) !== JSON.stringify(previousStatisticsData)) {
                            
                            setStatisticsData(newStatisticsData);
                            previousStatisticsData = newStatisticsData;
                        }
                    } 
                }
                
                // Update persistent state with the processed data
                persistentData = {
                    data: { ...processedData.data },
                    lastResults: { ...processedData.lastResults },
                };
                
                // Set round ID - only if different from previous
                if (Object.keys(processedData.data).length > 0 && setRoundId !== null) {
                    const newRoundId = processedData.data?.mid || processedData?.data?.t1?.gmid;
                    if (newRoundId !== previousRoundId) {
                        
                        setRoundId(newRoundId);
                        previousRoundId = newRoundId;
                    }
                }
                
                // Set processed data - only if different from previous
                if (setData !== null) {
                    if (JSON.stringify(processedData.data) !== JSON.stringify(previousData)) {
                        
                        setData(processedData.data);
                        previousData = processedData.data;
                    }
                }

                // Set last results - only if different from previous
                if (setLastResult !== null) {
                    
                    if (JSON.stringify(processedData.lastResults) !== JSON.stringify(previousLastResults)) {
                        
                        setLastResult(processedData.lastResults);
                        previousLastResults = processedData.lastResults;
                    }
                }
            }
        })
    }
    
    return gameConnect;
}; 