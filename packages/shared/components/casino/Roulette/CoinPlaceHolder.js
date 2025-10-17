import React from 'react';

const CoinPlaceHolder = ({ amount = 25 }) => {

    const casinoCoinCss = {25 : "#138cf5", 50 : "#138cf5", 100 : "#138cf5", 200 : "#00d700", 500 : "#00d700", 1000 : "#9541f9"}
    
    // Color logic based on amount ranges
    let chipColor = "#138cf5"; // Default blue
    
    if (amount >= 1000) {
        chipColor = "#9541f9"; // Purple for 1000+
    } else if (amount >= 500) {
        chipColor = "#00d700"; // Green for 500-999
    } else if (amount >= 200) {
        chipColor = "#00d700"; // Green for 200-499
    } else {
        chipColor = casinoCoinCss[amount] || "#138cf5"; // Use predefined or default blue
    }
  return (
    <div className="casino-coin">
      <div 
        className="bet-chip-holder" 
        style={{ "--g-chip-outer-color": chipColor }}
      >
        <div className="bet-chip">
          <div className="bet-chip-front"></div>
          <div className="bet-chip-top"></div>
          <div className="bet-chip-amount">
            <svg 
              className="bet-chip-amount-in" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 108 108"
            >
              <text 
                className="bet-chip-amount-label" 
                x="50%" 
                y="53.5%" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fill="#fff" 
                fontSize="32" 
                fontWeight="700"
              >
                {amount}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPlaceHolder;
