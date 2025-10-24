import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
  classifyCard,
  getExByColor,
  getExBySingleTeamNameCasino,
  resetBetFields,
  placeCasinoBet,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teen8 = () => {
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
  const [oddsData, setOddsData] = useState({
    "Player 1": 1.98,
    "Player 2": 1.98,
    "Player 3": 1.98,
    "Player 4": 1.98,
    "Player 5": 1.98,
    "Player 6": 1.98,
    "Player 7": 1.98,
    "Player 8": 1.98,
  });

  const [data, setData] = useState([]);

  const [playerStatuses, setPlayerStatuses] = useState({
    "Player 1": "suspended-box",
    "Player 2": "suspended-box",
    "Player 3": "suspended-box",
    "Player 4": "suspended-box",
    "Player 5": "suspended-box",
    "Player 6": "suspended-box",
    "Player 7": "suspended-box",
    "Player 8": "suspended-box",
  });

  const ruleImage = "/img/rules/teen.jpg";

  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  useEffect(() => {
    if (data?.sub) {
      let card = data.card.split(",");

      setCards(card);
    }
  }, [data?.sub]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;

  // Helper function to iterate through players
  const forEachPlayer = (callback) => {
    Object.keys(playerStatuses).forEach((team, index) => {
      callback(team, index);
    });
  };

  // Update player stats whenever data.sub changes
  useEffect(() => {
    if (data?.sub) {
      forEachPlayer((team, index) => {
        updatePlayerStats(data.sub[index], team);
      });
    }
  }, [data?.sub]);

  // Update exposure amounts only when exposure, sportLength, or roundId changes
  useEffect(() => {
    if (data?.sub && sportList?.id) {
      forEachPlayer((team, index) => {
        getExBySingleTeamNameCasino(
          sportList.id,
          data.mid,
          team,
          match_id,
          "ODDS"
        )
          .then((res) => {
            // Update playerAmounts based on the response
            setPlayerAmounts((prev) => ({
              ...prev,
              [team]: res.data, // Assuming the amount is in the response
            }));
          })
          .catch((error) => {
            console.error(`Error fetching data for ${team}:`, error);
          });
      });
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const updatePlayerStats = (playerData, playerName) => {
    if (!playerData) return;
    let playerStatus =
      playerData.gstatus === "SUSPENDED" ? "suspended-box" : "";
    setPlayerStatuses((prev) => ({ ...prev, [playerName]: playerStatus }));
  };
  const openPopup = (isBakOrLay, teamnam, oddvalue) => {
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

      loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(
        2
      );
    }
  };

  const renderCards = (playerNumber) => {
    if (Object.keys(cards).length > 0) {
      return cards.map((cardObj, index) => {
        cardObj = classifyCard(cardObj);

        if (index % 9 === playerNumber - 1 && cardObj.card_no) {
          const { card_no, card_icon, card_class } = cardObj;

          return (
            <span className="card-icon ms-2" key={index}>
              {card_no}
              <span className={card_class}>{card_icon}</span>
            </span>
          );
        }
        return null;
      });
    }
    return null;
  };

  const renderDealerCards = (imgCardArr) => {
    if (imgCardArr && imgCardArr.length > 0) {
      return imgCardArr.map((card, index) => {
        if (index % 9 === 8 && card) {
          // Equivalent to PHP loop $a=8; $a=$a+9

          return <img src={`/img/casino/cards/${card}.png`} key={index} />;
        }
        return null;
      });
    }
    return null;
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
      match_id: "teen8",
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
        if (data && data.sub && data.sub[0] && data.sub[0].min) {
          return data.sub[0].min;
        }
        return null;
      },
      onSuccess: () => {},
    });

    return success;
  };
  const [playerAmounts, setPlayerAmounts] = useState({
    "Player 1": "",
    "Player 2": "",
    "Player 3": "",
    "Player 4": "",
    "Player 5": "",
    "Player 6": "",
    "Player 7": "",
    "Player 8": "",
  });

  const renderVideoBox = () => {
    return (
      <div className="casino-video-cards">
        <div className="">
          <h5>Dealer</h5>
          <div className="flip-card-container">
            {renderDealerCards(cards)
              ?.filter((cardImg) => cardImg !== null)
              .map((cardImg, key) => (
                <div key={key} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img src={cardImg.props.src} alt={`Dealer Card ${key}`} />
                    </div>
                    <div className="flip-card-back">
                      <img src={cardImg.props.src} alt={`Dealer Card ${key}`} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Function to find data in sub array based on team name
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Teen8, find the index of the team name in playerStatuses keys
    const playerKeys = Object.keys(playerStatuses);
    const index = playerKeys.indexOf(teamName);
    
    if (index !== -1 && data.sub[index]) {
      return data.sub[index];
    }
    
    return null;
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
      raceClass="teenpattiopen"
      ruleImage={ruleImage}
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
         <div className="casino-table-full-box">
           <div className="casino-table-header">
             <div className="casino-nation-detail"></div>
             <div className="casino-odds-box back">Odds</div>
             <div className="casino-odds-box back">Pair Plus</div>
             <div className="casino-odds-box back">Total</div>
           </div>
           <div className="casino-table-body">
             {Object.keys(oddsData).map((player, index) => (
               <div key={index} className="casino-table-row">
                 <div className="casino-nation-detail">
                   <div className="casino-nation-name">
                     {player}
                     <div className="patern-name">{renderCards(index + 1)}</div>
                   </div>
                 </div>
                 <div
                   className={`casino-odds-box back ${playerStatuses[player]}`}
                   onClick={() => openPopup("back", player, oddsData[player])}
                 >
                   <span className="casino-odds">{oddsData[player]}</span>
                   <div style={{ color: "black" }}>
                     {getExByColor(playerAmounts[player])}
                   </div>
                 </div>
                 <div className="casino-odds-box back suspended-box">
                   <span className="casino-odds">Pair Plus {index + 1}</span>
                   <div style={{ color: "black" }}>0</div>
                 </div>
                 <div className="casino-odds-box back suspended-box">
                   <span className="casino-odds">{oddsData[player]}</span>
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
    </CasinoLayout>
  );
};

export default Teen8;
