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

const Card32 = () => {
  const { updateCardsForCard32Casino } = useContext(CasinoContext);

  const defaultValues = {
    odds: { back: 0, lay: 0 },
    status: "suspended-box",
    amounts: 0,
    cards: [],
    card_number: null,
  };

  const [totalPlayers, setTotalPlayers] = useState(
    Array.from({ length: 4 }, (_, index) => `Player ${index + 8}`).reduce(
      (accumulator, currentValue) => {
        return { ...accumulator, [currentValue]: defaultValues };
      },
      {}
    )
  );

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

<div className="rules-section">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Cards Deck</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>6(SPADE) 6(HEART) 6(CLUB) 6(DIAMOND)</td>
                                                            <td>6 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7(SPADE) 7(HEART) 7(CLUB) 7(DIAMOND)</td>
                                                            <td>7 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8(SPADE) 8(HEART) 8(CLUB) 8(DIAMOND)</td>
                                                            <td>8 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>9(SPADE) 9(HEART) 9(CLUB) 9(DIAMOND)</td>
                                                            <td>9 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>10(SPADE) 10(HEART) 10(CLUB) 10(DIAMOND)</td>
                                                            <td>10 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>J(SPADE) J(HEART) J(CLUB) J(DIAMOND)</td>
                                                            <td>11 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Q(SPADE) Q(HEART) Q(CLUB) Q(DIAMOND)</td>
                                                            <td>12 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>K(SPADE) K(HEART) K(CLUB) K(DIAMOND)</td>
                                                            <td>13 POINT</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul className="pl-4 pr-4 list-style">
                                                <li>This is a value card game &amp; Winning result will count on Highest cards total.</li>
                                                <li>There are total 4 players, every player have default prefix points. Default points will be consider as following table.</li>
                                            </ul>
                                            <h6 className="rules-highlight">Playing Game Rules:</h6>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div><b>PLAYER 8</b></div>
                                                                <div>8 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 9</b></div>
                                                                <div>9 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 10</b></div>
                                                                <div>10 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 11</b></div>
                                                                <div>11 Point</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul className="pl-4 pr-4 list-style">
                                                <li>In game, every player has to count sum of default points and their ownopened card's point.</li>
                                                <li>If in first level, the sum is same with more than one player, then thatwill be tie and winner tied players go for next level.</li>
                                                <li>This sum will go and go upto Single Player Highest Sum of Point.</li>
                                                <li>At last Highest Point Cards's Player declare as a Winner.</li>
                                            </ul>
                                        </div>
</div>`;
  const [roundId, setRoundId] = useState("");

  const roundIdSaved = useRef(null);

  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);

  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const {mybetModel} = useContext(CasinoContext);
  const { getBalance } = useContext(AuthContext);
  
  // Get user data from Redux instead of AuthContext
  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef([]);

  const [data, setData] = useState([]);
  const [playerStatuses, setPlayerStatuses] = useState({});

  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);
  const calculateTeamname = async () => {
    const updatedPlayers = { ...totalPlayers }; // Create a copy of the current state

    // Create an array of promises
    const promises = Object.keys(updatedPlayers).map(async (key) => {
      const d = await getExByTeamNameForCasino(
        sportList.id,
        roundId,
        key,
        match_id,
        "ODDS"
      );

      updatedPlayers[key] = {
        ...updatedPlayers[key],
        amounts: d.data || 0, // Update the amounts
      };
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Now that all promises are resolved, update the state
    setTotalPlayers(updatedPlayers); // Update the state with the new player data
  };

  useEffect(() => {
    remark.current = data?.remark || "Welcome";

    setBetType("ODDS");

    const updateOdds = () => {
      setTotalPlayers((prevState) => {
        // Create a new state object based on the previous state
        const updatedState = { ...prevState };

        data.sub.forEach((item) => {
          const playerName = item.nat; // Adjust as needed to match your data structure
          if (updatedState[playerName]) {
            updatedState[playerName] = {
              ...updatedState[playerName],
              odds: { back: item?.b || 0, lay: item?.l || 0 }, // Assuming `item.odds` holds the new odds value

              status: item.gstatus === "OPEN" ? "" : "suspended-box", // Update based on suspend status
            };

            // Update playerStatuses
            setPlayerStatuses((prev) => ({
              ...prev,
              [playerName]: item.gstatus === "OPEN" ? "" : "suspended-box",
            }));
          }
        });

        return updatedState; // Return the updated state
      });
    };

    if (data?.sub) {
      updateOdds();
    }
  }, [data]);

  useEffect(() => {
    if (data?.card) {
      updateCardsForCard32Casino(data, totalPlayers, setTotalPlayers);
    }
  }, [data?.card]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  useEffect(() => {
    if (data?.sub && sportList?.id) {
      calculateTeamname();
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

  // Helper function to find data in data.sub for Card32
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Card32, find the item by nat field
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
      match_id: "card32",
      roundIdSaved,
      totalPlayers: totalPlayers[teamname.current],
      playerStatuses: playerStatuses,
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
        calculateTeamname();
      },
    });

    return success;
  };

  const renderVideoBox = () => {
    return (
      <div className="casino-video-cards">
        {(() => {
          // Calculate the highest score among all players
          const scores = Object.values(totalPlayers)
            .filter((player) => player.card_number !== null)
            .map((player) => parseInt(player.card_number));
          const highestScore = Math.max(...scores);

          return Object.entries(totalPlayers).map(([key, value], index) => (
            <div key={key} className={index > 0 ? "mt-1" : ""}>
              {value.card_number !== null && (
                <>
                  <h5
                    className={
                      parseInt(value.card_number) === highestScore
                        ? "text-success"
                        : ""
                    }
                  >
                    {key}: <span className="text-warning">{value.card_number}</span>
                  </h5>
                  <div className="flip-card-container">
                    {value?.cards.map((v, l) => (
                      <div className="flip-card" key={l}>
                        <div className="flip-card-inner ">
                          <div className="flip-card-front">
                            <img src={v} alt={`${key} Card ${l + 1}`} />
                          </div>
                          <div className="flip-card-back">
                            <img src={v} alt={`${key} Card ${l + 1}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ));
        })()}
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
    raceClass="cards32a"
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
      <div className="casino-table">
        <div className="casino-table-box">
          <div className="casino-table-left-box">
            <div className="casino-table-header">
              <div className="casino-nation-detail"></div>
              <div className="casino-odds-box back">Back</div>
              <div className="casino-odds-box lay">Lay</div>
            </div>
            <div className="casino-table-body">
              {Object.entries(totalPlayers)
                .slice(0, 2)
                .map(([key, value], index) => (
                  <div className="casino-table-row" key={key}>
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">{key}</div>
                      <div className="casino- text-center">
                        <span className="text-success">
                          {getExByColor(value.amounts)}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`casino-odds-box back ${value.status}`}
                      onClick={() => openPopup("back", key, value.odds.back)}
                    >
                      <span className="casino-odds">{value.odds.back}</span>
                    </div>
                    <div
                      className={`casino-odds-box lay ${value.status}`}
                      onClick={() => openPopup("lay", key, value.odds.lay)}
                    >
                      <span className="casino-odds">{value.odds.lay}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="casino-table-box-divider"></div>
          <div className="casino-table-right-box">
            <div className="casino-table-header d-none d-md-flex">
              <div className="casino-nation-detail"></div>
              <div className="casino-odds-box back">Back</div>
              <div className="casino-odds-box lay">Lay</div>
            </div>
            <div className="casino-table-body">
              {Object.entries(totalPlayers)
                .slice(2, 4)
                .map(([key, value], index) => (
                  <div className="casino-table-row" key={key}>
                    <div className="casino-nation-detail">
                      <div className="casino-nation-name">{key}</div>
                      <div className="casino- text-center">
                        <span className="text-success">
                          {getExByColor(value.amounts)}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`casino-odds-box back ${value.status}`}
                      onClick={() => openPopup("back", key, value.odds.back)}
                    >
                      <span className="casino-odds">{value.odds.back}</span>
                    </div>
                    <div
                      className={`casino-odds-box lay ${value.status}`}
                      onClick={() => openPopup("lay", key, value.odds.lay)}
                    >
                      <span className="casino-odds">{value.odds.lay}</span>
                    </div>
                  </div>
                ))}
            </div>
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

export default Card32;
