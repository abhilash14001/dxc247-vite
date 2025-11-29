import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import axiosFetch, {
  getExByColor,
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Teen62 = () => {
  const [roundId, setRoundId] = useState("");

  const defaultStatusAmount = { status: "suspended-box", amounts: "" };
  const defaultValuesWithBackAndLay = {
    odds: { back: 0, lay: 0 },
    ...defaultStatusAmount,
  };
  const defaultValuesWithBack = { odds: { back: 0 }, ...defaultStatusAmount };

  const [totalPlayers, setTotalPlayers] = useState({
    "Player A": [
      {
        "Player A": {
          ...defaultValuesWithBackAndLay,
          canonical_name: "Main",
          bet_type: "ODDS",
          team_name: "Player A",
        },
      },
      {
        "Consecutive": {
          ...defaultValuesWithBackAndLay,
          canonical_name: "Consecutive",
          team_name: "Player A",
          bet_type: "CONSECUTIVE_A",
        },
      },
    ],
    "Player B": [
      {
        "Player B": {
          ...defaultValuesWithBackAndLay,
          canonical_name: "Main",
          bet_type: "ODDS",
          team_name: "Player B",
        },
      },
      {
        "Consecutive": {
          ...defaultValuesWithBackAndLay,
          canonical_name: "Consecutive",
          team_name: "Player B",
          bet_type: "CONSECUTIVE_B",
        },
      },
    ],
    "Card 1": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 1 - Odd", bet_type: "CARD1_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 1 - Even", bet_type: "CARD1_ODDEVEN" },
    },
    "Card 2": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 2 - Odd", bet_type: "CARD2_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 2 - Even", bet_type: "CARD2_ODDEVEN" },
    },
    "Card 3": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 3 - Odd", bet_type: "CARD3_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 3 - Even", bet_type: "CARD3_ODDEVEN" },
    },
    "Card 4": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 4 - Odd", bet_type: "CARD4_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 4 - Even", bet_type: "CARD4_ODDEVEN" },
    },
    "Card 5": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 5 - Odd", bet_type: "CARD5_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 5 - Even", bet_type: "CARD5_ODDEVEN" },
    },
    "Card 6": {
      Odd: { ...defaultValuesWithBack, team_name: "Card 6 - Odd", bet_type: "CARD6_ODDEVEN" },
      Even: { ...defaultValuesWithBack, team_name: "Card 6 - Even", bet_type: "CARD6_ODDEVEN" },
    },
  });

  const roundIdSaved = useRef(null);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [cards, setCards] = useState({});
  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);
  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { setBetType, betType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const {mybetModel} = useContext(CasinoContext);
  const { getBalance } = useContext(AuthContext);
  const [hideLoading, setHideLoading] = useState(true);
  const [data, setData] = useState([]);
  const [playerStatuses, setPlayerStatuses] = useState({});
  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

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
    .rules-section {
        text-align: left;
        margin-bottom: 10px;
    }
    .rules-section .table {
        color: #fff;
        border:1px solid #444;
        background-color: #222;
        font-size: 12px;
    }
    .rules-section .table td, .rules-section .table th {
        border-bottom: 1px solid #444;
    }
    .rules-section ul li, .rules-section p {
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
    .rules-section .list-style, .rules-section .list-style li {
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

<div class="rules-section">
    <ul class="pl-4 pr-4 list-style">
        <li>Teen62 is a card game played between Player A and Player B.</li>
        <li>You can bet on Main (Back/Lay) for each player.</li>
        <li>Consecutive betting option is available for both players.</li>
        <li>Card positions 1-6 have Odd/Even betting options.</li>
    </ul>
</div></div>`;

  const updatePlayers = () => {
    setTotalPlayers((prevPlayer) => {
      const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer));
      
      Object.entries(updatedPlayers).forEach(([index1, value1]) => {
        if (Array.isArray(value1)) {
          // Handle Player A and Player B arrays
          value1.forEach((value2) => {
            const key = Object.keys(value2)[0];
            const playerData = value2[key];
            
            // Find data based on subtype
            let founddata = null;
            if (playerData.bet_type === "ODDS") {
              // Main bet - subtype: "teen"
              founddata = data.sub.find(
                (item) => item.nat === playerData.team_name && item.subtype === "teen"
              );
            } else if (playerData.bet_type === "CONSECUTIVE_A" || playerData.bet_type === "CONSECUTIVE_B") {
              // Consecutive bet - subtype: "con"
              founddata = data.sub.find(
                (item) => item.nat === playerData.team_name && item.subtype === "con"
              );
            }
            
            if (founddata) {
              value2[key].odds.back = founddata.b || 0;
              value2[key].odds.lay = founddata.l || 0;
              value2[key].status = founddata.gstatus === "OPEN" ? "" : "suspended-box";
            } else {
              value2[key].odds.back = 0;
              value2[key].odds.lay = 0;
              value2[key].status = "suspended-box";
            }
          });
        } else if (typeof value1 === 'object' && value1.Odd && value1.Even) {
          // Handle Card 1-6 with Odd/Even
          const cardNumber = index1; // "Card 1", "Card 2", etc.
          const cardData = data.sub.find(
            (item) => item.nat === cardNumber && item.subtype === "oddeven"
          );
          
          if (cardData && cardData.odds && Array.isArray(cardData.odds)) {
            // Update Odd
            const oddData = cardData.odds.find((item) => item.nat === "Odd");
            if (oddData) {
              updatedPlayers[index1].Odd.odds.back = oddData.b || 0;
              updatedPlayers[index1].Odd.status = cardData.gstatus === "OPEN" ? "" : "suspended-box";
            } else {
              updatedPlayers[index1].Odd.odds.back = 0;
              updatedPlayers[index1].Odd.status = "suspended-box";
            }
            
            // Update Even
            const evenData = cardData.odds.find((item) => item.nat === "Even");
            if (evenData) {
              updatedPlayers[index1].Even.odds.back = evenData.b || 0;
              updatedPlayers[index1].Even.status = cardData.gstatus === "OPEN" ? "" : "suspended-box";
            } else {
              updatedPlayers[index1].Even.odds.back = 0;
              updatedPlayers[index1].Even.status = "suspended-box";
            }
          } else {
            updatedPlayers[index1].Odd.odds.back = 0;
            updatedPlayers[index1].Odd.status = "suspended-box";
            updatedPlayers[index1].Even.odds.back = 0;
            updatedPlayers[index1].Even.status = "suspended-box";
          }
        }
      });

      return updatedPlayers;
    });
  };

  const updateTotalPlayersAmounts = (team_name, bet_type, newAmount) => {
    setTotalPlayers((prevState) => {
      let updatedState = { ...prevState };

      Object.entries(updatedState).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          updatedState[key] = value.map((item) => {
            const itemKey = Object.keys(item)[0];
            const playerData = item[itemKey];

            if (
              playerData.team_name === team_name &&
              playerData.bet_type === bet_type
            ) {
              return {
                [itemKey]: {
                  ...playerData,
                  amounts: newAmount,
                },
              };
            }
            return item;
          });
        } else if (typeof value === 'object' && value.Odd && value.Even) {
          // Handle Card Odd/Even
          if (value.Odd.team_name === team_name && value.Odd.bet_type === bet_type) {
            updatedState[key].Odd.amounts = newAmount;
          }
          if (value.Even.team_name === team_name && value.Even.bet_type === bet_type) {
            updatedState[key].Even.amounts = newAmount;
          }
        }
      });

      return updatedState;
    });
  };

  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Main bets (ODDS)
    if (betType === "ODDS") {
      return data.sub.find(item => item.nat === teamName && item.subtype === "teen");
    }

    // For Consecutive bets
    if (betType === "CONSECUTIVE_A" || betType === "CONSECUTIVE_B") {
      return data.sub.find(item => item.nat === teamName && item.subtype === "con");
    }

    // For Odd/Even bets
    if (betType && betType.includes("_ODDEVEN")) {
      const cardNumber = teamName.split(" - ")[0]; // "Card 1", "Card 2", etc.
      const oddEvenType = teamName.split(" - ")[1]; // "Odd" or "Even"
      const cardData = data.sub.find(item => item.nat === cardNumber && item.subtype === "oddeven");
      
      if (cardData && cardData.odds && Array.isArray(cardData.odds)) {
        const oddEvenData = cardData.odds.find(item => item.nat === oddEvenType);
        if (oddEvenData) {
          // Return a structure that matches the expected format with min/max from cardData
          return {
            ...oddEvenData,
            min: cardData.min,
            max: cardData.max,
            gstatus: cardData.gstatus
          };
        }
      }
    }

    return null;
  };

  const updateAmounts = async (individual = false) => {
    let promises = [];

    if (!individual) {
      promises = Object.entries(totalPlayers).map(([index, value]) => {
        let inside_promise = [];

        if (index === "Player A" || index === "Player B") {
          // Main bet
          inside_promise.push(
            getExByTeamNameForCasino(
              sportList.id,
              roundId,
              index,
              match_id,
              "ODDS"
            )
          );
        }

        if (Array.isArray(value)) {
          value.forEach((evalue) => {
            const ev = Object.values(evalue)[0];
            if (ev.bet_type !== "ODDS") {
              inside_promise.push(
                getExBySingleTeamNameCasino(
                  sportList.id,
                  roundId,
                  ev?.team_name || index,
                  match_id.toUpperCase(),
                  ev.bet_type || "ODDS"
                )
              );
            }
          });
        } else if (typeof value === 'object' && value.Odd && value.Even) {
          // Card Odd/Even bets
          inside_promise.push(
            getExBySingleTeamNameCasino(
              sportList.id,
              roundId,
              value.Odd.team_name,
              match_id.toUpperCase(),
              value.Odd.bet_type
            )
          );
          inside_promise.push(
            getExBySingleTeamNameCasino(
              sportList.id,
              roundId,
              value.Even.team_name,
              match_id.toUpperCase(),
              value.Even.bet_type
            )
          );
        }

        return inside_promise;
      });

      promises = [].concat(...promises);
      const promise_daa = await Promise.all(promises);

      setTotalPlayers((prevState) => {
        const updatedState = JSON.parse(JSON.stringify(prevState));

        Object.entries(prevState).forEach(([index, value]) => {
          if (Array.isArray(value)) {
            value.forEach((arrayvalue) => {
              promise_daa.forEach((cvalue) => {
                const json = JSON.parse(cvalue.config.data);
                const avalue = Object.values(arrayvalue)[0];
                const okeys = Object.keys(arrayvalue)[0];

                if (json.player === avalue.team_name && json.bet_type === avalue.bet_type) {
                  updatedState[index].find(item => Object.keys(item)[0] === okeys)[okeys].amounts = cvalue.data || "";
                } else if (json.player === index && avalue.bet_type === "ODDS") {
                  updatedState[index][0][index].amounts = cvalue.data || "";
                }
              });
            });
          } else if (typeof value === 'object' && value.Odd && value.Even) {
            promise_daa.forEach((cvalue) => {
              const json = JSON.parse(cvalue.config.data);
              if (json.player === value.Odd.team_name && json.bet_type === value.Odd.bet_type) {
                updatedState[index].Odd.amounts = cvalue.data || "";
              }
              if (json.player === value.Even.team_name && json.bet_type === value.Even.bet_type) {
                updatedState[index].Even.amounts = cvalue.data || "";
              }
            });
          }
        });

        return updatedState;
      });
    } else {
      if (individual !== "ODDS") {
        promises.push(
          getExBySingleTeamNameCasino(
            sportList.id,
            roundId,
            teamname.current,
            match_id.toUpperCase(),
            individual
          )
        );

        const promises1 = await Promise.all(promises);
        updateTotalPlayersAmounts(teamname.current, individual, promises1[0].data);
      } else {
        promises.push(
          getExByTeamNameForCasino(
            sportList.id,
            roundId,
            "Player A",
            match_id.toUpperCase(),
            individual
          )
        );
        promises.push(
          getExByTeamNameForCasino(
            sportList.id,
            roundId,
            "Player B",
            match_id.toUpperCase(),
            individual
          )
        );

        const promisesResults = await Promise.all(promises);
        promisesResults.forEach((result, index) => {
          const playerName = index === 0 ? "Player A" : "Player B";
          updateTotalPlayersAmounts(playerName, individual, result.data || "");
        });
      }
    }
  };

  useEffect(() => {
    if (data?.sub) {
      updatePlayers();

      const newPlayerStatuses = {};
      data.sub.forEach((item) => {
        const playerStatus = item.gstatus === "OPEN" ? "" : "suspended-box";
        newPlayerStatuses[item.nat] = playerStatus;
      });

      setPlayerStatuses(newPlayerStatuses);
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
  }, [data?.sub]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  useEffect(() => {
    if (data?.sub && sportList?.id) {
      updateAmounts();
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
    setBetType(bet);

    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
    }
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
      loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
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
      totalPlayers: totalPlayers[teamname.current],
      playerStatuses,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts: () => updateAmounts(betType),
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
    return { min: 100, max: 100000 };
  };

  return (
    <CasinoLayout
      raceClass="teenpatti1day"
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
            <div className="casino-table-left-box">
              <div className="casino-table-header">
                <div className="casino-nation-detail">Player A</div>
                <div className="casino-odds-box back">Back</div>
                <div className="casino-odds-box lay">Lay</div>
              </div>
              <div className="casino-table-body">
                <div className={`casino-table-row ${totalPlayers["Player A"]?.[0]?.["Player A"]?.status ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                  </div>
                  <div 
                    className={`casino-odds-box back ${totalPlayers["Player A"]?.[0]?.["Player A"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player A",
                        totalPlayers["Player A"]?.[0]?.["Player A"]?.odds?.back || 0,
                        totalPlayers["Player A"]?.[0]?.["Player A"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player A"]?.[0]?.["Player A"]?.status ? "0" : (totalPlayers["Player A"]?.[0]?.["Player A"]?.odds?.back || "0")}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalPlayers["Player A"]?.[0]?.["Player A"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player A",
                        totalPlayers["Player A"]?.[0]?.["Player A"]?.odds?.lay || 0,
                        totalPlayers["Player A"]?.[0]?.["Player A"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player A"]?.[0]?.["Player A"]?.status ? "0" : (totalPlayers["Player A"]?.[0]?.["Player A"]?.odds?.lay || "0")}
                    </span>
                  </div>
                </div>
                <div className={`casino-table-row ${totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Consecutive</div>
                  </div>
                  <div 
                    className={`casino-odds-box back ${totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player A",
                        totalPlayers["Player A"]?.[1]?.["Consecutive"]?.odds?.back || 0,
                        totalPlayers["Player A"]?.[1]?.["Consecutive"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status ? "0" : (totalPlayers["Player A"]?.[1]?.["Consecutive"]?.odds?.back || "0")}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player A",
                        totalPlayers["Player A"]?.[1]?.["Consecutive"]?.odds?.lay || 0,
                        totalPlayers["Player A"]?.[1]?.["Consecutive"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status ? "0" : (totalPlayers["Player A"]?.[1]?.["Consecutive"]?.odds?.lay || "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="casino-table-box-divider"></div>
            <div className="casino-table-right-box">
              <div className="casino-table-header">
                <div className="casino-nation-detail">Player B</div>
                <div className="casino-odds-box back">Back</div>
                <div className="casino-odds-box lay">Lay</div>
              </div>
              <div className="casino-table-body">
                <div className={`casino-table-row ${totalPlayers["Player B"]?.[0]?.["Player B"]?.status ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                  </div>
                  <div 
                    className={`casino-odds-box back ${totalPlayers["Player B"]?.[0]?.["Player B"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player B",
                        totalPlayers["Player B"]?.[0]?.["Player B"]?.odds?.back || 0,
                        totalPlayers["Player B"]?.[0]?.["Player B"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player B"]?.[0]?.["Player B"]?.status ? "0" : (totalPlayers["Player B"]?.[0]?.["Player B"]?.odds?.back || "0")}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalPlayers["Player B"]?.[0]?.["Player B"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player B",
                        totalPlayers["Player B"]?.[0]?.["Player B"]?.odds?.lay || 0,
                        totalPlayers["Player B"]?.[0]?.["Player B"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player B"]?.[0]?.["Player B"]?.status ? "0" : (totalPlayers["Player B"]?.[0]?.["Player B"]?.odds?.lay || "0")}
                    </span>
                  </div>
                </div>
                <div className={`casino-table-row ${totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Consecutive</div>
                  </div>
                  <div 
                    className={`casino-odds-box back ${totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player B",
                        totalPlayers["Player B"]?.[1]?.["Consecutive"]?.odds?.back || 0,
                        totalPlayers["Player B"]?.[1]?.["Consecutive"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status ? "0" : (totalPlayers["Player B"]?.[1]?.["Consecutive"]?.odds?.back || "0")}
                    </span>
                  </div>
                  <div 
                    className={`casino-odds-box lay ${totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player B",
                        totalPlayers["Player B"]?.[1]?.["Consecutive"]?.odds?.lay || 0,
                        totalPlayers["Player B"]?.[1]?.["Consecutive"]?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status ? "0" : (totalPlayers["Player B"]?.[1]?.["Consecutive"]?.odds?.lay || "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card 1-6 with Odd/Even */}
          <div className="casino-table-full-box teenpatti1day-other-odds mt-3">
            <div className="casino-table-header">
              <div className="casino-nation-detail"></div>
              <div className="casino-odds-box">Card 1</div>
              <div className="casino-odds-box">Card 2</div>
              <div className="casino-odds-box">Card 3</div>
              <div className="casino-odds-box">Card 4</div>
              <div className="casino-odds-box">Card 5</div>
              <div className="casino-odds-box">Card 6</div>
            </div>
            <div className="casino-table-body">
              {/* Odd Row */}
              <div className="casino-table-row">
                <div className="casino-nation-detail">
                  <div className="casino-nation-name">Odd</div>
                </div>
                {["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"].map((cardNum) => (
                  <div 
                    key={cardNum}
                    className={`casino-odds-box back ${totalPlayers[cardNum]?.Odd?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        totalPlayers[cardNum]?.Odd?.team_name,
                        totalPlayers[cardNum]?.Odd?.odds?.back || 0,
                        totalPlayers[cardNum]?.Odd?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers[cardNum]?.Odd?.status ? "0" : (totalPlayers[cardNum]?.Odd?.odds?.back || "0")}
                    </span>
                  </div>
                ))}
              </div>
              {/* Even Row */}
              <div className="casino-table-row">
                <div className="casino-nation-detail">
                  <div className="casino-nation-name">Even</div>
                </div>
                {["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"].map((cardNum) => (
                  <div 
                    key={cardNum}
                    className={`casino-odds-box back ${totalPlayers[cardNum]?.Even?.status || ''}`}
                    onClick={() =>
                      openPopup(
                        "back",
                        totalPlayers[cardNum]?.Even?.team_name,
                        totalPlayers[cardNum]?.Even?.odds?.back || 0,
                        totalPlayers[cardNum]?.Even?.bet_type
                      )
                    }
                  >
                    <span className="casino-odds">
                      {totalPlayers[cardNum]?.Even?.status ? "0" : (totalPlayers[cardNum]?.Even?.odds?.back || "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <marquee scrollamount="3" className="casino-remark m-b-10">
          {remark.current}
        </marquee>
        
        <div className="casino-last-result-title">
          <span>Last Result</span>
          <span><a href="/casino-results/teen62">View All</a></span>
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

export default Teen62;

