import React from "react";

export const Sicbo = ({ lastResults, openPopup }) => {
  // Debug logging
  
  
  // Handle both array and object formats
  const resultsArray = Array.isArray(lastResults) 
    ? lastResults 
    : Object.entries(lastResults || {}).map(([key, result]) => ({ ...result, key }));

  

  if (!resultsArray || resultsArray.length === 0) {
    return (
      <div className="casino-last-results">
        <span className="result">No results available</span>
      </div>
    );
  }

  // Function to get display value based on result data
  const getDisplayValue = (result) => {
    
    
    // Ensure we have a valid result object
    if (!result || typeof result !== 'object') {
      return '?';
    }
    
    // If result has win property (from lastResults object format)
    if (result.win !== undefined && result.win !== null) {
      return String(result.win);
    }
    
    // If result has dice values (for sicbo)
    if (result.dice1 && result.dice2 && result.dice3) {
      return `${result.dice1}-${result.dice2}-${result.dice3}`;
    }
    
    // If result has total
    if (result.total !== undefined && result.total !== null) {
      return String(result.total);
    }
    
    // If result has rdesc
    if (result.rdesc && typeof result.rdesc === 'string') {
      return result.rdesc;
    }
    
    // If result has result property
    if (result.result && typeof result.result === 'string') {
      return result.result;
    }
    
    // If result has winner
    if (result.winner && typeof result.winner === 'string') {
      return result.winner;
    }
    
    // Fallback to index
    return '?';
  };

  return (
    <div className="casino-last-results">
      {resultsArray.map((result, index) => {
        try {
          const displayValue = getDisplayValue(result);
          return (
            <span 
              key={result.mid || result.key || index} 
              className="result" 
              onClick={() => openPopup(result.mid || result.roundId || result.rid || index)}
              style={{ cursor: 'pointer' }}
              title={`Round ID: ${result.mid || result.roundId || result.rid || index}`}
            >
              {displayValue}
            </span>
          );
        } catch (error) {
          console.error('Error rendering result:', error, result);
          return (
            <span 
              key={index} 
              className="result" 
              style={{ cursor: 'pointer' }}
            >
              ?
            </span>
          );
        }
      })}
    </div>
  );
};
