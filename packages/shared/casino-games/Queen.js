import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
  getExByColor,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { AuthContext } from "../contexts/AuthContext";

import Notify from "../utils/Notify";
import { CasinoContext } from "../contexts/CasinoContext";

const Queen = () => {
  const [roundId, setRoundId] = useState("");

  const defaultValues = { odds: { back: 0, lay: 0 }, status: "", amounts: "" };

  const [totalPlayers, setTotalPlayers] = useState(
    Object.fromEntries(
      Array.from({ length: 4 }, (_, index) => {
        return ["Total " + index, defaultValues];
      })
    )
  );

  const roundIdSaved = useRef(null);

  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [cards, setCards] = useState({});

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);

  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } = useContext(SportsContext);
  const { getCardTotalCard32, mybetModel } = useContext(CasinoContext);
  
  // Get user data from Redux instead of AuthContext

  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["Player A", "Player B"]);

  const [data, setData] = useState([]);
  const [playerA, setPlayerA] = useState(0); // Example player A value
  const [playerStatuses, setPlayerStatuses] = useState({
    "Player A": "",
    "Player B": "",
  });
  const [playerA_Back, setPlayerA_Back] = useState(0);
  const [playerB_Back, setPlayerB_Back] = useState(0);
  const [playerA_Lay, setPlayerA_Lay] = useState(0);
  const [playerB, setPlayerB] = useState(0); // Example player B value

  const [playerB_Lay, setPlayerB_Lay] = useState(0);
     const remark = useRef(null);
   
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  useEffect(() => {
    setBetType("BOOKMAKER");

    if (data?.sub) {
      setTotalPlayers((prevState) => {
        const updState = { ...prevState };
        Object.entries(prevState).map(([index, value]) => {
          const datafound = data.sub.find((item) => item.nat === index);
          updState[index] = {
            ...value, // Copy existing properties
            odds: {
              ...value.odds, // Copy existing odds structure
              back: datafound.b || 0,
              lay: datafound.l || 0,
            },
            status: datafound.gstatus === "OPEN" ? "" : "suspended-box",
          };

          // Update playerStatuses
          setPlayerStatuses((prev) => ({
            ...prev,
            [index]: datafound.gstatus === "OPEN" ? "" : "suspended-box",
          }));
        });

        return updState;
      });
    }
  }, [data?.sub]);

  useEffect(() => {
    if (data.card) {
      let total0count = "",
        total1count = "",
        total2count = "",
        total3count = "";
      const cardArray = data.card.split(",").map((item) => item.trim());
      const totalA = cardArray.map((card, i) => {
        if (i % 4 === 0) {
          return card !== "1" ? card : null;
        }
      });

      const ctotalA = totalA.filter(
        (item) => item !== null && item !== undefined
      );

      if (ctotalA.length > 0) {
        total0count = getCardTotalCard32(ctotalA, 0);
      }

      const totalB = cardArray.map((card, i) => {
        if (i % 4 === 1) {
          if (card !== "1") {
            total1count = renderCards(cardArray, card);
          }
          return card !== "1" ? card : null;
        }
      });

      const totalC = cardArray.map((card, i) => {
        if (i % 4 === 2) {
          if (card !== "1") {
            total2count = renderCards(cardArray, card);
          }
          return card !== "1" ? card : null;
        }
      });

      const totalD = cardArray.map((card, i) => {
        if (i % 4 === 3) {
          if (card !== "1") {
            total3count = renderCards(cardArray, card);
          }
          return card !== "1" ? card : null;
        }
      });

      const ctotalB = totalB.filter(
        (item) => item !== null && item !== undefined
      );

      if (ctotalB.length > 0) {
        total1count = getCardTotalCard32(ctotalB, 1);
      }

      const ctotalC = totalC.filter(
        (item) => item !== null && item !== undefined
      );

      if (ctotalC.length > 0) {
        total2count = getCardTotalCard32(ctotalC, 2);
      }
      const ctotalD = totalD.filter(
        (item) => item !== null && item !== undefined
      );

      if (ctotalD.length > 0) {
        total3count = getCardTotalCard32(ctotalD, 3);
      }

      setCards({
        total0: totalA,
        total0count: total0count,
        total1: totalB,
        total1count: total1count,
        total2: totalC,
        total2count: total2count,
        total3: totalD,
        total3count: total3count,
      });
             
       
    }
  }, [data?.card]);

  useEffect(() => {
    if (data?.remark) {
      remark.current = data.remark;
    }
  }, [data?.remark]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  const updateAmounts = async () => {
    const result = [
      getExByTeamNameForCasino(
        sportList.id,
        roundId,
        "Total 0",
        match_id,
        "ODDS"
      ),

      getExByTeamNameForCasino(
        sportList.id,
        roundId,
        "Total 1",
        match_id,
        "ODDS"
      ),
      getExByTeamNameForCasino(
        sportList.id,
        roundId,
        "Total 2",
        match_id,
        "ODDS"
      ),
      getExByTeamNameForCasino(
        sportList.id,
        roundId,
        "Total 3",
        match_id,
        "ODDS"
      ),
    ];

    const promise = await Promise.all(result);

    setTotalPlayers((prevState) => {
      const pr = { ...prevState };
      pr["Total 0"] = {
        ...pr["Total 0"],
        amounts: promise[0]?.data || "",
      };
      pr["Total 1"] = {
        ...pr["Total 1"],
        amounts: promise[1]?.data || "",
      };
      pr["Total 2"] = {
        ...pr["Total 2"],
        amounts: promise[2]?.data || "",
      };
      pr["Total 3"] = {
        ...pr["Total 3"],
        amounts: promise[3]?.data || "",
      };

      return pr;
    });
  };

  useEffect(() => {
    if (data?.sub && sportList?.id) {
      updateAmounts();
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

  // Helper function to find data in data.sub for Queen
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Queen, find the item by nat field
    return data.sub.find(item => item.nat === teamName);
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

  const renderCards = (cards, player) => {
    return cards?.map((card, index) => {
      if (card !== "1" && card) {
        const imgSrc = `/img/casino/cards/${card}.png`;
        return (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
              </div>
              <div className="flip-card-back">
                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
              </div>
            </div>
          </div>
        );
      }
    });
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
      betType: "ODDS",
      stakeValue,
      match_id,
      roundIdSaved,
      totalPlayers,
      playerStatuses: playerStatuses[teamname.current],
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
        //  is already handled by placeCasinoBet
      },
    });

    return success;
  };

  const getHighestTotalCount = () => {
    if (!cards) return [];

    const totals = [
      { key: "total0count", value: parseInt(cards.total0count) || 0 },
      { key: "total1count", value: parseInt(cards.total1count) || 0 },
      { key: "total2count", value: parseInt(cards.total2count) || 0 },
      { key: "total3count", value: parseInt(cards.total3count) || 0 },
    ];

    const maxValue = Math.max(...totals.map((t) => t.value));
    return totals.filter((t) => t.value === maxValue).map((t) => t.key);
  };

  const renderVideoBox = () => {
    const highestTotal = getHighestTotalCount();

    return (
      <div className="casino-video-cards">
        <div>
          {cards && cards.total0count && cards?.total0count !== "" && (
            <>
              <h5
                className={
                  highestTotal.includes("total0count")
                    ? "text-success"
                    : ""
                }
              >
                Total 0: <span className="text-warning">{cards?.total0count}</span>
              </h5>
              <div className="flip-card-container">
                {renderCards(cards.total0, "total0")}
              </div>
            </>
          )}
        </div>
        <div className="mt-1">
          {cards && cards.total1count && cards?.total1count !== "" && (
            <>
              <h5
                className={
                  highestTotal.includes("total1count")
                    ? "text-success"
                    : ""
                }
              >
                Total 1: <span className="text-warning">{cards?.total1count}</span>
              </h5>
              <div className="flip-card-container">
                {renderCards(cards.total1, "total1")}
              </div>
            </>
          )}
        </div>
        <div className="mt-1">
          {cards && cards.total2count && cards?.total2count !== "" && (
            <>
              <h5
                className={
                  highestTotal.includes("total2count")
                    ? "text-success"
                    : ""
                }
              >
                Total 2: <span className="text-warning">{cards?.total2count}</span>
              </h5>
              <div className="flip-card-container">
                {renderCards(cards.total2, "total2")}
              </div>
            </>
          )}
        </div>
        <div className="mt-1">
          {cards && cards.total3count && cards?.total3count !== "" && (
            <>
              <h5
                className={
                  highestTotal.includes("total3count")
                    ? "text-success"
                    : ""
                }
              >
                Total 3: <span className="text-warning">{cards?.total3count}</span>
              </h5>
              <div className="flip-card-container">
                {renderCards(cards.total3, "total3")}
              </div>
            </>
          )}
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
      hideRules={true}
      raceClass="queen"
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
            {Object.entries(totalPlayers).map(([index, value], i) => (
              <div className="casino-odd-box-container" key={i}>
                <div className="casino-nation-name">{index}</div>
                <div 
                  className={`casino-odds-box back ${value?.status}`}
                  onClick={() => openPopup("back", index, value.odds.back)}
                >
                  <span className="casino-odds">{value.odds.back}</span>
                </div>
                <div 
                  className={`casino-odds-box lay ${value?.status}`}
                  onClick={() => openPopup("lay", index, value.odds.lay)}
                >
                  <span className="casino-odds">{value.odds.lay}</span>
                </div>
                <div className="casino-">
                  {getExByColor(value.amounts)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="casino-remark mt-1">
          <marquee scrollamount="3">{remark.current}</marquee>
        </div>
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
}) => (
  <div className="casino-table-left-box">
    <div className="casino-table-header">
      <div className="casino-nation-detail">{playerName}</div>
      <div className="casino-odds-box back">Back</div>
      <div className="casino-odds-box lay">Lay</div>
    </div>
    <div className={`casino-table-body`}>
      <div className={`casino-table-row ${playerStatus}`}>
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
        <div className="casino-odds-box back">
          <span
            className="casino-odds"
            onClick={() => openPopup("back", playerName, playerBack)}
          >
            {playerBack}
          </span>
        </div>
        <div className="casino-odds-box lay">
          <span
            className="casino-odds"
            onClick={() => openPopup("lay", playerName, playerLay)}
          >
            {playerLay}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Queen;
