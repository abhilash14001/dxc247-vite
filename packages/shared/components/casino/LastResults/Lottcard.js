import React from 'react';

export const Lottcard = ({ lastResults, openPopup }) => {
    // Handle the lottery result data structure
    const renderLotteryResults = () => {
        
        
        if(Object.keys(lastResults).length === 0) return null;

        
        return lastResults.map((result, index) => {
            // Parse the win string (e.g., "3  4  9" -> ["3", "4", "9"])
            const numbers = result.win ? result.win.split(/\s+/).filter(num => num.trim()) : ['1', '1', '1'];
            
            return (
                <div 
                    key={result.mid || index} 
                    className="lottery-result-group"
                    onClick={() => openPopup(result.mid)}
                    style={{ cursor: 'pointer' }}
                >
                    {numbers.map((number, numIndex) => (
                        <div key={numIndex} className="lottery-result-icon">
                            {number}
                        </div>
                    ))}
                </div>
            );
        });
    };

    return (
        <div className="casino-last-results">
            {renderLotteryResults()}
        </div>
    );
};
