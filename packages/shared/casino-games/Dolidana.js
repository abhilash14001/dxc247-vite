import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import {
  resetBetFields,
  placeCasinoBet,
  getExByTeamNameForCasino
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Dolidana = () => {
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

<div><style type="text/css">
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
                                            <h6 class="rules-highlight">Winning Dice</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>3:3</li>
                                                <li>5:5</li>
                                                <li>6:6</li>
                                                <li>5:6 or 6:5</li>
                                            </ul>
                                            <h6 class="rules-highlight">Losing Dice</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>1:1</li>
                                                <li>2:2</li>
                                                <li>4:4</li>
                                                <li>1:2 or 2:1</li>
                                            </ul>
                                            <p>Any other combo (like 2:5, 3:4, etc.):</p>
                                            <p>* No win / no loss Dice passes to the next player</p>
                                            <p><b>•Any Pair</b> : |1:1||2:2||3:3||4:4||5:5||6:6|</p>
                                            <p><b>•ODD:</b> 3,5,7,9,11 | <b>EVEN:</b> 2,4,6,8,10,12</p>
                                            <p>•If the Dice total = 7 (e.g., 1:6, 2:5, 3:4, etc.) Bets on Greater than 7 and Less than 7 both lose 50% of the bet Amount.</p>
                                            <p>Examples: 2:5 = 7 -&gt; 50% loss on both
                                                &lt;7 and&gt;7
                                                    </p><p>1:6 = 7 -&gt; 50% loss on both
                                                        &lt;7 and&gt;7</p>
                                            <p></p>
                                            <p><b>Note</b>: All other bets settle immediately, but the main bet waits until Player A or&nbsp;Player&nbsp;B&nbsp;win/Loss(player&nbsp;Back/Lay).</p>
											<h6 class="rules-highlight">Result Integrity &amp; Error-Correction Policy</h6>
											<ul class="pl-4 pr-4 list-style">
                                                <li>1) Authoritative Result<br>
												The Original Dice Number Result generated and recorded by our server is the sole, final, and binding outcome for every round.
												</li>
                                                <li>2) Display Errors &amp; Corrections<br>
												If any technical issue causes an incorrect, missing, duplicated, delayed, or otherwise erroneous display of the result, Dolidana Casino may update the displayed result to match the Original Dice Number Result. All settlements (wins/losses/payouts) are made only against the Original Dice Number Result.
												</li>
												<li>3) Player Acceptance<br>
												By participating, you agree that if a display error occurs, you must accept the corrected/updated result reflecting the Original Dice Number Result, and any settlement made on that basis.
												</li>
                                            </ul>
                                        </div></div></div>`;
  const teamname = useRef(null);
  const profit = useRef(0);
  const profitData = useRef(0);
  const loss = useRef(0);
  
  const [betoddskeys, setBetoddskeys] = useState(null);
  const TOTALPLAYERS = {
    "Player A": '',
    "Player B": ''
  };
  
  const [playerAmounts, setPlayerAmounts] = useState(TOTALPLAYERS);
  
  // Exposure states for each betting option
  const [playerAExposure, setPlayerAExposure] = useState('');
  const [playerBExposure, setPlayerBExposure] = useState('');

  // Player status states for suspend functionality
  const [playerStatuses, setPlayerStatuses] = useState({
    "Player A": '',
    "Player B": ''
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
  const [diceCards, setDiceCards] = useState([]);

  // Handle dynamic betting options from API
  useEffect(() => {
    if (data?.sub) {
      // Update playerStatuses dynamically for each betting option
      const newPlayerStatuses = {};
      
      // Update status for each betting option based on their individual status from data.sub
      data.sub.forEach((item) => {
        const playerStatus = item.gstatus === "OPEN" ? "" : "suspended-box";
        newPlayerStatuses[item.nat] = playerStatus;
      });

      setPlayerStatuses(newPlayerStatuses);
    }
  }, [data]);

  // Parse card data for dice display
  useEffect(() => {
    if (data?.card && data.card.trim() !== "") {
      const cardArray = data.card.split(",").map((item) => item.trim()).filter((item) => item !== "");
      setDiceCards(cardArray);
    } else {
      setDiceCards([]);
    }
  }, [data?.card]);

  // Single API call for all exposures
  useEffect(() => {
    const updateExposures = async () => {
      if (sportList?.id && roundId && match_id) {
        try {
          // Single API call combining all teams
          const response = await getExByTeamNameForCasino(
            sportList.id, 
            roundId, 
            ["Player A", "Player B"], 
            match_id, 
            "ODDS"
          );
          
          if (response?.data) {
            // Parse the combined response
            const exposures = response.data;
            
            // Update exposure states based on the combined response
            setPlayerAExposure(exposures["Player A"] || '');
            setPlayerBExposure(exposures["Player B"] || '');
          }
          
        } catch (error) {
          console.error("Error updating exposures:", error);
        }
      }
    };

    updateExposures();
  }, [sportList?.id, roundId, match_id, mybetModel.length]);

  // Open popup function following casino game pattern
  const openPopup = (isBakOrLay, teamnam, oddvalue, size = null) => {
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

  // Helper function to find data in data.sub for Dolidana
  const findDataInSub = (teamName) => {
    if (!data || !data.sub) return null;
    return data.sub.find((item) => item.nat === teamName);
  };

  // Function to get current min/max limits for the active bet
  const getMinMaxLimits = () => {
    if (teamname.current) {
      const foundData = findDataInSub(teamname.current);
      if (foundData) {
        return {
          min: foundData.min || 100,
          max: foundData.max || 100000
        };
      }
    }
    return { min: 100, max: 100000 }; // Default fallback
  };

  // Helper function to get betting data
  const getBettingData = (name, property, fallback = 0) => {
    const found = findDataInSub(name);
    if (!found) return fallback;
    
    switch(property) {
      case 'backOdds':
        return found.b || fallback;
      case 'backSize':
        return found.bs || fallback;
      case 'layOdds':
        return found.l || fallback;
      case 'laySize':
        return found.ls || fallback;
      case 'status':
        return found.gstatus === 'OPEN' ? '' : 'suspended-box';
      case 'min':
        return found.min || fallback;
      case 'max':
        return found.max || fallback;
      default:
        return fallback;
    }
  };

  // Helper function to handle betting option click
  const handleBettingClick = (name, type, odds, size = null) => {
    const found = findDataInSub(name);
    if (found && found.gstatus === 'OPEN') {
      openPopup(type, name, odds, size);
    }
  };

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
      playerStatuses,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable: () => {},
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: () => {},
      Notify,
    };

    const success = await placeCasinoBet(betData, {
      odd_min_limit: () => {
        if (teamname.current) {
          const foundData = findDataInSub(teamname.current);
          if (foundData && foundData.min) {
            return foundData.min;
          }
        }
        return null;
      },
      odd_max_limit: () => {
        if (teamname.current) {
          const foundData = findDataInSub(teamname.current);
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

  // Extract commonly used values
  const playerAOdds = getBettingData('Player A', 'backOdds');
  const playerAVolume = getBettingData('Player A', 'backSize');
  const playerAStatus = getBettingData('Player A', 'status', '');

  const playerBOdds = getBettingData('Player B', 'backOdds');
  const playerBVolume = getBettingData('Player B', 'backSize');
  const playerBStatus = getBettingData('Player B', 'status', '');

  const anyPairOdds = getBettingData('Any Pair', 'backOdds');
  const anyPairStatus = getBettingData('Any Pair', 'status', '');

  const oddPairOdds = getBettingData('Odd', 'backOdds');
  const oddPairStatus = getBettingData('Odd', 'status', '');

  const evenPairOdds = getBettingData('Even', 'backOdds');
  const evenPairStatus = getBettingData('Even', 'status', '');

  const lessThan7Odds = getBettingData('Less than 7', 'backOdds');
  const lessThan7Status = getBettingData('Less than 7', 'status', '');

  const greaterThan7Odds = getBettingData('Greater than 7', 'backOdds');
  const greaterThan7Status = getBettingData('Greater than 7', 'status', '');

  const lucky7Odds = getBettingData('Lucky 7', 'backOdds');
  const lucky7Status = getBettingData('Lucky 7', 'status', '');

  // Get particular pairs
  const getParticularPairData = (pairName) => {
    const name = `${pairName} Pair`;
    return {
      odds: getBettingData(name, 'backOdds'),
      status: getBettingData(name, 'status', '')
    };
  };

  // Get sum total data
  const getSumTotalData = (sum) => {
    const name = `Sum Total ${sum}`;
    return {
      odds: getBettingData(name, 'backOdds'),
      status: getBettingData(name, 'status', '')
    };
  };

  // Render video box for dice cards in iframe
  const renderVideoBox = () => {
    if (!diceCards || diceCards.length === 0) {
      return null;
    }

    return (
      <div className="video-overlay">
        <div className="casino-video-cards">
          <div className="flip-card-container">
            {diceCards.map((diceValue, index) => {
              // Use local path for dice images
              const imgSrc = `/img/dice/dice${diceValue}.png`;
              
              return (
                <div key={index} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img 
                        src={imgSrc} 
                        alt={`Dice ${diceValue}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
      raceClass="doli-dana"
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
      <div className="casino-detail">
        <div className="casino-table">
          <div className="casino-table-box">
            <div className="doli-main">
              <div className="players-bet">
                <div className="casino-table-row">
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Player A</div>
                    <div className={`casino-nation-book ${playerAExposure > 0 ? 'text-success' : 'text-danger'}`}>{playerAExposure}</div>
                  </div>
                  <div className="doli-odds-box">
                    <div 
                      className={`casino-odds-box back ${playerAStatus}`}
                      onClick={() => handleBettingClick('Player A', 'back', playerAOdds, playerAVolume)}
                    >
                      <span className="casino-odds">{playerAOdds}</span>
                      <span className="casino-volume">{playerAVolume}</span>
                    </div>
                  </div>
                </div>
                <div className="casino-table-row">
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Player B</div>
                    <div className={`casino-nation-book ${playerBExposure > 0 ? 'text-success' : 'text-danger'}`}>{playerBExposure}</div>
                  </div>
                  <div className="doli-odds-box">
                    <div 
                      className={`casino-odds-box back ${playerBStatus}`}
                      onClick={() => handleBettingClick('Player B', 'back', playerBOdds, playerBVolume)}
                    >
                      <span className="casino-odds">{playerBOdds}</span>
                      <span className="casino-volume">{playerBVolume}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="side-bets">
                <div className="any-pair">
                  <div className="doli-odds-box">
                    <div className="odd-name">Any Pair</div>
                    <div 
                      className={`casino-odds-box back ${anyPairStatus}`}
                      onClick={() => handleBettingClick('Any Pair', 'back', anyPairOdds)}
                    >
                      <span className="casino-odds">{anyPairOdds}</span>
                      <span className="casino-volume"></span>
                    </div>
                  </div>
                </div>
                
                <div className="odd-even-pair">
                  <div className="bets-box">
                    <div className="doli-odds-box">
                      <div className="odd-name">Odd</div>
                      <div 
                        className={`casino-odds-box back ${oddPairStatus}`}
                        onClick={() => handleBettingClick('Odd', 'back', oddPairOdds)}
                      >
                        <span className="casino-odds">{oddPairOdds}</span>
                        <span className="casino-volume"></span>
                      </div>
                    </div>
                    <div className="doli-odds-box">
                      <div className="odd-name">Even</div>
                      <div 
                        className={`casino-odds-box back ${evenPairStatus}`}
                        onClick={() => handleBettingClick('Even', 'back', evenPairOdds)}
                      >
                        <span className="casino-odds">{evenPairOdds}</span>
                        <span className="casino-volume"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lucky7-pair">
                  <div className="bets-box">
                    <div className="doli-odds-box">
                      <div className="odd-name">&lt; 7</div>
                      <div 
                        className={`casino-odds-box back ${lessThan7Status}`}
                        onClick={() => handleBettingClick('Less than 7', 'back', lessThan7Odds)}
                      >
                        <span className="casino-odds">{lessThan7Odds}</span>
                        <span className="casino-volume"></span>
                      </div>
                    </div>
                    <div className="doli-odds-box">
                      <div className="seven-box">
                        <img src="/img/trape-seven.png" alt="7" />
                      </div>
                    </div>
                    <div className="doli-odds-box">
                      <div className="odd-name">&gt; 7</div>
                      <div 
                        className={`casino-odds-box back ${greaterThan7Status}`}
                        onClick={() => handleBettingClick('Greater than 7', 'back', greaterThan7Odds)}
                      >
                        <span className="casino-odds">{greaterThan7Odds}</span>
                        <span className="casino-volume"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="doli-other-bets">
                <div className="particular-pair">
                  <h4>Particular Pair</h4>
                  <div className="bets-box">
                    {["1-1", "2-2", "3-3", "4-4", "5-5", "6-6"].map((pair) => {
                      const pairData = getParticularPairData(pair);
                      return (
                        <div key={pair} className="doli-odds-box">
                          <div className="odd-name">{pair} Pair</div>
                          <div 
                            className={`casino-odds-box back ${pairData.status}`}
                            onClick={() => handleBettingClick(`${pair} Pair`, 'back', pairData.odds)}
                          >
                            <span className="casino-odds">{pairData.odds}</span>
                            <span className="casino-volume"></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="sum-odds">
                  <h4>Odds of Sum Total</h4>
                  <div className="bets-box">
                    {["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((sum) => {
                      const sumData = getSumTotalData(sum);
                      return (
                        <div key={sum} className="doli-odds-box">
                          <div className="odd-name">Sum Total {sum}</div>
                          <div 
                            className={`casino-odds-box back ${sumData.status}`}
                            onClick={() => handleBettingClick(`Sum Total ${sum}`, 'back', sumData.odds)}
                          >
                            <span className="casino-odds">{sumData.odds}</span>
                            <span className="casino-volume"></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="sidebar-box my-bet-container doli-dana-rules d-xl-none w-100">
                <div className="sidebar-title">
                  <h4>Rules</h4>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Win</th>
                        <th>Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <img src="/img/dice/dice3.png" alt="" />
                          <img src="/img/dice/dice3.png" alt="" />
                        </td>
                        <td>
                          <img src="/img/dice/dice1.png" alt="" />
                          <img src="/img/dice/dice1.png" alt="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img src="/img/dice/dice5.png" alt="" />
                          <img src="/img/dice/dice5.png" alt="" />
                        </td>
                        <td>
                          <img src="/img/dice/dice2.png" alt="" />
                          <img src="/img/dice/dice2.png" alt="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img src="/img/dice/dice6.png" alt="" />
                          <img src="/img/dice/dice6.png" alt="" />
                        </td>
                        <td>
                          <img src="/img/dice/dice4.png" alt="" />
                          <img src="/img/dice/dice4.png" alt="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img src="/img/dice/dice5.png" alt="" />
                          <img src="/img/dice/dice6.png" alt="" />
                        </td>
                        <td>
                          <img src="/img/dice/dice1.png" alt="" />
                          <img src="/img/dice/dice2.png" alt="" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Results */}
        <div className="casino-last-result-title">
          <span>Last Result</span>
          <span><a href="/casino-results/dolidana">View All</a></span>
        </div>
        <div className="casino-last-results">
        <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
        </div>
      </div>
    </CasinoLayout>
  );
};

export default Dolidana;

