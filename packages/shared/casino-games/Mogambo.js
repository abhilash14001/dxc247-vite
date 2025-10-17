import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import axiosFetch, {
  getExByColor,
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  cardMapInteger
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Mogambo = () => {
  const [roundId, setRoundId] = useState('');
  const roundIdSaved = useRef(null);
  const ruleDescription = `<div><style type="text/css">
        .rules-section .row.row5 {
            margin-left: -5px;
            margin-right: -5px;
        }
        .rules-section .pl-2 {
            padding-left: .5rem !important;
        }
        .rules-section .pr-2 {
            padding-right: .5rem !important;
        }
        .rules-section .row.row5 > [class*="col-"], .rules-section .row.row5 > [class*="col"] {
            padding-left: 5px;
            padding-right: 5px;
        }
        .rules-section
        {
            text-align: left;
            margin-bottom: 10px;
        }
        .rules-section .table
        {
            color: #fff;
            border:1px solid #444;
            background-color: #222;
            font-size: 12px;
        }
        .rules-section .table td, .rules-section .table th
        {
            border-bottom: 1px solid #444;
        }
        .rules-section ul li, .rules-section p
        {
            margin-bottom: 5px;
        }
        .rules-section::-webkit-scrollbar {
            width: 8px;
        }
        .rules-section::-webkit-scrollbar-track {
            background: #666666;
        }

        .rules-section::-webkit-scrollbar-thumb {
            background-color: #333333;
        }
        .rules-section .rules-highlight
        {
            color: #FDCF13;
            font-size: 16px;
        }
        .rules-section .rules-sub-highlight {
            color: #FDCF13;
            font-size: 14px;
        }
        .rules-section .list-style, .rules-section .list-style li
        {
            list-style: disc;
        }
        .rules-section .rule-card
        {
            height: 20px;
            margin-left: 5px;
        }
        .rules-section .card-character
        {
            font-family: Card Characters;
        }
        .rules-section .red-card
        {
            color: red;
        }
        .rules-section .black-card
        {
            color: black;
        }
        .rules-section .cards-box
        {
            background: #fff;
            padding: 6px;
            display: inline-block;
            color: #000;
            min-width: 150px;
        }
    </style>

<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>1. Mogambo game is played with regular 52 cards deck between Daga/Teja&nbsp;and&nbsp;Mogambo.</li>
                                                <li>2. The objective of the game is to make Highest ranking card to win.</li>
                                                <li>3. Cards are ranked from lowest to highest:
                                                    <p>2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A (Ace is the highest card)</p>
                                                </li>
                                                <li>4. On same card with different suit, Winner will be declare based
                                                    <p>on below winning suit sequence.</p>
                                                    <p>(Spade,Heart,Club,Diamond)</p>
<div>
                                                        <img src="/img/casino-rules/mogambo/img1.jpg" alt="Mogambo Card Suit Sequence">
                                                    </div>
                                              </li>
                                                <li>5.Card Deal:
                                                    <p>Daga/Teja is dealt 2 cards,</p>
                                                    <p>Mogambo is dealt 1 card.</p>
                                                </li>
                                                <li>6. To decide the winner of the round, each cards are compared separately with the higher-value card between          Daga/Teja&nbsp;and&nbsp;Mogambo.</li>
                                                <li>7. Example Round
                                                    <p>Daga/Teja reveals K<span class="card-character  ml-1">}</span> and 10<span class="card-character red-black ml-1">]</span>.</p>
                                                    <p>Mogambo reveals Q<span class="card-character  ml-1">[</span>.</p>
                                                    <p>The highest card for Daga/Teja is K<span class="card-character ml-1">}</span>. Therefore, the winner is Daga/Teja.</p>
                                                </li>
                                               
                                            </ul>
                                            <br>
                                            <p>*****************</p>
                                            <br>
                                            <p>3 Card Total :  Total sum&nbsp;of&nbsp;your&nbsp;3&nbsp;cards</p>
                                            <p>Card Value : A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, </p>
                                            <p>(Ace Value is 1 - K value is 13)</p>
                                            <p>Note : If the game is completed before the 3 cards are revealed, the 3 card Total bets&nbsp;is&nbsp;returned.</p>
                                        </div></div>`;
  const teamname = useRef(null);
  const profit = useRef(0);
  const profitData = useRef(0);
  const loss = useRef(0);
  
  const [betoddskeys, setBetoddskeys] = useState(null);
  const TOTALPLAYERS = {
    "Daga / Teja": '',
    "Mogambo": '',
    "3 Card Total": ''
  };
  
  const [playerAmounts, setPlayerAmounts] = useState(TOTALPLAYERS);
  
  // Exposure states for each betting option
  const [dagaTejaExposure, setDagaTejaExposure] = useState('');
  const [mogamboExposure, setMogamboExposure] = useState('');
  const [threeCardTotalExposure, setThreeCardTotalExposure] = useState('');

  // Player status states for suspend functionality
  const [playerStatuses, setPlayerStatuses] = useState({
    "Daga / Teja": '',
    "Mogambo": '',
    "3 Card Total": ''
  });
  
  const { match_id } = useParams();
  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);
  const [backOrLay, setbackOrLay] = useState('back');
  const [sportList, setSportList] = useState({});
  
  const {
    betType,
    setBetType,
    setPopupDisplayForDesktop,
  } = useContext(SportsContext);
  
  const { getBalance } = useContext(AuthContext);
  const { mybetModel } = useContext(CasinoContext);

  const [hideLoading, setHideLoading] = useState(true);
  const [data, setData] = useState([]);
  const [lastResult, setLastResult] = useState([]);
  const [placingBets, setPlacingBets] = useState({});

  // Game-specific state
  const [gameData, setGameData] = useState({
    total: 0,
    dagaTejaCards: [],
    mogamboCards: [],
    odds: {
      dagaTeja: 0,
      mogambo: 0,
      threeCardTotal: 0
    }
  });

  // Dynamic betting options from API
  const [bettingOptions, setBettingOptions] = useState([]);

  const [flipCards, setFlipCards] = useState(false);

  // Parse dynamic card data from API response
  useEffect(() => {
    if (data && data.card) {
      const cards = data.card.split(',').map(card => card.trim());
      
      // Assuming first 2 cards are Daga/Teja, rest are Mogambo
      const dagaTejaCards = cards.slice(0, 2);
      const mogamboCards = cards.slice(2);
      
      // Calculate total (sum of individual card values using existing cardMapInteger function)
      // If ALL card values are 1, then ignore 1s (treat as 0), otherwise include 1s
      const cardValues = cards.filter(card => card !== '1').map(card => parseInt(cardMapInteger(card)));
      
      
      const total = cardValues.reduce((sum, cardValue) => {
        return parseInt(sum) + (cardValue);
      }, 0);

      setGameData(prev => ({
        ...prev,
        total: total,
        dagaTejaCards: dagaTejaCards,
        mogamboCards: mogamboCards
      }));
    }
  }, [data]);

  // Handle dynamic betting options from API
  useEffect(() => {
    if (data && data.sub) {
      // Update betting options with dynamic data
      const updatedOptions = data.sub.map(item => ({
        sid: item.sid,
        name: item.nat,
        backOdds: item.b || 0,
        layOdds: item.l || 0,
        backSize: item.bbhav || 0,
        laySize: item.lbhav || 0,
        status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
        min: item.min || 100,
        max: item.max || 100000,
        subtype: item.subtype,
        etype: item.etype
      }));

      setBettingOptions(updatedOptions);

      // Update playerStatuses based on betting options
      updatedOptions.forEach(option => {
        setPlayerStatuses(prev => ({
          ...prev,
          [option.name]: option.status || ''
        }));
      });

      // Update gameData odds dynamically
      const mogamboOption = updatedOptions.find(opt => opt.name === 'Mogambo');
      const dagaTejaOption = updatedOptions.find(opt => opt.name === 'Daga / Teja');
      const threeCardTotalOption = updatedOptions.find(opt => opt.name === '3 Card Total');

      setGameData(prev => ({
        ...prev,
        odds: {
          dagaTeja: dagaTejaOption?.backOdds || 0,
          mogambo: mogamboOption?.backOdds || 0,
          threeCardTotal: threeCardTotalOption?.backOdds || 0
        }
      }));
    }
  }, [data]);

  // Single API call for all exposures
  useEffect(() => {
    const updateExposures = async () => {
      if (sportList?.id && roundId && match_id) {
        try {
          // Single API call combining all teams
          const response = await getExByTeamNameForCasino(
            sportList.id, 
            roundId, 
            ["Daga / Teja", "Mogambo"], 
            match_id, 
            "ODDS"
          );
          
          if (response?.data) {
            // Parse the combined response
            const exposures = response.data;
            
            // Update exposure states based on the combined response
            setDagaTejaExposure(exposures["Daga / Teja"] || '');
            setMogamboExposure(exposures["Mogambo"] || '');
            
          }
          
        } catch (error) {
          console.error("Error updating exposures:", error);
        }
      }
    };

    updateExposures();
  }, [sportList?.id, roundId, match_id, mybetModel.length]);

  // Separate API call for 3 Card Total using getExBySingleTeamNameCasino
  useEffect(() => {
    const updateThreeCardTotalExposure = async () => {
      if (sportList?.id && roundId && match_id) {
        try {
          const response = await getExBySingleTeamNameCasino(
            sportList.id,
            roundId,
            "3 Card Total",
            match_id,
            "TOTAL"
          );
          
          
          if (response?.data) {
            const exposureValue = response.data || '';
            // Always set 3 Card Total exposure as negative
            
            setThreeCardTotalExposure(exposureValue < 0 ? exposureValue : -Math.abs(exposureValue));
          }
          else{
            setThreeCardTotalExposure("");
          }
          
        } catch (error) {
          console.error("Error updating 3 Card Total exposure:", error);
        }
      }
    };

    updateThreeCardTotalExposure();
  }, [sportList?.id, roundId,match_id, mybetModel.length]);

  // Open popup function following casino game pattern
  const openPopup = (isBakOrLay, teamnam, oddvalue, size  = null) => {

    setBetType("ODDS");
    if(size !== null) {
      setBetType("TOTAL");
      setBetoddskeys(size);
    }
    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
    } else {
      Notify("Odds Value Change Bet Not Confirm", null, null, 'danger');
    }
  };

  // Helper function to find data in data.sub for Mogambo
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;
    return data.sub.find(item => item.nat === teamName);
  };

  // Function to get current min/max limits for the active bet
  const getMinMaxLimits = () => {
    if (teamname.current && betType) {
      const foundData = findDataInSub(teamname.current, betType);
      if (foundData) {
        return {
          min: foundData.min || 100,
          max: foundData.max || 100000
        };
      }
    }
    return { min: 100, max: 100000 }; // Default fallback
  };

  // Helper function to find betting option by name
  const getBettingOption = (name) => {
    return bettingOptions.find(opt => opt.name === name);
  };

  // Helper function to get betting option data with fallback
  const getBettingData = (name, property, fallback = 0) => {
    const option = getBettingOption(name);
    return option?.[property] || fallback;
  };

  // Helper function to handle betting option click
  const handleBettingClick = (name, type, odds, size = null) => {
    const option = getBettingOption(name);
    if (option && option.status !== 'suspended-box') {
      openPopup(type, name, odds, size);
    }
  };

  
  // Extract commonly used values
  const dagaTejaOdds = getBettingData('Daga / Teja', 'backOdds');
  const dagaTejaStatus = getBettingData('Daga / Teja', 'status', '');

  const mogamboOdds = getBettingData('Mogambo', 'backOdds');
  const mogamboStatus = getBettingData('Mogambo', 'status', '');

  const threeCardLayOdds = getBettingData('3 Card Total', 'layOdds');
  const threeCardBackOdds = getBettingData('3 Card Total', 'backOdds');
  const threeCardLaySize = getBettingData('3 Card Total', 'laySize');
  const threeCardBackSize = getBettingData('3 Card Total', 'backSize');
  const threeCardStatus = getBettingData('3 Card Total', 'status', '');

  // Function to handle bet data
  const casinoBetDataNew = (new_odds) => {
    stakeValue.current.value = new_odds;
    if (backOrLay === "back") {
      loss.current = stakeValue.current.value;
      profit.current = profitData.current = (
        parseFloat(odds - 1) * stakeValue.current.value
      ).toFixed(2);
    } else {
      profit.current = profitData.current = stakeValue.current.value;
      loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
    }
  };

  const placeBet = async () => {
    const betData = {
      sportList,
      roundId,
      backOrLay,
      teamname,
      odds,
      profit,
      loss,
      betType,
      stakeValue,
      match_id,
      roundIdSaved,
      totalPlayers: null,
      playerStatuses, // Add playerStatuses to betData
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable: () => {}, // Add setSubmitButtonDisable
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: () => {}, // Add updateAmounts function
      Notify,
    };

    
    

    const success = await placeCasinoBet(betData, {
      odd_min_limit: () => {
        if (teamname.current && betType) {
          const foundData = findDataInSub(teamname.current, betType);
          if (foundData && foundData.min) {
            return foundData.min;
          }
        }
        return null;
      },
      odd_max_limit: () => {
        if (teamname.current && betType) {
          const foundData = findDataInSub(teamname.current, betType);
          if (foundData && foundData.max) {
            return foundData.max;
          }
        }
        return null;
      },
      onSuccess: () => {},
      oddsk: betoddskeys,
    });

    return success;
  };

  // Render video box for casino layout
  const renderVideoBox = () => {
    return (
      <div className="casino-video-cards">
        <h5 className="mogambo-total">Total: {gameData.total} </h5>
        
        {/* Daga / Teja Cards */}
        {gameData.dagaTejaCards.length > 0 && (
          <div className="mt-1">
            <h5>Daga / Teja</h5>
            <div className="flip-card-container">
              {gameData.dagaTejaCards.map((card, index) => (
                <div key={index} className="flip-card">
                  <div className={`flip-card-inner ${flipCards ? 'flipped' : ''}`}>
                    <div className="flip-card-front">
                      <img src={`/img/casino/cards/${card}.png`} alt={card} />
                    </div>
                    <div className="flip-card-back">
                      <img src={`/img/casino/cards/${card}.png`} alt={card} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mogambo Cards */}
        {gameData.mogamboCards.length > 0 && (
          <div className="">
            <h5>Mogambo</h5>
            <div className="flip-card-container">
              {gameData.mogamboCards.map((card, index) => (
                <div key={index} className="flip-card">
                  <div className={`flip-card-inner ${flipCards ? 'flipped' : ''}`}>
                    <div className="flip-card-front">
                      <img src={`/img/casino/cards/${card}.png`} alt={card} />
                    </div>
                    <div className="flip-card-back">
                      <img src={`/img/casino/cards/${card}.png`} alt={card} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
      </div>
    );
  };


  return (
    <CasinoLayout
      match_id={match_id}
      sportList={sportList}
      setSportList={setSportList}
      roundId={roundId}
      setRoundId={setRoundId}
      lastResult={lastResult}
      setLastResult={setLastResult}
      placingBets={placingBets}
      setPlacingBets={setPlacingBets}
      hideLoading={hideLoading}
      setHideLoading={setHideLoading}
      data={data}
      setData={setData}
      raceClass="teenpatti2cards mogambo"
      
      ruleDescription={ruleDescription}
      virtualVideoCards={renderVideoBox}
      isBack={backOrLay}
      teamname={teamname}
      handleStakeChange={casinoBetDataNew}
      odds={odds}
      stakeValue={stakeValue}
      setOdds={setOdds}
      placeBet={placeBet}
      getMinMaxLimits={getMinMaxLimits}
    >
      

        {/* Betting Table */}
        <div className="casino-detail">
            <div className="casino-table">
              <div className="casino-table-box">
                <div className="casino-table-left-box">
                  <div className="casino-table-body">
                    <div className="casino-table-row mini-baccarat">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Daga / Teja</div>
                        <div className={`casino-nation-book ${dagaTejaExposure > 0 ? 'text-success' : 'text-danger'}`}>{dagaTejaExposure}</div>
                      </div>
                      <div 
                        className={`casino-odds-box back ${dagaTejaStatus}`}
                        onClick={() => handleBettingClick('Daga / Teja', 'back', dagaTejaOdds)}
                      >
                        <span className="casino-odds">{dagaTejaOdds}</span>
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="casino-table-right-box">
                  <div className="casino-table-row mini-baccarat">
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">Mogambo</div>
                      <div className={`casino-nation-book ${mogamboExposure > 0 ? 'text-success' : 'text-danger'}`}>{mogamboExposure}</div>
                    </div>
                    <div 
                      className={`casino-odds-box back ${mogamboStatus}`}
                      onClick={() => handleBettingClick('Mogambo', 'back', mogamboOdds)}
                    >
                      <span className="casino-odds">{mogamboOdds}</span>
                      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 3 Card Total */}
              <div className="casino-table-box three-card-total">
                <div className="casino-table-left-box">
                  <div className="casino-table-body">
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">3 Card Total</div>
                        <div className={`casino-nation-book ${threeCardTotalExposure > 0 ? 'text-success' : 'text-danger'}`}>{threeCardTotalExposure}</div>
                      </div>
                      <div className={`casino-odds-box lay ${threeCardStatus}`}
                         onClick={() => handleBettingClick('3 Card Total', 'lay', threeCardLayOdds, threeCardLaySize)}>
                        <span className="casino-odds">{threeCardLayOdds}</span>
                        <span className="casino-volume">{threeCardLaySize}</span>
                        
                      </div>
                      <div 
                        className={`casino-odds-box back ${threeCardStatus}`}
                        onClick={() => handleBettingClick('3 Card Total', 'back', threeCardBackOdds, threeCardBackSize)}
                      >
                        <span className="casino-odds">{threeCardBackOdds}</span>
                        <span className="casino-volume">{threeCardBackSize}</span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Results */}
            <div className="casino-last-result-title">
              <span>Last Result</span>
              <span><a href="/casino-results/mogambo">View All</a></span>
            </div>
            <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
          </div>

          {/* Matched Bets Table (Hidden by default) */}
          <div className="d-none">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Matched Bet</th>
                    <th className="text-end">Odds</th>
                    <th className="text-end">Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Matched bets will be populated here */}
                </tbody>
              </table>
            </div>
          </div>
        
    </CasinoLayout>
  );
};

export default Mogambo;
