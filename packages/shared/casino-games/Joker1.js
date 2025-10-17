import React, { useState, useEffect, useRef, useContext } from "react";
import CasinoLayout from "../components/casino/CasinoLayout";
import axiosFetch, {
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
  getExByColor
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";
import { AuthContext } from "../contexts/AuthContext";
import Notify from "../utils/Notify";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";

const Joker1 = () => {
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
	<p>Welcome to Joker1, a thrilling card selection game.</p>
	<p>Select your joker card from 1 to 13 and place your bet. The game follows standard joker rules where you choose your lucky number and compete against other players. Good Luck and win BIG!!!.</p>
	<h4>How to Play:</h4>
	<ul>
		<li>Select any joker card from 1 to 13</li>
		<li>Place your bet on Player A or Player B</li>
		<li>Wait for the result to see if your joker wins</li>
		<li>Higher joker number wins in case of a tie</li>
	</ul>
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
  const { getBalance } = useContext(AuthContext);
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

  const casinoBetDataNew = (value) => {
    const newValue = parseFloat(value) || 0;
    stakeValue.current = newValue;
    
    if (teamname.current) {
      const foundData = data.sub?.find(bet => bet.n === teamname.current);
      if (foundData) {
        setOdds(backOrLay === 'back' ? foundData.b : foundData.l);
      }
    }
  };

  const openPopup = (backOrLay, teamName, oddsValue, betType, displayName) => {
    if (!selectedJoker) {
      setJokerSelectionError("Please select a joker card first!");
      return;
    }
    
    setJokerSelectionError("");
    teamname.current = teamName;
    setbackOrLay(backOrLay);
    setOdds(oddsValue);
    setBetType(betType || 'BOOKMAKER');
    setPopupDisplayForDesktop(true);
    setShowMobilePopup(true);
  };

  const placeBet = async () => {
    if (!selectedJoker) {
      setJokerSelectionError("Please select a joker card first!");
      return false;
    }

    const betData = {
      sportList,
      roundId,
      backOrLay,
      teamname,
      odds,
      profit,
      loss,
      betType: 'BOOKMAKER',
      stakeValue,
      match_id: 'joker1',
      roundIdSaved,
      totalPlayers: teamNames.current,
      playerStatuses: playerStatus,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: null,
      Notify,
      selectedJoker
    };

    const success = await placeCasinoBet(betData, {
      odd_min_limit: () => {
        if (teamname.current && betType) {
          const foundData = data.sub?.find(bet => bet.n === teamname.current);
          if (foundData && foundData.min) {
            return foundData.min;
          }
        }
        return null;
      },
      odd_max_limit: () => {
        if (teamname.current && betType) {
          const foundData = data.sub?.find(bet => bet.n === teamname.current);
          if (foundData && foundData.max) {
            return foundData.max;
          }
        }
        return null;
      },
      onSuccess: () => {
        setJokerSelectionError("");
      }
    });

    return success;
  };

  const findDataInSub = (teamName, betType) => {
    if (!data.sub) return null;
    return data.sub.find(bet => bet.n === teamName);
  };

  const renderJokerSelection = () => {
    return (
      <div className="casino-table">
        <div className="casino-table-box">
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
               <span className="casino-odds"> {data?.sub?.[0]?.l || 0}

</span>
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

        <div className="casino-last-result-title">
          <span>Last Result</span>
          <span><a href="/casino-results/joker1">View All</a></span>
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

export default Joker1;
