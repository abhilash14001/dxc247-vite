import CasinoLayout from "../components/casino/CasinoLayout";
import { React, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import {  getExByTeamNameForCasino,
    getExBySingleTeamNameCasino,
  resetBetFields,
  placeCasinoBet,
  getExByColor,
  exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teen41 = () => {
  const [roundId, setRoundId] = useState("");

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
  const {mybetModel} = useContext(CasinoContext);
  
  // Get user data from Redux instead of AuthContext
  const userBalance = useSelector(state => state.user.balance);

  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["Player A", "Player B", "Player B Under 21", "Player B Over 21"]);

  const [data, setData] = useState([]);
  const [playerA, setPlayerA] = useState(0); // Example player A value
  const [playerStatuses, setPlayerStatuses] = useState({
    "Player A": "suspended-box",
    "Player B": "suspended-box",
    "Player B Under 21": "suspended-box",
    "Player B Over 21": "suspended-box",
  });
  const [playerA_Back, setPlayerA_Back] = useState(0);
  const [playerB_Back, setPlayerB_Back] = useState(0);
  const [playerA_Lay, setPlayerA_Lay] = useState(0);
  const [playerB_Under_21_Back, setPlayerB_Under_21_Back] = useState(0);
  const [playerB_Under_21_Lay, setPlayerB_Under_21_Lay] = useState(0);
  const [playerB_Over_21_Back, setPlayerB_Over_21_Back] = useState(0);
  const [playerB_Over_21_Lay, setPlayerB_Over_21_Lay] = useState(0);
  
  const [playerB, setPlayerB] = useState(0); // Example player B value
  const [playerB_Under_21, setPlayerB_Under_21] = useState(0);
  const [playerB_Over_21, setPlayerB_Over_21] = useState(0);

  const [playerB_Lay, setPlayerB_Lay] = useState(0);
  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  useEffect(() => {
    
    let isMounted = true; // this flag denotes whether the component is still mounted

    if (isMounted) {
      if (data?.sub) {
        updatePlayerStats(
          data.sub[0],
          setPlayerA_Back,
          setPlayerA_Lay,
          "Player A"
        );
        updatePlayerStats(
          data.sub[1],
          setPlayerB_Back,
          setPlayerB_Lay,
          "Player B"
        );
        updatePlayerStats(
          data.sub[2],
          setPlayerB_Under_21_Back,
          setPlayerB_Under_21_Lay,
          "Player B Under 21"
        );
        updatePlayerStats(
          data.sub[3],
          setPlayerB_Over_21_Back,
          setPlayerB_Over_21_Lay,
          "Player B Over 21"
        );
      }


      if (data.card) {
        const cardArray = data.card.split(",").map((item) => item.trim());
        let playerACards = cardArray.filter((_, index) => index % 2 === 0);
        let playerBCards = cardArray.filter((_, index) => index % 2 !== 0);
        setCards({
          playerA: playerACards,
          playerB: playerBCards,
        });
        remark.current = data.remark || "Welcome";
      }      
    }
    return () => {
      isMounted = false; // on cleanup, toggle the flag
    };
  }, [data?.sub]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  useEffect(() => {
    let isMounted = true; // this flag denotes whether the component is still mounted
    if (data?.sub && sportList?.id) {
      Promise.all([
        getExByTeamNameForCasino(
          sportList.id,
          data.mid,
          "Player A",
          match_id.toUpperCase(),
          'ODDS'
        ),
        getExByTeamNameForCasino(
          sportList.id,
          data.mid,
          "Player B",
          match_id.toUpperCase(),
          'ODDS'
        ),
        getExBySingleTeamNameCasino(
          sportList.id,
          roundId,
          "Player B Under 21",
          match_id.toUpperCase(),
          "UNDEROVER_B"
        ),
        getExBySingleTeamNameCasino(
          sportList.id,
          roundId,
          "Player B Over 21",
          match_id.toUpperCase(),
          "UNDEROVER_B"
        )
      ]).then(([playerARes, playerBRes, under21Res, over21Res]) => {
        if (isMounted) {
          setPlayerA(playerARes.data);
          setPlayerB(playerBRes.data);
          setPlayerB_Under_21(under21Res.data);
          setPlayerB_Over_21(over21Res.data);
        }
      }).catch((error) => {
        console.error("Error fetching exposure data:", error);
      });
    }

    return () => {
      isMounted = false; // on cleanup, toggle the flag
    };
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const updatePlayerStats = (
    playerData,
    setPlayerBack,
    setPlayerLay,
    playerName,
    teamsession
  ) => {
    if (!playerData) return;
    let playerStatus = "";
    if (playerData.gstatus === "SUSPENDED") {
      playerStatus = playerName === "Player B Under 21" || playerName === "Player B Over 21" ? "suspended-box" : "suspended-row";

      
    }
    setPlayerStatuses((prev) => ({ ...prev, [playerName]: playerStatus }));

    if (playerData.b) {
      setPlayerBack(playerData.b);
    } else {
      setPlayerBack(0);
    }
    if (playerData.l) {
      setPlayerLay(playerData.l);
    } else {
      setPlayerLay(0);
    }
  };
  const openPopup = (isBakOrLay, teamnam, oddvalue) => {


    if(teamnam === "Player B Under 21" || teamnam === "Player B Over 21") {
      setBetType("UNDEROVER_B");
    }
    else {
      setBetType("ODDS");
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

  // Helper function to find data in data.sub for Teen32
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Teen32, find the item by nat field
    return data.sub.find(
      (item) => item.nat.toUpperCase() === teamName.toUpperCase()
    );
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
      betType,
      stakeValue,
      match_id,
      roundIdSaved,
      totalPlayers: null,
      playerStatuses: playerStatuses[teamname.current],
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
      onSuccess: () => {},
    });

    return success;
  };

  const renderVideoBox = () => {
    return (
      <div className="video-overlay">
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
      </div>
    );
  };

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
.rules-section img {
  max-width: 100%;
}
    </style>
<div className="rules-section">
                                            <ul className="pl-4 pr-4 list-style">
                                                <li>Queen top teenpatti is a unique version of Indian origin game teenpatti (Flush).</li>
                                                <li>This game is played with a regular 52 cards deck between player A and player B.</li>
                                                <li>In Queen top open teenpatti all three cards of player A will be pre-defined for all the
                                                    games. These three cards will be permanently placed on the table.
                                                    <h6>3 pre-defined cards of player A</h6>
                                                    <ul className="pl-4 pr-4 list-style">
                                                        <li>Queen of Spade</li>
                                                        <li>Jack of Hearts</li>
                                                        <li>9 of Diamonds</li>
                                                    </ul>
                                                </li>
                                                <li>So now the game will begin with the remaining 49 cards (52-3 pre-defined cards =
                                                    49).
                                                </li>
                                                <li>Queen top open teenpatti is a three-card game. Three cards will be dealt to player B
                                                    simultaneously (at the same time) which will decide the result of the game Hence
                                                    that particular game will be over.
                                                </li>
                                                <li>Now always the last three drawn cards of player B will be removed and kept aside
                                                    thereafter a new game will commence from the remaining 46 cards then the same
                                                    process will continue till both players have winning chances or otherwise up to 36
                                                    cards or so.
                                                </li>
                                                <li>The objective of the game is to make the best three card hands as per the hand
                                                    rankings and therefor win.
                                                    <h6>Ranking of card hands from Highest to Lowest</h6>
                                                    <ul className="pl-4 pr-4 list-style">
                                                        <li>Straight Flush (Pure Sequence)</li>
                                                        <li>Trail (Three of a kind)</li>
                                                        <li>Straight (Sequence)</li>
                                                        <li>Flush (Color)</li>
                                                        <li>Pair (Two of a kind)</li>
                                                        <li>High card</li>
                                                        <li>You have betting options of Back and Lay.</li>
                                                        <li>Side bet market will be considered valid though the game ends in Tie (No Result).</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
</div>
`;

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
      <div className="casino-detail">
        <div className="casino-table">
          <div className="casino-table-box">
            {["Player A", "Player B"].map((playerName, i) => [
              <PlayerTable
                key={i}
                openPopup={openPopup}
                playerName={playerName}
                playerValue={i === 0 ? playerA : playerB}
                playerBack={i === 0 ? playerA_Back : playerB_Back}
                playerLay={i === 0 ? playerA_Lay : playerB_Lay}
                playerStatus={playerStatuses[playerName]}
                playerB_Under_21_Back={playerB_Under_21_Back}
                playerB_Under_21={playerB_Under_21}
                playerB_Over_21={playerB_Over_21}
                
                
                playerB_Over_21_Back={playerB_Over_21_Back}
                playerStatuses={playerStatuses}
              />,
              i === 0 && (
                <div key={"divider"} className="casino-table-box-divider"></div>
              ),
            ])}
          </div>
        </div>

        <marquee scrollamount="3" className="casino-remark m-b-10">
          {remark.current}
        </marquee>
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

const PlayerTable = ({
  playerName,
  playerValue,
  playerBack,
  openPopup,
  playerLay,
  playerStatus,
  playerB_Under_21_Back,
  playerB_Over_21_Back,
  playerB_Under_21,
  playerB_Over_21,
  playerStatuses
}) => (
  <div className="casino-table-left-box">
    <div className="casino-table-header">
      <div className="casino-nation-detail">{playerName}</div>
      <div className="casino-odds-box back">Back</div>
      <div className="casino-odds-box lay">Lay</div>
    </div>
    <div className={`casino-table-body`}>
      <div className={`casino-table-row`}>
        <div className="casino-nation-detail">
          <div className="casino-nation-name">Main</div>
          <p className="m-b-0">
            <span
              className={`font-weight-bold ${
                playerValue >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {playerValue}
            </span>
          </p>
        </div>
        <div
          className={`casino-odds-box back ${playerStatus}`}
          onClick={() => openPopup("back", playerName, playerBack)}
        >
          <span className="casino-odds">{playerBack}</span>
        </div>
        <div
          className={`casino-odds-box lay ${playerStatus}`}
          onClick={() => openPopup("lay", playerName, playerLay)}
        >
          <span className="casino-odds">{playerLay}</span>
        </div>
      </div>
      {playerName === "Player B" && (
      <div className="casino-table-row under-over-row">
        <div className="uo-box">
          <div className="casino-nation-detail">
            <div className="casino-nation-name">Player B Under 21</div>
            <p className="m-b-0">
              <span className="float-left">{getExByColor(playerB_Under_21)}</span>
            </p>
          </div>
          <div 
            className={`casino-odds-box back ${playerStatuses["Player B Under 21"]}`}
            onClick={() => openPopup("back", "Player B Under 21", playerB_Under_21_Back)}
          >
            <span className="casino-odds">{playerB_Under_21_Back}</span>
          </div>
        </div>
        <div className="uo-box">
          <div className="casino-nation-detail">
            <div className="casino-nation-name">Player B Over 21</div>
            <p className="m-b-0">
              <span className="float-left">{getExByColor(playerB_Over_21)}</span>
            </p>
          </div>
          <div 
            className={`casino-odds-box back ${playerStatuses["Player B Over 21"]}`}
            onClick={() => openPopup("back", "Player B Over 21", playerB_Over_21_Back)}
          >
            <span className="casino-odds">{playerB_Over_21_Back}</span>
          </div>
        </div>
      </div>
      )}
    </div>
  </div>
);

export default Teen41;
