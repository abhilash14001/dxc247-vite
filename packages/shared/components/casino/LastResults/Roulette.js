import React from 'react';

export const Roulette = ({ lastResults, openPopup }) => {
    // Function to determine if a number is red or black
    const getNumberColor = (num) => {
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

        if(num === 0){
            return 'green';
        }
        return redNumbers.includes(num) ? 'red' : 'black';
    };

    // Function to extract winning number from result
    const getWinningNumber = (result) => {
        if (!result) return null;
        
        // Try different possible fields for the winning number
        const winNumber = result.win || result.winnat || result.winner || result.card;
        
        // If it's a string, try to extract the number
        if (typeof winNumber === 'string') {
            const match = winNumber.match(/\d+/);
            return match ? parseInt(match[0]) : null;
        }
        
        return typeof winNumber === 'number' ? winNumber : null;
    };

    // Convert lastResults object to array and get the last 10 results
    const getRecentResults = () => {
        if (!lastResults || Object.keys(lastResults).length === 0) return [];
        
        const resultKeys = Object.keys(lastResults);
        const recentResults = resultKeys
            
            .map(key => {
                const result = lastResults[key];
                
                
                const winningNumber = getWinningNumber(result);
                return {
                    key : result.mid,
                    number: winningNumber,
                    color: winningNumber ? getNumberColor(winningNumber) : null
                };
            })
            .filter(result => result.number !== null);
        
        return recentResults;
    };

    const recentResults = getRecentResults();

    return (
        <div className="casino-last-results">
            {recentResults.map((result, index) => (
                <span 
                    key={result.key}
                    className={`result ${result.color}`}
                    onClick={() => openPopup(result.key)}
                    style={{ cursor: 'pointer' }}
                    title={`Round ID: ${result.key}`}
                >
                    {result.number.toString().padStart(2, '0')}
                </span>
            ))}
        </div>
    );
};
