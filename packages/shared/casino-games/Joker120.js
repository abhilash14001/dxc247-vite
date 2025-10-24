import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import CasinoLayout from "../components/casino/CasinoLayout";
import axiosFetch, {
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
  getExByColor,
  cardMap
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";
import { AuthContext } from "../contexts/AuthContext";
import Notify from "../utils/Notify";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";

const Joker120 = () => {
  const profitData = useRef(0);
  const profit = useRef(0);
  const loss = useRef(0);
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

    .rules-section .row.row5>[class*="col-"],
    .rules-section .row.row5>[class*="col"] {
        padding-left: 5px;
        padding-right: 5px;
    }

    .rules-section {
        text-align: left;
        margin-bottom: 10px;
    }

    .rules-section .table {
        color: #fff;
        border: 1px solid #444;
        background-color: #222;
        font-size: 12px;
    }

    .rules-section .table td,
    .rules-section .table th {
        border-bottom: 1px solid #444;
    }

    .rules-section ul li,
    .rules-section p {
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

    .rules-section .rules-highlight {
        color: #FDCF13;
        font-size: 16px;
    }

    .rules-section .rules-sub-highlight {
        color: #FDCF13;
        font-size: 14px;
    }

    .rules-section .list-style,
    .rules-section .list-style li {
        list-style: disc;
    }

    .rules-section .rule-card {
        height: 20px;
        margin-left: 5px;
    }

    .rules-section .card-character {
        font-family: Card Characters;
    }

    .rules-section .red-card {
        color: red;
    }

    .rules-section .black-card {
        color: black;
    }

    .rules-section .cards-box {
        background: #fff;
        padding: 6px;
        display: inline-block;
        color: #000;
        min-width: 150px;
    }
    </style>

<div class="rules-section">
                                                <p>Welcome to Unlimited Joker Teenpatti 20-20, a new version of Joker Teenpatti 20-20.</p>
                                                <p>Teenpatti games are the most popular on our platforms and we are very excited to announce this new version of Teenpatti called Unlimited Joker Teenpatti. To keep the game as simple as it is and make it more exciting , we have introduced a Joker to the game. The game follows the same standard rules of Teenpatti but at the beginning of the round players can select their own Joker that can act as any missing or highest card to make a high hand to defeat the opponent player OR play regular Teenpatti without selecting any Joker.
</p>
                                                <p>For Example:</p>
                                                <img src="/img/casino/rules/joker1.jpg" class="img-fluid">
                                                <p>Player A wins because THE JOKER can act as the highest card.</p>
                                                <img src="/img/casino/rules/joker2.jpg" class="img-fluid">
                                                <p>Player A wins because THE JOKER can act as the highest color card.</p>
                                                <h4>Standard Rules.</h4>
                                                <div>
                                                    <img src="/img/casino/rules/teen6.jpg" class="img-fluid">
                                                </div>
                                            </div></div>`;

  const [roundId, setRoundId] = useState("");
  const roundIdSaved = useRef(null);
  const remark = useRef("Welcome");
  const teamname = useRef("");
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [displayJokerCard, setDisplayJokerCard] = useState(false);
  const [lastResult, setLastResult] = useState({});
  const [mybetModel, setMybetModel] = useState([]);

  const [cards, setCards] = useState({});

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);
  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const { setShowMobilePopup } = useContext(CasinoContext);
  
  // Get user data from Redux instead of AuthContext
  const userBalance = useSelector(state => state.user.balance);
  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["Player A", "Player B"]);
  const [data, setData] = useState([]);

  const [playerAmounts, setPlayerAmounts] = useState({
    "Player A": "",
    "Player B": "",
  });

  useEffect(() => {
    setBetType('BOOKMAKER');
    setShowMobilePopup(false);
  }, []);

  // Fetch matched bet data
  useEffect(() => {
    if (sportList?.id) {
      axiosFetch("matched-bet-details/" + sportList.id, "get", setMybetModel);
    }
  }, [sportList?.id, exposureCheck]);

  useEffect(() => {
    if (data.card) {
      const cardArray = data.card.split(",").map((item) => item.trim());

      let playerACards = cardArray.filter((_, index) => index % 2 == 0);
      let playerBCards = cardArray.filter(
        (_, index) => index % 2 !== 0
      );

      const isEvery = playerACards.every(card => card =="1");
      if (isEvery) {
        playerACards.pop(); // just remove last element, keep array
      }
      setCards({
        
        playerA: playerACards,
        playerB: playerBCards,
      });
      remark.current = data.remark || "Welcome";
    }
  }, [data?.card]);

  const [playerStatus, setPlayerStatus] = useState("suspended");

  // Joker selection state
  const { selectedJoker, setSelectedJoker } = useContext(CasinoContext);
  const [jokerSelectionError, setJokerSelectionError] = useState("");

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  const refreshPlayerExposures = () => {
    const playerNames = ['Player A', 'Player B'];
    
    playerNames.forEach(playerName => {
    
      getExBySingleTeamNameCasino(sportList.id, roundId, playerName, match_id, 'BOOKMAKER').then(res => {
        setPlayerAmounts(prev => ({
          ...prev,
          [playerName]: res.data
        }));
      }).catch(error => {
        console.error(`Error fetching data for ${playerName}:`, error);
      });
    });
  };

  useEffect(() => {
    if (sportList?.id && roundId) {
      refreshPlayerExposures();
      setDisplayJokerCard(false);
      setSelectedJoker(null);
    }
  }, [sportList?.id, roundId, exposureCheck]);

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
      match_id: "joker120",
      roundIdSaved,
      totalPlayers: null,
      playerStatuses: playerStatus,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: null,
      Notify,
      selectedJoker: selectedJoker,
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
        
        setDisplayJokerCard(true);
        refreshPlayerExposures();
      },
    });

    return success;
  };

  useEffect(() => {
    if (data?.sub) {
      setPlayerStatus(data.sub[0].gstatus == "OPEN" ? "" : "suspended");
    }
  }, [data?.sub]);

  // Joker selection functions
  const handleJokerSelection = (jokerNumber) => {
    setJokerSelectionError("");
    setSelectedJoker(jokerNumber);
  };

  const isJokerSelected = (jokerNumber) => {
    return selectedJoker === jokerNumber;
  };

  const openPopup = (isBakOrLay, teamnam, oddvalue, winnerName, playerName) => {
    
    if (selectedJoker !== null) {
      const jokerCardName = cardMap(selectedJoker, false);
      teamnam = teamnam + " - Joker " + jokerCardName;
    }

    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
    } else {
      Notify("Odds Should Not Be Zero", null, null, "danger");
    }
  };

  // Helper function to find data in data.sub
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;
    return data.sub.find((item) => item.nat === teamName) || data.sub[0];
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

  const renderJokerSelection = () => {
    return (
      <div className="casino-table">
        <div className="casino-table-box">
          { playerStatus !== "suspended" && displayJokerCard == false && (
          <div className="joker1-box">
            <div className="joker1-other-cards">
              <h4>Select your Joker</h4>
              <div>
                {Array.from({ length: 13 }, (_, i) => i + 1).map(
                  (jokerNumber) => (
                    <img
                      key={jokerNumber}
                      className={
                        isJokerSelected(jokerNumber) &&
                        playerStatus !== "suspended"
                          ? "select"
                          : ""
                      }
                      src={`/img/joker1/${jokerNumber}.png`}
                      alt={`Joker ${jokerNumber}`}
                      onClick={() => handleJokerSelection(jokerNumber)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          )}
          <div className="casino-table-left-box">
            <div className="casino-table-row">
              <div className="casino-nation-detail">
                <div className="casino-nation-name">Player A</div>
                {getExByColor(playerAmounts['Player A'])}
              </div>
              <div
                className={`casino-odds-box back ${
                  playerStatus === "suspended" ? "suspended-box" : ""
                }`}
                onClick={() =>
                  openPopup(
                    "back",
                    "Player A",
                    data?.sub?.[0]?.b || 1.98,
                    "",
                    "Player A"
                  )
                }
              >
                <span className="casino-odds">
                  {playerStatus === "suspended"
                    ? "0"
                    : data?.sub?.[0]?.b || 1.98}
                </span>
              </div>
              <div
                className={`casino-odds-box lay ${
                  playerStatus === "suspended" ? "suspended-box" : ""
                }`}
              >
                <span className="casino-odds">   {data?.sub?.[0]?.l || 0}</span>
              </div>
            </div>
          </div>

          <div className="casino-table-left-box">
            <div className="casino-table-row">
              <div className="casino-nation-detail">
                <div className="casino-nation-name">Player B</div>
                {getExByColor(playerAmounts['Player B'])}
                </div>
              <div
                className={`casino-odds-box back ${
                  playerStatus === "suspended" ? "suspended-box" : ""
                }`}
                onClick={() =>
                  openPopup(
                    "back",
                    "Player B",
                    data?.sub?.[0]?.b || 1.98,
                    "",
                    "Player B"
                  )
                }
              >
                <span className="casino-odds">
                  {playerStatus === "suspended"
                    ? "0"
                    : data?.sub?.[1]?.b || 1.98}
                </span>
                
              </div>
              <div
                className={`casino-odds-box lay ${
                  playerStatus === "suspended" ? "suspended-box" : ""
                }`}
              >
               <span className="casino-odds"> {data?.sub?.[1]?.l || 0}

</span>
              </div>
            </div>
          </div>
        </div>

        {jokerSelectionError && (
          <div className="joker-selection-error text-danger mt-2">
            {jokerSelectionError}
          </div>
        )}
      </div>
    );
  };

  // Function to get current min/max limits for the active bet
  const getMinMaxLimits = () => {
    if (teamname.current && betType) {
      const foundData = findDataInSub(teamname.current, betType);
      if (foundData) {
        return {
          min: foundData.min || 100,
          max: foundData.max || 100000,
        };
      }
    }
    return { min: 100, max: 100000 };
  };

  const renderCards = (cards, player) => {
    if (player === "Joker") {
      return (
        <span><img  src={`${selectedJoker && displayJokerCard ? `/img/joker1/${selectedJoker}.png` : "/img/joker1/14.png" }`} /></span>
      );
    }
    
    return (
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
  };
  

  const renderVideoBox = () => {
    return (
      <>
        <div className="joker-card">
          <h5 className="text-playerb">Joker</h5>
          {renderCards(cards.joker, "Joker")}
        </div>
        <div className="casino-video-cards">
          <div>
            <h5>Player A</h5>
            {renderCards(cards.playerA, "Player A")}
          </div>
          <div className="mt-1">
            <h5>Player B</h5>
            {renderCards(cards.playerB, "Player B")}
          </div>
        </div>
      </>
    );
  };

  return (
    <CasinoLayout
      raceClass="teenpatti-joker1"
      ruleDescription={ruleDescription}
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
      getMinMaxLimits={getMinMaxLimits}
      virtualVideoCards={renderVideoBox}
    >
      <div className="casino-detail">
        {/* Joker Selection UI */}
        {renderJokerSelection()}

        <marquee scrollamount="3" className="casino-remark m-b-10">
          {remark.current}
        </marquee>

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

export default Joker120;
