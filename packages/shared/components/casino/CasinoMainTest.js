import React from 'react';
import { useParams } from "react-router-dom";

const CasinoMainTest = () => {
  const { match_id } = useParams();
  
  return (
    <div className="casino-main-test">
      <h2>Casino Main Test</h2>
      <p>Match ID: {match_id}</p>
      <p>This is a test version of CasinoMain</p>
    </div>
  );
};

export default CasinoMainTest;
