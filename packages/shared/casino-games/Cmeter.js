import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
  getExByColor,
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  cardMap,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { AuthContext } from "../contexts/AuthContext";
import { CasinoContext } from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Cmeter = () => {
  const [roundId, setRoundId] = useState("");
  const [totalPlayers, setTotalPlayers] = useState({
    Low: { odds: "", status: "suspended-box", amounts: "" },
    High: { odds: "", status: "suspended-box", amounts: "" },
  });

  const roundIdSaved = useRef(null);

  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [cards, setCards] = useState([]);
  const [lowCards, setLowCards] = useState([]);
  const [highCards, setHighCards] = useState([]);
  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);
  const [lowValue, setLowValue] = useState(0);
  const [highValue, setHighValue] = useState(0);
  const [runPosition, setRunPosition] = useState(0);
  const [runPositionType, setRunPositionType] = useState(""); // 'Low' or 'High'
  const [lastBetType, setLastBetType] = useState(""); // Track last bet type

  const [showSsCard, setShowSsCard] = useState("");

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);

  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
    const { betType, setBetType, setPopupDisplayForDesktop } =
        useContext(SportsContext);
    const { mybetModel } = useContext(CasinoContext);
    const { getBalance } = useContext(AuthContext);
    
    // Get user data from Redux instead of AuthContext
  const [hideLoading, setHideLoading] = useState(true);

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
    <div>
        <img src="/img/rules/cmeter.jpg" class="img-fluid">
    </div>
</div><div><div class="rules-section">
    <h6 class="rules-highlight">Low Zone:</h6>
    <ul class="pl-4 pr-4 list-style">
        <li>The Player who bet on Low Zone will have all cards from Ace to 8 of all suits 3 cards of 9, Heart , Club &amp; Diamond.</li>
    </ul>
    <h6 class="rules-highlight">High Zone:</h6>
    <ul class="pl-4 pr-4 list-style">
        <li>The Player who bet on high Zone will have all the cards of JQK of all suits plus 3 cards of 10, Heart, Club &amp; Diamond.</li>
    </ul>
    <h6 class="rules-highlight">Spade 9 &amp; Spade 10:</h6>
    <ul class="pl-4 pr-4 list-style">
        <li>If you Bet on Low Card, Spade of 9 &amp; 10 will calculated along with High Cards.</li>
        <li>If you Bet on High Card, Spade of 9 &amp; 10 will calculated along with Low Cards.</li>
    </ul>
</div></div></div>`;

  const teamNames = useRef(["Low", "High"]);

  const [data, setData] = useState([]);
  const [playerStatuses, setPlayerStatuses] = useState({});

  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  // Card classification: Low = Odd numbers + A, High = Even numbers + J, Q, K

  useEffect(() => {
    if (betType !== "LOWHIGH") {
      setBetType("LOWHIGH");
    }

    if (data?.sub) {
      setTotalPlayers((prevState) => {
        const prev = { ...prevState };

        // Find Low and High entries in sub array
        const lowEntry = data.sub.find((item) => item.nat === "Low");
        const highEntry = data.sub.find((item) => item.nat === "High");

        if (lowEntry) {
          prev["Low"].status =
            lowEntry.gstatus === "OPEN" ? "" : "suspended-box";
          prev["Low"].odds = lowEntry.b;
        }

        if (highEntry) {
          prev["High"].status =
            highEntry.gstatus === "OPEN" ? "" : "suspended-box";
          prev["High"].odds = highEntry.b;
        }

        // Update playerStatuses
        setPlayerStatuses((prev) => ({
          ...prev,
          Low: lowEntry?.gstatus === "OPEN" ? "" : "suspended-box",
          High: highEntry?.gstatus === "OPEN" ? "" : "suspended-box",
        }));

        return prev;
      });
    }
  }, [data?.sub]);

  useEffect(() => {
    if (data.card) {
      const cardArray = data.card.split(",").map((item) => item.trim());
      setCards(cardArray);
      remark.current = data.remark || "Welcome";

      // Reset run position and bet type when new cards are dealt
      
      

      // Process cards for Low/High display
      processCardsForDisplay(cardArray);
    }
  }, [data.card]);

  // Helper function to get card value and check if it's low/high
  const getCardInfo = (card) => {
    // Extract just the value part for classification
    const cardValue = card.replace(/[HSCD]+$/, ""); // Remove suit letters for classification
    const numericValue = parseInt(cardValue);

    if (numericValue === 1) return null; // Ignore cards with value "1"

    const cardCountValue =
      cardValue === "A"
        ? 1
        : cardValue === "J"
        ? 11
        : cardValue === "Q"
        ? 12
        : cardValue === "K"
        ? 13
        : numericValue;

    // Check if card value is Low (1-9) or High (10, J, Q, K)
    const isLow = cardValue === "A" || (numericValue >= 1 && numericValue <= 9); // A and 1-9 are Low

    const isHigh =
      cardValue === "J" ||
      cardValue === "Q" ||
      cardValue === "K" ||
      numericValue === 10; // 10, J, Q, K are High

    return { cardValue: card, cardCountValue, isLow, isHigh }; // Return full card name with suit
  };

  const processCardsForDisplay = (cardArray) => {
    const lowCardsList = [];
    const highCardsList = [];
    let lowTotalValue = 0;
    let highTotalValue = 0;

    cardArray.forEach((card) => {
      const cardInfo = getCardInfo(card);
      if (!cardInfo) return; // Skip ignored cards

      if (cardInfo.isLow) {
        lowCardsList.push(cardInfo.cardValue);
        lowTotalValue += cardInfo.cardCountValue;
      } else if (cardInfo.isHigh) {
        highCardsList.push(cardInfo.cardValue);
        highTotalValue += cardInfo.cardCountValue;
      }
    });

    setLowCards(lowCardsList);
    setHighCards(highCardsList);
    setLowCount(lowCardsList.length);
    setHighCount(highCardsList.length);
    setLowValue(lowTotalValue);
    setHighValue(highTotalValue);

    if(lastBetType === "Low"){
      setRunPosition(lowTotalValue - highTotalValue);
    }else if(lastBetType === "High"){
      setRunPosition(highTotalValue - lowTotalValue);
    }
  };

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  const updateAmounts = async () => {
    const results = [
      await getExBySingleTeamNameCasino(
        sportList.id,
        roundId,
        "LOW",
        match_id,
        betType
      ),
      await getExBySingleTeamNameCasino(
        sportList.id,
        roundId,
        "HIGH",
        match_id,
        betType
      ),
    ];

    setTotalPlayers((prevState) => {
      const prev = { ...prevState };

      if(results[1]?.data){
        calculateRunPosition("High");
        setLastBetType("High");
        setShowSsCard("High");
      }
      if(results[0]?.data){
        calculateRunPosition("Low");
        setLastBetType("Low");
        setShowSsCard("Low");
      }


      prev["Low"].amounts = results[0]?.data || "";
      prev["High"].amounts = results[1]?.data || "";

      return prev;
    });
  };

  useEffect(() => {
    if (data?.sub && sportList?.id) {
      updateAmounts();
    }
    if(parseFloat(exposure) === 0){
      setRunPosition(0);
      setShowSsCard("");
      setLastBetType("");
      setRunPositionType("");
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const openPopup = (isBakOrLay, teamnam, oddvalue) => {

    setShowSsCard(teamnam);
    if(lastBetType !== "" && teamnam !== lastBetType){
      return
    }
    

    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
       // Track which bet type was triggered
    } else {
      Notify("Odds Value Change Bet Not Confirm", null, null, "danger");
    }
  };

  // Helper function to find data in data.sub for Cmeter
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;
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

  const calculateRunPosition = (betType) => {
    // Calculate run position based on current card values
    if (betType === "Low") {
      setRunPosition(lowValue - highValue);
      setRunPositionType("Low");
    } else if (betType === "High") {
      setRunPosition(highValue - lowValue);
      setRunPositionType("High");
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
      totalPlayers: totalPlayers[teamname.current],
      playerStatuses: playerStatuses,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts,
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
        setLastBetType(teamname.current);
      },
    });

    return success;
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
    return { min: 100, max: 100000 }; // Default fallback
  };

  const renderCardImage = (cardValue, type = null) => {
    return type === "casino_cards"
      ? `/img/casino/cards/${cardValue}.png`
      : `/img/card/${cardValue}.jpg`;
  };

  return (
    <CasinoLayout
      ruleDescription={ruleDescription}
      raceClass="cmeter"
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
      <div className="casino-table">
        <div className="casino-table-full-box">
          {cards.some((card) => card !== "1") && (
            <div className="cmeter-video-cards-box">
              <div className="cmeter-low">
                <div>
                  <span className="text-fancy">Low</span>
                  <span className="ms-2 text-success">
                    <b> {lowValue}</b>
                  </span>
                </div>
                <div className="cmeter-low-cards">
                  {lowCards
                    .filter((card) => card !== "1")
                    .map((card, index) => (
                      <img
                        key={index}
                        src={renderCardImage(card, "casino_cards")}
                        alt={`Low card ${card}`}
                      />
                    ))}
                  {runPositionType === "Low" && (
                    <span className="ms-2">
                      Run Position :
                      <b className={runPosition >= 0 ? "text-white" : "text-danger"}>{runPosition}</b>
                    </span>
                  )}
                </div>
              </div>
              <div className="cmeter-high">
                <div>
                  <span className="text-fancy">High</span>
                  <span className="ms-2 text-success">
                    <b> {highValue}</b>
                  </span>
                </div>
                <div className="cmeter-high-cards">
                  {highCards
                    .filter((card) => card !== "1")
                    .map((card, index) => (
                      <img
                        key={index}
                        src={renderCardImage(card, "casino_cards")}
                        alt={`High card ${card}`}
                      />
                    ))}
                  {runPositionType === "High" && (
                    <span className="ms-2">
                      Run Position :
                      <b className={runPosition >= 0 ? "text-white" : "text-danger"}>{runPosition}</b>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="casino-table-box mt-3">
          <div className={`casino-table-left-box ${totalPlayers.Low.status}`}>
            <div className="text-center">
              <b className="text-info">Low</b>
              {showSsCard === "High" && (
                <div className="card-odd-box ms-2 d-inline-block">
                  <div className="">
                    <img src="/img/casino/cards/10SS.png" alt="10SS" />
                  </div>
                </div>
              )}
            </div>
            <div
              className="cmeter-card-box mt-2"
              onClick={() => openPopup("back", "Low", totalPlayers.Low.odds)}
            >
              {["A", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                (card, index) => (
                  <div key={index} className="card-odd-box">
                    <div className="">
                      <img src={renderCardImage(card)} alt={card} />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="casino-nation-book text-center mt-2">
              <div className="text-center book-green">
                <b>
                  <span className="">
                    {getExByColor(totalPlayers.Low.amounts)}
                  </span>
                </b>
              </div>
            </div>
          </div>

          <div className={`casino-table-right-box ${totalPlayers.High.status}`}>
            <div className="text-center">
              <b className="text-info">High</b>
              {showSsCard === "Low" && (
                <div className="card-odd-box ms-2 d-inline-block">
                  <div className="">
                    <img src="/img/casino/cards/9SS.png" alt="9SS" />
                  </div>
                </div>
              )}
            </div>
            <div
              className="cmeter-card-box mt-2"
              onClick={() => openPopup("back", "High", totalPlayers.High.odds)}
            >
              {["10", "J", "Q", "K"].map((card, index) => (
                <div key={index} className="card-odd-box">
                  <div className="">
                    <img src={renderCardImage(card)} alt={card} />
                  </div>
                </div>
              ))}
            </div>
            <div className="casino-nation-book text-center mt-2">
              <div className="text-center book-green">
                <b>
                  <span className="">
                    {getExByColor(totalPlayers.High.amounts)}
                  </span>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <marquee scrollamount="3" className="casino-remark m-b-10">
        {remark.current}
      </marquee>
      <div className="casino-last-result-title">
        <span>Last Result</span>
        <span>
          <a href="/casino-results/cmeter">View All</a>
        </span>
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

export default Cmeter;
