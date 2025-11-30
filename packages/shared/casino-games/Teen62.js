import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import {
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  getExByTeamNamesAndBetTypesBulk,
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
          bet_type: "CONSECUTIVE",
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
          bet_type: "CONSECUTIVE",
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
                                                <li>Teenpatti is an indian origin three cards game.</li>
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
                                        </div></div><div><div class="rules-section">
                                            <div>
                                                <h6 class="rules-highlight">Side bets  :</h6>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li><b>CONSECUTIVE CARDS:</b> It is a bet of having two or more consecutive cards in the game.</li>
                                                <li>eg: 2,3,5      10,3,9      Q,5,K     6,7,8    A,K,7</li>
                                                <li>For both the players Back and Lay odds are available, you can bet on either or both the players.</li>
                                                <li><b>Odd - Even :</b>  Here you can bet on every card whether it will be an odd card or an even card.</li>
                                                <li><b>ODD CARDS :</b> A,3,5,7,9,J,K</li>
                                                <li><b>EVEN CARDS:</b> 2,4,6,8,10,Q</li>
<li><b>NOTE:</b> In case of a Tie between the player A and player B bets placed on player A and player B  (Main bets ) will be returned. (Pushed)</li>
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
            } else if (playerData.bet_type === "CONSECUTIVE") {
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

    // Extract base player name from "Player A Main" or "Player A Consecutive"
    let basePlayerName = teamName;
    if (teamName.includes(" Main")) {
      basePlayerName = teamName.replace(" Main", "");
    } else if (teamName.includes(" Consecutive")) {
      basePlayerName = teamName.replace(" Consecutive", "");
    }

    // For Main bets (ODDS)
    if (betType === "ODDS") {
      return data.sub.find(item => item.nat === basePlayerName && item.subtype === "teen");
    }

    // For Consecutive bets
    if (betType === "CONSECUTIVE") {
      return data.sub.find(item => item.nat === basePlayerName && item.subtype === "con");
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
      // Use bulk call for all bet types matching backend structure
      // bet_types should be an object: { "ODDS": [...], "CONSECUTIVE": [...], ... }
      const betTypes = {
        "ODDS": ["Player A Main", "Player B Main"],
        "CONSECUTIVE": ["Player A Consecutive", "Player B Consecutive"],
        "CARD1_ODDEVEN": ["Odd", "Even"],
        "CARD2_ODDEVEN": ["Odd", "Even"],
        "CARD3_ODDEVEN": ["Odd", "Even"],
        "CARD4_ODDEVEN": ["Odd", "Even"],
        "CARD5_ODDEVEN": ["Odd", "Even"],
        "CARD6_ODDEVEN": ["Odd", "Even"]
      };
      
      const bulkResult = await getExByTeamNamesAndBetTypesBulk(
        sportList.id,
        betTypes
      );
      
      // Process results and update totalPlayers
      setTotalPlayers((prevState) => {
        const updatedState = JSON.parse(JSON.stringify(prevState));
        
        if (bulkResult?.data) {
          // Process ODDS (Main bets)
          if (bulkResult.data["ODDS"]) {
            bulkResult.data["ODDS"].forEach((item) => {
              const teamName = item.nat?.trim();
              if (teamName === "Player A Main") {
                if (updatedState["Player A"]?.[0]?.["Player A"]) {
                  updatedState["Player A"][0]["Player A"].amounts = item.result || "";
                }
              } else if (teamName === "Player B Main") {
                if (updatedState["Player B"]?.[0]?.["Player B"]) {
                  updatedState["Player B"][0]["Player B"].amounts = item.result || "";
                }
              }
            });
          }
          
          // Process CONSECUTIVE
          if (bulkResult.data["CONSECUTIVE"]) {
            bulkResult.data["CONSECUTIVE"].forEach((item) => {
              const teamName = item.nat?.trim();
              if (teamName === "Player A Consecutive") {
                if (updatedState["Player A"]?.[1]?.["Consecutive"]) {
                  updatedState["Player A"][1]["Consecutive"].amounts = item.result || "";
                }
              } else if (teamName === "Player B Consecutive") {
                if (updatedState["Player B"]?.[1]?.["Consecutive"]) {
                  updatedState["Player B"][1]["Consecutive"].amounts = item.result || "";
                }
              }
            });
          }
          
          // Process Card Odd/Even bets (CARD1_ODDEVEN through CARD6_ODDEVEN)
          ["CARD1_ODDEVEN", "CARD2_ODDEVEN", "CARD3_ODDEVEN", "CARD4_ODDEVEN", "CARD5_ODDEVEN", "CARD6_ODDEVEN"].forEach((betType) => {
            if (bulkResult.data[betType]) {
              bulkResult.data[betType].forEach((item) => {
                const teamName = item.nat?.trim();
                const cardNumber = betType.replace("_ODDEVEN", ""); // "CARD1", "CARD2", etc.
                const cardKey = cardNumber.replace("CARD", "Card "); // "Card 1", "Card 2", etc.
                
                if (teamName === "Odd" && updatedState[cardKey]?.Odd) {
                  updatedState[cardKey].Odd.amounts = item.result || "";
                } else if (teamName === "Even" && updatedState[cardKey]?.Even) {
                  updatedState[cardKey].Even.amounts = item.result || "";
                }
              });
            }
          });
        }
        
        return updatedState;
      });
    } else {
      if (individual !== "ODDS") {
        // Map teamname.current to backend team name format based on bet type
        let backendTeamName = teamname.current;
        
        // For CONSECUTIVE bets, map to backend format
        if (individual === "CONSECUTIVE") {
          if (teamname.current === "Player A Consecutive") {
            backendTeamName = "Player A Consecutive";
          } else if (teamname.current === "Player B Consecutive") {
            backendTeamName = "Player B Consecutive";
          } else {
            // Fallback: extract from teamname
            const baseName = teamname.current.replace(" Consecutive", "");
            backendTeamName = baseName + " Consecutive";
          }
        }
        // For Card Odd/Even bets, extract "Odd" or "Even"
        else if (individual && individual.includes("_ODDEVEN")) {
          if (teamname.current.includes(" - Odd")) {
            backendTeamName = "Odd";
          } else if (teamname.current.includes(" - Even")) {
            backendTeamName = "Even";
          }
        }

        promises.push(
          getExBySingleTeamNameCasino(
            sportList.id,
            roundId,
            backendTeamName,
            match_id.toUpperCase(),
            individual
          )
        );

        const promises1 = await Promise.all(promises);
        
        // Extract base player name for updateTotalPlayersAmounts
        let basePlayerName = teamname.current;
        if (teamname.current.includes(" Main")) {
          basePlayerName = teamname.current.replace(" Main", "");
        } else if (teamname.current.includes(" Consecutive")) {
          basePlayerName = teamname.current.replace(" Consecutive", "");
        } else if (teamname.current.includes(" - ")) {
          // For card bets, keep the full team_name
          basePlayerName = teamname.current;
        }
        
        updateTotalPlayersAmounts(basePlayerName, individual, promises1[0].data);
      } else {
        // Use bulk call for ODDS (Main bets) - following Teen6 pattern but with bulk
        const betTypes = {
          "ODDS": ["Player A Main", "Player B Main"]
        };
        
        const bulkResult = await getExByTeamNamesAndBetTypesBulk(
          sportList.id,
          betTypes
        );
        
        // Process results - following Teen6's pattern
        if (bulkResult?.data?.["ODDS"]) {
          bulkResult.data["ODDS"].forEach((item) => {
            const teamName = item.nat?.trim();
            if (teamName === "Player A Main") {
              updateTotalPlayersAmounts("Player A", "ODDS", item.result || "");
            } else if (teamName === "Player B Main") {
              updateTotalPlayersAmounts("Player B", "ODDS", item.result || "");
            }
          });
        }
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

    
  }, [data?.sub]);

  useEffect(() => {
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
  }, [data?.card]);
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
    // Extract base player name from "Player A Main" or "Player A Consecutive"
    let basePlayerName = teamname.current;
    if (teamname.current.includes(" Main")) {
      basePlayerName = teamname.current.replace(" Main", "");
    } else if (teamname.current.includes(" Consecutive")) {
      basePlayerName = teamname.current.replace(" Consecutive", "");
    }

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
      totalPlayers: totalPlayers[basePlayerName],
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
                <div className={`casino-table-row ${totalPlayers["Player A"]?.[0]?.["Player A"]?.status === 'suspended-box' ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                  </div>
                  <div 
                    className="casino-odds-box back"
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player A Main",
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
                    className="casino-odds-box lay"
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player A Main",
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
                <div className={`casino-table-row ${totalPlayers["Player A"]?.[1]?.["Consecutive"]?.status === 'suspended-box' ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Consecutive</div>
                  </div>
                  <div 
                    className="casino-odds-box back"
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player A Consecutive",
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
                    className="casino-odds-box lay"
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player A Consecutive",
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
                <div className={`casino-table-row ${totalPlayers["Player B"]?.[0]?.["Player B"]?.status === 'suspended-box' ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                  </div>
                  <div 
                    className="casino-odds-box back"
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player B Main",
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
                    className="casino-odds-box lay"
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player B Main",
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
                <div className={`casino-table-row ${totalPlayers["Player B"]?.[1]?.["Consecutive"]?.status === 'suspended-box' ? 'suspended-row' : ''}`}>
                  <div className="casino-nation-detail">
                    <div className="casino-nation-name">Consecutive</div>
                  </div>
                  <div 
                    className="casino-odds-box back"
                    onClick={() =>
                      openPopup(
                        "back",
                        "Player B Consecutive",
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
                    className="casino-odds-box lay"
                    onClick={() =>
                      openPopup(
                        "lay",
                        "Player B Consecutive",
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

