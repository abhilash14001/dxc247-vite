import React from "react";

export const Mogambo = ({ lastResults, openPopup }) => {
  if (!lastResults || lastResults.length === 0) {
    return (
      <div className="casino-last-results">
        <span className="text-muted">No results available</span>
      </div>
    );
  }

  return (
    <div className="casino-last-results">
      {lastResults.map((result, index) => {
        // Determine if it's a win or loss based on the result
        // Assuming result format: { win: "1" or "2", ... }
        const isWin = result.win === "1"; // Mogambo wins when win === "2"
        const resultClass = isWin ? "result result-b" : "result result-a";
        const resultText = isWin ? "W" : "L";
        console.log('result is ', result)
        return (
          <span
            key={index}
            className={resultClass}
            onClick={() => openPopup(result.mid)}
            style={{ cursor: "pointer" }}
            title={`Round: ${result.round_id || result.rid} - ${isWin ? "Mogambo Won" : "Daga/Teja Won"}`}
          >
            {resultText}
          </span>
        );
      })}
    </div>
  );
};
