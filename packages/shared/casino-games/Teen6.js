import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
  cardGenerate,
  cardMap,
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
import { getTotalSlides } from "react-slick/lib/utils/innerSliderUtils";

/**
 * Initializes a TeenPatti game with player data and betting information.
 * @returns {void}
 */
const Teen6 = () => {
  const [roundId, setRoundId] = useState("");

  const defaultStatusAmount = { status: "suspended-box", amounts: "" };
  const defaultValuesWithBackAndLay = {
    odds: { back: 0, lay: 0 },
    ...defaultStatusAmount,
  };
  const defaultValuesWithBack = { odds: { back: 0 }, ...defaultStatusAmount };

  const cardOdds = cardGenerate().map((entry, index) => {
    entry.team_name = "Card 1" + " - Card " + cardMap(index);
    entry.bet_type = "CARD1_SINGLE";
    return { ...entry, ...defaultValuesWithBack };
  });

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
        "Under 21": {
          ...defaultValuesWithBack,
          canonical_name: "Under 21",
          team_name: "Player A Under 21",
          bet_type: "UNDEROVER_A",
        },
      },
      {
        "Over 22": {
          ...defaultValuesWithBack,
          canonical_name: "Over 22",
          team_name: "Player A Over 22",
          bet_type: "UNDEROVER_A",
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
        "Under 21": {
          ...defaultValuesWithBack,
          canonical_name: "Under 21",
          team_name: "Player B Under 21",
          bet_type: "UNDEROVER_B",
        },
      },
      {
        "Over 22": {
          ...defaultValuesWithBack,
          canonical_name: "Over 22",
          team_name: "Player B Over 22",
          bet_type: "UNDEROVER_B",
        },
      },
    ],
    Spade: {
      ...defaultValuesWithBack,
      img: import.meta.env.VITE_CARD_PATH + "spade.png",
      team_name: "Card 1 - Spade",
      bet_type: "CARD1_SUIT",
    },
    Heart: {
      ...defaultValuesWithBack,
      img: import.meta.env.VITE_CARD_PATH + "heart.png",
      team_name: "Card 1 - Heart",
      bet_type: "CARD1_SUIT",
    },
    Club: {
      ...defaultValuesWithBack,
      img: import.meta.env.VITE_CARD_PATH + "club.png",
      team_name: "Card 1 - Club",
      bet_type: "CARD1_SUIT",
    },

    Diamond: {
      ...defaultValuesWithBack,
      img: import.meta.env.VITE_CARD_PATH + "diamond.png",
      team_name: "Card 1 - Diamond",
      bet_type: "CARD1_SUIT",
    },
    Odd: {
      ...defaultValuesWithBack,
      team_name: "Card 1 - Odd",
      bet_type: "CARD1_ODDEVEN",
    },
    Even: {
      ...defaultValuesWithBack,
      team_name: "Card 1 - Even",
      bet_type: "CARD1_ODDEVEN",
    },
    Cards: cardOdds,
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
  
  // Get user data from Redux instead of AuthContext
  const userBalance = useSelector(state => state.user.balance);

  const [hideLoading, setHideLoading] = useState(true);

  const desc = `<div><style type="text/css">
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

<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Teenpatti is an indian origin three cards game</li>
                                                <li>This game is played with a regular 52 cards deck between Player A and Player B .</li>
                                                <li>The objective of the game is to make the best three cards hand as per the hand rankings and win.</li>
                                                <li>You have a betting option of Back and Lay for the main bet.</li>
                                                <li>Rankings of the card hands from highest to lowest :</li>
                                                <li>1. Straight Flush (pure Sequence )</li>
                                                <li>2. Trail  (Three of a Kind )</li>
                                                <li>3. Straight (Sequence)</li>
                                                <li>4. Flush (Color )</li>
                                                <li>5. Pair (Two of a kind )</li>
                                                <li>6. High Card </li>
                                            </ul>
                                            <div>
                                                 <img src="/img/casino-rules/teen6.jpg" class="img-fluid">
                                            </div>
                                        </div></div>`;

  const [data, setData] = useState([]);

  const [playerStatuses, setPlayerStatuses] = useState({});

  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);


  const updatePlayers = () => {
    setTotalPlayers((prevPlayer) => {
      const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer));
      Object.entries(updatedPlayers).forEach(([index1, value1], i) => {
        if (Array.isArray(value1)) {
          value1.forEach((value2, index2) => {
            const key = Object.keys(value2)[0];

            const founddata = data.sub.find(
              (item) => item.nat === value2[key].team_name
            );
            if (founddata) {
              value2[key].odds.back = founddata.b;
              value2[key].odds.lay = founddata.l;
              value2[key].status =
                founddata.gstatus === "OPEN" ? "" : "suspended-box";
            }
          });
        } else {
          const spadeFind = data.sub.find(
            (item) => item.subtype === "suit" && item.gstatus === "OPEN"
          );

          let spadeOdd;

          if (["Spade", "Heart", "Diamond", "Club"].includes(index1)) {
            if (spadeFind) {
              spadeOdd = spadeFind.odds.find((item) => item.nat === index1);
              if (spadeOdd) {
                updatedPlayers[index1].odds.back = spadeOdd.b;
                updatedPlayers[index1].team_name =
                  spadeFind.nat + " - " + index1;
                updatedPlayers[index1].bet_type =
                  spadeFind.nat.replace(" ", "").toUpperCase() + "_SUIT";
                updatedPlayers[index1].odds.lay = spadeOdd.l;
                updatedPlayers[index1].status = "";
              } else {
                updatedPlayers[index1].odds.back = 0;
                updatedPlayers[index1].odds.lay = 0;
                updatedPlayers[index1].status = "suspended-box";
              }
            } else {
              updatedPlayers[index1].odds.back = 0;
              updatedPlayers[index1].odds.lay = 0;
              updatedPlayers[index1].status = "suspended-box";
            }
          }

          const oddEvenFind = data.sub.find(
            (item) => item.subtype === "oddeven" && item.gstatus === "OPEN"
          );

          let oddEvenOdd;
          if (["Odd", "Even"].includes(index1)) {
            if (oddEvenFind) {
              oddEvenOdd = oddEvenFind.odds.find((item) => item.nat === index1);

              if (oddEvenOdd) {
                updatedPlayers[index1].odds.back = oddEvenOdd.b;
                updatedPlayers[index1].odds.lay = oddEvenOdd.l;
                updatedPlayers[index1].team_name =
                  oddEvenFind.nat + " - " + index1;
                updatedPlayers[index1].bet_type =
                  spadeFind.nat.replace(" ", "").toUpperCase() + "_ODDEVEN";

                updatedPlayers[index1].status = "";
              } else {
                updatedPlayers[index1].odds.back = 0;
                updatedPlayers[index1].odds.lay = 0;
                updatedPlayers[index1].status = "suspended-box";
              }
            } else {
              updatedPlayers[index1].odds.back = 0;
              updatedPlayers[index1].odds.lay = 0;
              updatedPlayers[index1].status = "suspended-box";
            }
          }
        }

        if (index1 === "Cards") {
          const cardFind = data.sub.find(
            (item) => item.subtype === "cards" && item.gstatus === "OPEN"
          );

          if (cardFind) {
            value1.forEach((cardvalue, keyvalue) => {
              const teamn = cardvalue.team_name.split(" - ")[1];
              const cardOddFind = cardFind.odds.find(
                (item) => teamn === item.nat
              );

              if (cardOddFind) {
                cardvalue.odds.back = cardOddFind.b;
                cardvalue.status = "";
                cardvalue.team_name =
                  cardFind.nat + " - " + cardvalue.team_name.split(" - ")[1];
                cardvalue.bet_type =
                  cardFind.nat.replace(" ", "").toUpperCase() + "_SINGLE";
              }
            });
          } else {
            value1.forEach((cardvalue, keyvalue) => {
              cardvalue.odds.back = 0;
              cardvalue.status = "suspended-box";
            });
          }
        }
      });

      return updatedPlayers;
    });
  };
  const updateTotalPlayersAmounts = (team_name, bet_type, newAmount) => {
    setTotalPlayers((prevState) => {
      // Make a shallow copy of the state
      let updatedState = { ...prevState };

      // Iterate through totalPlayers keys
      Object.entries(updatedState).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // If the entry is an array (like Cards or Player A/B list)
          updatedState[key] = value.map((item) => {
            if (key === "Cards") {
              return {
                ...item,
                amounts:
                  item.team_name === team_name && item.bet_type === bet_type
                    ? newAmount
                    : item.amounts,
              };
            }

            // If item is an object (like Player A, Player B sub-objects)
            const itemKey = Object.keys(item)[0]; // Get the first key for nested objects

            const playerData = item[itemKey]; // Access the object with team_name and bet_type

            // Check if player/team name and bet type match
            if (
              playerData.team_name === team_name &&
              playerData.bet_type === bet_type
            ) {
              // Update only the amounts field

              return {
                [itemKey]: {
                  ...playerData,
                  amounts: newAmount, // Update only the amounts
                },
              };
            }
            return item; // Return unchanged item for non-matching entries
          });
        } else {
          // If the entry is an object (like Spade, Heart, etc.)
          if (value.team_name === team_name && value.bet_type === bet_type) {
            // Update only the amounts field

            updatedState[key] = {
              ...value,
              amounts: newAmount, // Update only the amounts
            };
          }
        }
      });

      // Return the updated state
      return updatedState;
    });
  };


  // Helper function to find data in data.sub using the same logic as updatePlayers
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Player A and Player B main bets
    if (betType === "ODDS") {
      return data.sub.find(item => item.nat === teamName);
    }

    // For suit bets (Spade, Heart, Diamond, Club)
    if (betType && betType.includes("_SUIT")) {
      // Extract card number from teamName like "Card 2 - Spade" -> "Card 2"
      const cardNumber = teamName.split(" - ")[0]; // "Card 2"
      return data.sub.find(item => item.nat === cardNumber && item.subtype === "suit");
    }

    // For odd/even bets
    if (betType && betType.includes("_ODDEVEN")) {
      // Extract card number from teamName like "Card 2 - Odd" -> "Card 2"
      const cardNumber = teamName.split(" - ")[0]; // "Card 2"
      return data.sub.find(item => item.nat === cardNumber && item.subtype === "oddeven");
    }

    // For card bets
    if (betType && betType.includes("_SINGLE")) {
      // Extract card number from teamName like "Card 2 - Card A" -> "Card 2"
      const cardNumber = teamName.split(" - ")[0]; // "Card 2"
      return data.sub.find(item => item.nat === cardNumber && item.subtype === "cards");
    }

    // For under/over bets
    if (betType && (betType.includes("UNDEROVER_A") || betType.includes("UNDEROVER_B"))) {
      return data.sub.find(item => item.nat === teamName);
    }

    return null;
  };

  const updateAmounts = async (individual = false) => {
    let promises = [];

    if (!individual) {
      promises = Object.entries(totalPlayers).map(([index, value]) => {
        let inside_promise = [];

        if (index === "Player A" || index === "Player B") {
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

        if (index === "Cards") {
          value.forEach((cardValue, cardIndex) => {
            inside_promise.push(
              getExBySingleTeamNameCasino(
                sportList.id,
                roundId,
                cardValue?.team_name,
                match_id.toUpperCase(),
                cardValue.bet_type
              )
            );
          });
        } else {
          if (!Array.isArray(value)) {
            inside_promise.push(
              getExBySingleTeamNameCasino(
                sportList.id,
                roundId,
                value?.team_name || index,
                match_id.toUpperCase(),
                value.bet_type || "ODDS"
              )
            );
          } else {
            value.forEach((evalue, eindex) => {
              const ev = Object.values(evalue)[0];

              inside_promise.push(
                getExBySingleTeamNameCasino(
                  sportList.id,
                  roundId,
                  ev?.team_name || eindex,
                  match_id.toUpperCase(),
                  ev.bet_type || "ODDS"
                )
              );
            });
          }
        }

        return inside_promise;
      });

      promises = [].concat(...promises);

      // Await all promises and retrieve data
      const promise_daa = await Promise.all(promises);

      // Update totalPlayers based on the promise_daa
      setTotalPlayers((prevState) => {
        const updatedState = JSON.parse(JSON.stringify(prevState));

        Object.entries(prevState).forEach(([index, value], i) => {
          if (!Array.isArray(value)) {
            promise_daa.forEach((cvalue, cindex) => {
              const json = JSON.parse(cvalue.config.data);
              // Check if player name matches
              if (json.player === value.team_name) {
                updatedState[index].amounts = cvalue.data || "";
              }
            });
          } else {
            if (index !== "Cards") {
              value.forEach((arrayvalue, arrayindex) => {
                promise_daa.forEach((cvalue, cindex) => {
                  const json = JSON.parse(cvalue.config.data);
                  const avalue = Object.values(arrayvalue)[0];
                  const okeys = Object.keys(arrayvalue)[0];

                  // Check if player name matches
                  if (json.player === avalue.team_name) {
                    updatedState[index][arrayindex][okeys].amounts =
                      cvalue.data || "";
                  } else if (json.player === index) {
                    updatedState[index][0][index].amounts = cvalue.data || "";
                  }
                });
              });
            }
          }

          if (index === "Cards") {
            value.forEach((cardvalue, cardindex) => {
              promise_daa.forEach((cvalue, cindex) => {
                const json = JSON.parse(cvalue.config.data);

                // Check if player name matches
                if (json.player === cardvalue.team_name) {
                  updatedState[index][cardindex].amounts = cvalue.data || "";
                }
              });
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

        updateTotalPlayersAmounts(
          teamname.current,
          individual,
          promises1[0].data
        );
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

        // Iterate over the resolved values and update total players amounts
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

      // Update playerStatuses dynamically for each player individually
      const newPlayerStatuses = {};

      // Update status for each player based on their individual status from data.sub
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
  }, [totalPlayers["Spade"]["team_name"], exposure, sportLength, roundId, mybetModel.length]);

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
      playerStatuses, // Add playerStatuses to betData
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

      onSuccess: () => {
        //  is already handled by placeCasinoBet
      },
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
      raceClass="teenpatti2"
      ruleDescription={desc}
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
          <div className="casino-table-box">
            <div className="casino-table-left-box">
              <div className="casino-table-header">
                <div className="casino-nation-detail">Player A</div>
                <div className="casino-odds-box back">Back</div>
                <div className="casino-odds-box lay">Lay</div>
              </div>
              <div className="casino-table-body">
                <div className="casino-table-row">
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
                <div className="casino-table-row under-over-row">
                  <div className="uo-box">
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">Under 21</div>
                    </div>
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">0</span>
                    </div>
                  </div>
                  <div className="uo-box">
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">Over 22</div>
                    </div>
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">0</span>
                    </div>
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
                <div className="casino-table-row">
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
                <div className="casino-table-row under-over-row">
                  <div className="uo-box">
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">Under 21</div>
                    </div>
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">0</span>
                    </div>
                  </div>
                  <div className="uo-box">
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">Over 22</div>
                    </div>
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="casino-table-full-box teen2other mt-3">
            {Object.entries(totalPlayers)
              .slice(2, 8)
              .map(([index, value], i) => (
                <div
                  className={`casino-odds-box back ${value.status}`}
                  onClick={() =>
                    openPopup(
                      "back",
                      value.team_name,
                      value.odds.back,
                      value.bet_type
                    )
                  }
                  key={i}
                >
                  {value.hasOwnProperty("img") && (
                    <div>
                      <img src={value.img} />
                    </div>
                  )}
                  {["Even", "Odd"].includes(index) && (
                    <div>
                      <b>{index}</b>
                    </div>
                  )}
                  <div>
                    <span className="casino-odds">{value.odds.back}</span>
                  </div>
                  <div className="float-right">
                    {getExByColor(value.amounts)}
                  </div>
                </div>
              ))}
          </div>
          <div className="casino-table-full-box teen2cards mt-3">
            {totalPlayers["Cards"].map((value, index) => (
              <div className="card-odd-box" key={index}>
                <span className="casino-odds">{value.odds.back}</span>
                <div
                  className={value.status}
                  onClick={() =>
                    openPopup(
                      "back",
                      value.team_name,
                      value.odds.back,
                      value.bet_type
                    )
                  }
                >
                  <img src={value[1]} />
                </div>
                <div className="float-right">
                  {getExByColor(value.amounts)}
                </div>
              </div>
            ))}
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
      
    </CasinoLayout>
  );
};

/**
 * Represents a table component for displaying player information and odds.
 * @param {Object} PlayerTable - The configuration object for the PlayerTable component.
 * @param {Function} openPopup - The function for opening a popup.
 * @param {string} [whichclassName="casino-table-left-box"] - The CSS class for the component.
 * @param {Array} players - The array of player data to display.
 * @param {string} playerName - The name of the player to display.
 * @returns {JSX.Element} The PlayerTable component JSX element.
 */
const PlayerTable = ({
  openPopup,
  whichClass = "casino-table-left-box",
  players,
  playerName,
}) => (
  <div className={whichClass}>
    <div className="casino-table-header">
      <div className="casino-nation-detail">{playerName}</div>
      <div className="casino-odds-box back">Back</div>
      <div className="casino-odds-box lay">Lay</div>
    </div>
    <div className="casino-table-body">
      {players.map((value, index) => {
        const values = Object.values(value)[0];
        const keys = Object.keys(value)[0];
        if (index === 0 && values.canonical_name === "Main") {
          return (
            <div key={index} className="casino-table-row">
              <div className="casino-nation-detail">
                <div className="casino-nation-name">
                  {values.canonical_name}
                </div>
                <div className="float-right">
                  {getExByColor(values.amounts)}
                </div>
              </div>
              {/* replace !!$player_a_sus!! and onClick handler with valid values */}
              <div
                className={`casino-odds-box back ${values.status}`}
                onClick={() =>
                  openPopup(
                    "back",
                    values?.team_name || keys,
                    values.odds.back,
                    values?.bet_type
                  )
                }
              >
                <span className="casino-odds">{values.odds.back}</span>
              </div>
              <div
                className={`casino-odds-box lay ${values.status}`}
                onClick={() =>
                  openPopup(
                    "lay",
                    values?.team_name || keys,
                    values.odds.lay,
                    values?.bet_type
                  )
                }
              >
                <span className="casino-odds">{values.odds.lay}</span>
              </div>
            </div>
          );
        }
        return null;
      })}

      <div className="casino-table-row under-over-row">
        {players.slice(1, 3).map((value, innerIndex) => {
          const innerValues = Object.values(value)[0];

          return (
            <div key={innerIndex} className="uo-box">
              <div className="casino-nation-detail">
                <div className="casino-nation-name">
                  {innerValues.canonical_name}
                </div>
                <div className="float-right">
                  {getExByColor(innerValues.amounts)}
                </div>
              </div>
              {/* replace !!$player_a_under21_sus!! with valid values */}
              <div
                className={`casino-odds-box back ${innerValues.status}`}
                onClick={() =>
                  openPopup(
                    "back",
                    innerValues.team_name,
                    innerValues.odds.back,
                    innerValues.bet_type
                  )
                }
              >
                <span className="casino-odds">{innerValues.odds.back}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default Teen6;
