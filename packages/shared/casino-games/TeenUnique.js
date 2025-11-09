import React, { useState, useEffect, useRef, useContext } from "react";
import CasinoLayout from "../components/casino/CasinoLayout";
import axiosFetch, {
  getExBySingleTeamNameCasino,
  getPlayerCardAccordingToNumberOfPlayers,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";
import { AuthContext } from "../contexts/AuthContext";
import Notify from "../utils/Notify";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import MatchedBetTable from "../components/casino/MatchedBetTable";

const TeenUnique = () => {
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
	<p>Welcome to Unique Teenpatti, a new variation of Teenpatti.</p>
	<p>We are excited to introduce you to a new variation of Teenpatti game <b>Unique Teenpatti.</b> The game follows the same standard rules of Teenpatti but at the beginning of the round the player has a chance to select their own three cards from six cards on the table. Once a player selects their three cards from six cards on the table, the other three cards belong to the opponent player. After card selection is done, the dealer will deal six cards on the table to decide the winner. Good Luck and wind BIG!!!.</p>
	<h4>Standard Rules:</h4>
	<div>
		<img src="https://sitethemedata.com/v3/static/front/img/casino-rules/teen6.jpg" class="img-fluid">
	</div>
</div></div>`;

  const [roundId, setRoundId] = useState("");
  const roundIdSaved = useRef(null);
  const remark = useRef("Welcome");
  const teamname = useRef([]);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [lastResult, setLastResult] = useState({});
  const [mybetModel, setMybetModel] = useState([]);

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);
  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const {
    setShowMobilePopup,
    selectedTeenUniqueCards,
    setSelectedTeenUniqueCards,
    availableTeenUniqueCards,
    setAvailableTeenUniqueCards,
  } = useContext(CasinoContext);
  const { getBalance } = useContext(AuthContext);
  // Get user data from Redux instead of AuthContext
  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["Player A", "Player B"]);
  const [data, setData] = useState([]);

  const [playerAmounts, setPlayerAmounts] = useState({
    "Tiger Winner": "",
    "Tiger Pair": "",
    "Tiger Flush": "",
    "Tiger Straight": "",
    "Tiger Trio": "",
    "Tiger Straight Flush": "",
    "Dragon Winner": "",
    "Dragon Pair": "",
    "Dragon Flush": "",
    "Dragon Straight": "",
    "Dragon Trio": "",
    "Dragon Straight Flush": "",
    "Lion Winner": "",
    "Lion Pair": "",
    "Lion Flush": "",
    "Lion Straight": "",
    "Lion Trio": "",
    "Lion Straight Flush": "",
  });

  useEffect(() => {
    setShowMobilePopup(false);
  }, []);

  // Fetch matched bet data
  useEffect(() => {
    if (sportList?.id) {
      axiosFetch("matched-bet-details/" + sportList.id, "get", setMybetModel);
    }
  }, [sportList?.id, exposureCheck]);

  const [playerStatus, setPlayerStatus] = useState("suspended");

  // Card selection state

  const [cardSelectionError, setCardSelectionError] = useState("");

  // Dynamic cards from API response

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  useEffect(() => {
    const getPlayerNameSuffix = (playerName) => {
      if (playerName.includes("Winner")) {
        return "WINNER"; // Default to Winner if 'Winner' is not in playerName
      } else if (playerName.includes("Tiger")) {
        return "OTHER_T"; // If it contains Tiger, use 'other_t'
      } else if (playerName.includes("Dragon")) {
        return "OTHER_D"; // If it contains Dragon, use 'other_d'
      } else if (playerName.includes("Lion")) {
        return "OTHER_L"; // If it contains Lion, use 'other_l'
      }
      return "Winner"; // Fallback to Winner
    };
    if (data?.sub && sportList?.id) {
      const keys = Object.keys(playerAmounts); // Get the keys (player names) from playerAmounts

      keys.forEach((playerName) => {
        getExBySingleTeamNameCasino(
          sportList.id,
          data.mid,
          playerName,
          match_id,
          getPlayerNameSuffix(playerName)
        )
          .then((res) => {
            // Update playerAmounts based on the response
            setPlayerAmounts((prev) => ({
              ...prev,
              [playerName]: res.data, // Assuming the amount is in the response
            }));
          })
          .catch((error) => {
            console.error(`Error fetching data for ${playerName}:`, error);
          });
      });
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);
  const placeBet = async () => {
    // Validate card selection before placing bet

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
      match_id: "teenunique",
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
      selectedTeenUniqueCards: selectedTeenUniqueCards, // Include selected cards in bet data
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
        setSelectedTeenUniqueCards([]);
        //  is already handled by placeCasinoBet
      },
    });

    return success;
  };
  // Function to process dynamic card data from API
  const processCardData = (cardString) => {
    if (!cardString) return [];

    // Split the card string by comma and process each card
    const cardArray = cardString.split(",").map((card, index) => {
      // For now, we'll use the same icon pattern but with dynamic card data
      // You can modify this based on your card mapping logic
      const cardNumber = card;

      return {
        id: cardNumber,
        cardValue: card.trim(),
        key: index + 1,
        icon: `/img/sequence/s${index + 1}-icon.png`,
        image: `/img/casino/cards/${cardNumber}.png`, // You might want to map this to actual card images
      };
    });

    return cardArray;
  };

  useEffect(() => {
    if (data?.sub) {
      // For teenunique, all players are active by default since API doesn't provide individual status
      setPlayerStatus(data.sub[0].gstatus == "OPEN" ? "" : "suspended");
    }
  }, [data?.sub]);

  useEffect(() => {
    if (data?.card) {
      const processedCards = processCardData(data.card);

      setAvailableTeenUniqueCards(processedCards);
    }
  }, [data?.card]);

  // Card selection    functions
  const handleCardSelection = (cardId) => {
    setCardSelectionError("");

    if (selectedTeenUniqueCards.length === 3) {
      return;
    }
    const selectedCard = availableTeenUniqueCards.find(
      (card, key) => key + 1 === cardId
    );

    if (selectedTeenUniqueCards.includes(cardId)) {
      // Remove card if already selected
      setSelectedTeenUniqueCards((prev) => prev.filter((id) => id !== cardId));
      // Remove from teamname array
      if (selectedCard) {
        teamname.current = (teamname.current || []).filter(
          (cardValue) => cardValue !== selectedCard.key
        );
      }
    } else {
      // Add card if less than 3 selected
      if (selectedTeenUniqueCards.length < 3) {
        setSelectedTeenUniqueCards((prev) => [...prev, cardId]);
        // Add to teamname array and ensure uniqueness
        if (selectedCard) {
          const currentTeamname = teamname.current || [];
          if (!currentTeamname.includes(selectedCard.key)) {
            teamname.current = [...currentTeamname, selectedCard.key];
          }
        }
      } else {
        // If 3 cards already selected, replace the first one with the new one
        setSelectedTeenUniqueCards((prev) => [prev[1], prev[2], cardId]);
        if (selectedCard) {
          const currentTeamname = teamname.current || [];
          if (!currentTeamname.includes(selectedCard.key)) {
            teamname.current = [
              currentTeamname[1],
              currentTeamname[2],
              selectedCard.key,
            ];
          }
        }
      }
    }

    // Open popup immediately when any card is selected
    if (selectedCard) {
      // Set odds from API response (data.sub[0].b)
      const apiOdds = data?.sub?.[0]?.b || 1.95;
      setOdds(apiOdds);
      // Open popup
      setPopupDisplayForDesktop(true);
    }
  };

  const isCardSelected = (cardId) => {
    return selectedTeenUniqueCards.includes(cardId);
  };

  const openPopup = (isBakOrLay, teamnam, oddvalue, winnerName, playerName) => {
    // No longer require exactly 3 cards - allow betting with any selected cards
    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      // teamnam is already an array from teamname.current
      teamname.current = teamnam;
      setOdds(oddvalue);
    } else {
      Notify("Odds Should Not Be Zero", null, null, "danger");
    }
  };

  // Ensure teamname.current is always exactly 3 unique items
  useEffect(() => {
    if (selectedTeenUniqueCards.length > 0) {
      const currentTeamname = teamname.current || [];
      const uniqueTeamname = [...new Set(currentTeamname)]; // Remove duplicates

      if (uniqueTeamname.length !== 3 && selectedTeenUniqueCards.length === 3) {
        // If we have 3 selected cards but teamname doesn't have 3 unique values,
        // sync it with the selected cards
        const selectedCardKeys = selectedTeenUniqueCards
          .map((cardId) => {
            const card = availableTeenUniqueCards.find(
              (card, key) => key + 1 === cardId
            );
            return card ? card.key : null;
          })
          .filter(Boolean);

        teamname.current = [...new Set(selectedCardKeys)].slice(0, 3);
      } else if (uniqueTeamname.length > 3) {
        // If more than 3, keep only the first 3
        teamname.current = uniqueTeamname.slice(0, 3);
      }
    }
  }, [selectedTeenUniqueCards, availableTeenUniqueCards]);

  useEffect(() => {
    if (selectedTeenUniqueCards.length === 3) {
      openPopup(backOrLay, teamname.current, odds, "", "");
    }
  }, [selectedTeenUniqueCards]);

  // Helper function to find data in data.sub for TeenUnique
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For TeenUnique, return the first sub item since it contains the odds and limits
    return data.sub[0];
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

  const renderCardSelection = () => {
    return (
      <div className="casino-table">
        <h4 className="unique-teen-title">
          Select any 3 cards of your choice and experience TeenPatti in a unique
          way.
          <i className="fas fa-hand-point-down ms-1"></i>
        </h4>
        <div className={`unique-teen20-box ${playerStatus}`}>
          {availableTeenUniqueCards.map((card, key) => (
            <div
              key={key + 1}
              className={`unique-teen20-card`}
              onClick={() => handleCardSelection(key + 1)}
            >
              <img src={card.icon} alt={`Card ${card.id} icon`} />
              <img
                className={
                  isCardSelected(key + 1) && playerStatus !== "suspended"
                    ? "select"
                    : ""
                }
                src={
                  playerStatus === "suspended" &&
                  card.image == "/img/casino/cards/1.png"
                    ? "/img/sequence/0.png"
                    : card.image
                }
                alt={`Card ${card.id}`}
              />
            </div>
          ))}
          <div className="unique-teen20-place-balls d-xl-none">
            <div>
              {selectedTeenUniqueCards.length > 0 ? (
                selectedTeenUniqueCards.map((cardId, index) => {
                  const selectedCard = availableTeenUniqueCards.find(
                    (card, key) => key + 1 === cardId
                  );
                  return selectedCard ? (
                    <img
                      key={index}
                      src={`/img/sequence/s${index + 1}.png`}
                      alt={`Selected card ${index + 1}`}
                    />
                  ) : null;
                })
              ) : (
                <>
                  <div className="empty-card-slot"></div>
                  <div className="empty-card-slot"></div>
                  <div className="empty-card-slot"></div>
                </>
              )}
            </div>
            {selectedTeenUniqueCards.length > 0 && (
              <div>
                <button className="btn btn-danger btn-sm me-1">Clear</button>
                <button
                  disabled={selectedTeenUniqueCards.length < 3}
                  onClick={() => setShowMobilePopup(true)}
                  className="btn btn-success btn-sm"
                >
                  Placebet
                </button>
              </div>
            )}
          </div>
        </div>
        {cardSelectionError && (
          <div className="card-selection-error text-danger mt-2">
            {cardSelectionError}
          </div>
        )}
      </div>
    );
  };

  // Function to get current min/max limits for the active bet
  const getMinMaxLimits = () => {
    if (
      teamname.current &&
      Array.isArray(teamname.current) &&
      teamname.current.length > 0
    ) {
      const foundData = findDataInSub(teamname.current, betType);
      if (foundData) {
        return {
          min: foundData.min || 100,
          max: foundData.max || 100000,
        };
      }
    }
    return { min: 100, max: 100000 }; // Default fallback
  };

  return (
    <CasinoLayout
      raceClass="unique-teen20"
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
    >
      <div className="casino-detail">
        {/* Card Selection UI */}
        {renderCardSelection()}

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

        {/* Matched Bet Table */}
        <div className="sidebar-box my-bet-container">
            {mybetModel.length > 0 && (
          <div className="my-bets">
            <MatchedBetTable 
              mybetModel={mybetModel} 
              type="teenunique" 
                availableCards={availableTeenUniqueCards}
              />
            </div>
          )}
        </div>
      </div>

      
    </CasinoLayout>
  );
};

export default TeenUnique;
