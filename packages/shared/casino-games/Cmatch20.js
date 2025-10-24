import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
  calculateRuns,
  resetBetFields,
  getGlobalTimer,
  placeCasinoBet,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { AuthContext } from "../contexts/AuthContext";
import { CasinoContext } from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Cmatch20 = () => {
  const [roundId, setRoundId] = useState("");

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
            border-right: 1px solid #444;
            vertical-align: middle;
            text-align: center;
        }
        .rules-section ul li, .rules-section p
        {
            margin-bottom: 5px;
        }
        .rules-section::-webkit-scrollp {
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
        .rules-section .casino-tabs {
            background-color: #222 !important;
            border-radius: 0;
        }
        .rules-section .casino-tabs .nav-tabs .nav-link
        {
            color: #fff !important;
        }
        .rules-section .casino-tabs .nav-tabs .nav-link.active
        {
            color: #FDCF13 !important;
            border-bottom: 3px solid #FDCF13 !important;
        }
    </style>

<div class="rules-section">
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>This is a game of twenty-20 cricket. We will alreadty have score of first batting team, &amp; score of second batting team up to 19.4 overs. At this stage second batting team will be always 12 run short of first batting team(IF THE SCORE IS TIED, SECOND BAT WILL WIN). This 12 run has to be scored by 2 scoring shots or (two steps).</li>
                                                <li>1st step is to be select a scoring shot from 2 , 3 , 4 , 5 , 6 ,7 , 8 , 9 , 10. The one who bet will get rate according to the scoring shot he select from 2 to 10, &amp; that will be considered as ball number 19.5.</li>
                                                <li>2nd step is to open a card from 40 card deck of 1 to 10 of all suites. This will be considered last ball of the match. This twenty-20 game consist of scoring shots of 1 run to 10 runs.</li>
                                                <li class="text-danger"><b>IF THE SCORE IS TIED SECOND BAT WILL WIN</b></li>
                                            </ul>
                                        </div></div>`;
  
  const defaultValues = { odds: { back: 0, lay: 0 }, status: "suspended-box", amounts: "" };

  const [totalBalls, setTotalBalls] = useState(
    Object.fromEntries(
      Array.from({ length: 9 }, (_, index) => {
        const runis = "Run " + (index + 2);
        return [runis, defaultValues];
      })
    )
  );

  const [scores, setScores] = useState([]);

  const [playerStatuses, setPlayerStatuses] = useState({});

  const roundIdSaved = useRef(null);

  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [cards, setCards] = useState({});

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);

  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const { mybetModel } = useContext(CasinoContext);
  
  // Get user data from Redux instead of AuthContext
  const userBalance = useSelector(state => state.user.balance);

  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["Player A", "Player B"]);

  const [data, setData] = useState([]);

  const remark = useRef(null);
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  const updateScoreAndBalls = () => {
    setScores((prevState) => {
      // Assuming d_data['score'] equivalent is passed as `scoreString` in JavaScript
      const scores = data.score.split(",");
      const [C2, C3, C4, C5, C6, C7] = scores.slice(1, 7);

      // Assuming you want to update these values in your previous state
      const updateScores = { ...prevState, C2, C3, C4, C5, C6, C7 };

      return updateScores;
    });

    setTotalBalls((prevState) => {
      const updatedBalls = JSON.parse(JSON.stringify(prevState));

      Object.entries(updatedBalls).forEach(([key, value]) => {
        const datafound = data.sub.find((item) => item.nat === key);

        if (datafound) {
          updatedBalls[key].odds.back = datafound.b;
          updatedBalls[key].odds.lay = datafound.l;
          updatedBalls[key].status =
            datafound.gstatus === "OPEN" ? "" : "suspended-box";
        }
      });

      return updatedBalls;
    });
  };

  useEffect(() => {
    if (data?.sub) {
      updateScoreAndBalls();

      // Update playerStatuses dynamically for each player individually
      const newPlayerStatuses = {};

      // Update status for each player based on their individual status from data.sub
      data.sub.forEach((item) => {
        const playerStatus = item.gstatus === "OPEN" ? "" : "suspended-box";
        newPlayerStatuses[item.nat] = playerStatus;
      });

      setPlayerStatuses(newPlayerStatuses);
    }

   
  }, [data?.sub]);

  useEffect(() => {
    if (data.card) {
        const cardArray = data.card.split(",").map((item) => item.trim());
        setCards({
          playerA: cardArray.slice(0, 3),
        });
        
      }
  }, [data?.card]);


  useEffect(() => {
    
      remark.current = data?.remark || "Welcome";
    
  }, [data?.remark]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  useEffect(() => {
    if (data?.sub && sportList?.id) {
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const openPopup = (isBakOrLay, teamnam, oddvalue) => {
    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
    } 
  };

  // Helper function to find data in data.sub for Cmatch20
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Cmatch20, find the item by nat field
    return data.sub.find((item) => item.nat === teamName);
  };
  const casinoBetDataNew = (new_odds) => {
    stakeValue.current.value = new_odds;
    if (backOrLay === "back") {
      loss.current = stakeValue.current.value;

      profit.current = profitData.current = (
        parseFloat(odds - 1) * stakeValue.current.value
      ).toFixed(2);
    } else {
      profit.current = profitData.current = stakeValue.current.value;

      loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(
        2
      );
    }
  };

  const renderCards = (cards, player) => (
    <div className="flip-card-container">
      {cards?.map((card, index) => {
        const imgSrc = card
          ? `/img/casino/cards/${card}.png`
          : "/img/casino/cards/1.png";
        return (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const placeBet = async () => {
    const betData = {
      sportList,
      roundId,
      backOrLay,
      teamname,
      odds,
      profit,
      loss,
      betType: "ODDS",
      stakeValue,
      match_id,
      roundIdSaved,
      totalPlayers: null,
      playerStatuses : playerStatuses[teamname.current], // Add playerStatuses to betData
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: null,
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
      onSuccess: () => {
        //  is already handled by placeCasinoBet
      },
    });

    return success;
  };

  const renderVideoBox = () => {
    return (
      
        <>
       
       {getGlobalTimer() > 18 && (
        <div className="cricket20videobannerbox">
          <img src="/img/cricket20bg.jpg" className="img-fluid" alt="cricket20 background" />
          <div className="cricket20videobanner">
            <div>
              Team A <br />
              {scores?.["C2"]}/{scores?.["C3"]}<br />
              {scores?.["C4"]} OVERS
            </div>
            <div>
              Team B <br />
              {scores?.["C5"]}/{scores?.["C6"]}<br />
              {scores?.["C7"]} OVERS
            </div>
            <div className="w-100">
              {remark.current}
            </div>
            <div className="cricket20bannertitle">Cricket Match 20-20</div>
          </div>
        </div>
       )}
        <div className="cricket20books">
          {(() => {
            const runResults = calculateRuns(mybetModel || [], 100);
            const hasData = Object.keys(runResults).length > 0;
            if (!hasData) return null;
            
            return Array.from({ length: 10 }, (_, index) => {
              const run = index + 1;
              const value = runResults[run] || 0;
              const isPositive = value >= 0;
              return (
                <div key={run}>
                  {run} -&gt;<span className={isPositive ? "text-success" : "text-danger"}>{value}</span>
                </div>
              );
            });
          })()}
        </div>
        <div className="casino-video-cards">
          
              {renderCards(cards.playerA, "Player A")}
            
          </div>
        
        </>
    );
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

  return (
    <CasinoLayout
    ruleDescription={ruleDescription}
      raceClass="cricket20"
      hideLoading={hideLoading}
      isBack={backOrLay}
      teamname={teamname}
      handleStakeChange={casinoBetDataNew}
      odds={odds}
      stakeValue={stakeValue}
      setOdds={setOdds}
      placeBet={placeBet}
      submitButtonDisable={submitButtonDisable}
      data={data}
      roundId={roundId}
      setRoundId={setRoundId}
      sportList={sportList}
      setSportList={setSportList}
      setData={setData}
      setLastResult={setLastResult}
      virtualVideoCards={renderVideoBox}
      getMinMaxLimits={getMinMaxLimits}
    >
      <div className="casino-table">
        <div className="cricket20-container">
          <div className="cricket20-left">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="score-box" key={index}>
                <div className="team-score">
                  <div>
                    <div className="text-center">
                      <b>Team A</b>
                    </div>
                    <div className="text-center">
                      <span className="ml-1">
                        {scores?.["C2"]}/{scores?.["C3"]}
                      </span>
                      <span className="ml-2">{scores?.["C4"]} Over</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-center">
                      <b>Team B</b>
                    </div>
                    <div className="text-center">
                      <span className="ml-1">
                        {scores?.["C5"]}/{scores?.["C6"]}
                      </span>
                      <span className="ml-1"> {scores?.["C7"]} Over</span>
                    </div>
                  </div>
                </div>
                <div className="ball-icon">
                  <img src={`/img/balls/cricket20/ball${index + 2}.png`} alt={`ball-${index + 2}`} />
                </div>
                <div className="blbox">
                  <div 
                    className={`casino-odds-box back ${totalBalls["Run " + (index + 2)].status}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Run " + (index + 2),
                        totalBalls["Run " + (index + 2)].odds.back
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalBalls["Run " + (index + 2)].status ? "0" : totalBalls["Run " + (index + 2)].odds.back}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalBalls["Run " + (index + 2)].status}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Run " + (index + 2),
                        totalBalls["Run " + (index + 2)].odds.lay
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalBalls["Run " + (index + 2)].status ? "0" : totalBalls["Run " + (index + 2)].odds.lay}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cricket20-right">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="score-box" key={index + 5}>
                <div className="team-score">
                  <div>
                    <div className="text-center">
                      <b>Team A</b>
                    </div>
                    <div className="text-center">
                      <span className="ml-1">
                        {scores?.["C2"]}/{scores?.["C3"]}
                      </span>
                      <span className="ml-1">{scores?.["C4"]} Over</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-center">
                      <b>Team B</b>
                    </div>
                    <div className="text-center">
                      <span className="ml-1">
                        {scores?.["C5"]}/{scores?.["C6"]}
                      </span>
                      <span className="ml-1"> {scores?.["C7"]} Over</span>
                    </div>
                  </div>
                </div>
                <div className="ball-icon">
                  <img src={`/img/balls/cricket20/ball${index + 7}.png`} alt={`ball-${index + 7}`} />
                </div>
                <div className="blbox">
                  <div 
                    className={`casino-odds-box back ${totalBalls["Run " + (index + 7)].status}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Run " + (index + 7),
                        totalBalls["Run " + (index + 7)].odds.back
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalBalls["Run " + (index + 7)].status ? "0" : totalBalls["Run " + (index + 7)].odds.back}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalBalls["Run " + (index + 7)].status}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Run " + (index + 7),
                        totalBalls["Run " + (index + 7)].odds.lay
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalBalls["Run " + (index + 7)].status ? "0" : totalBalls["Run " + (index + 7)].odds.lay}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="casino-remark mt-1">
          <marquee scrollamount="3">
            {remark.current}
          </marquee>
        </div>
      </div>
      
      <div className="casino-last-result-section">
        <div className="casino-last-result-title">
          <span>Last Result</span>
        </div>
        <div className="casino-last-results">
          <CasinoLastResult
            sportList={sportList}
            lastResults={lastResult}
            data={data}
          />
        </div>
      </div>
    </CasinoLayout>
  );
};

export default Cmatch20;
