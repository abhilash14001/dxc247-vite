import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import {
  getExByColor,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  getSize,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";
import encryptHybrid from "../utils/encryptHybrid";
import { decryptAndVerifyResponse } from "../utils/decryptAndVerifyResponse";
import Notify from "../utils/Notify";

const Cricketv3 = () => {
  const [roundId, setRoundId] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const showCalculation = true;

  const roundIdSaved = useRef(null);

  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [cards, setCards] = useState([]);

  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);

  const [backOrLay, setbackOrLay] = useState("back");
  const [sportList, setSportList] = useState({});
  const { match_id } = useParams();
  const { betType, setBetType, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const { casino_socket_scoreboard, scoreBoardData } =
    useContext(CasinoContext);
    
  // Get user data from Redux instead of AuthContext
  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef(["AUS", "IND"]);

  const ruleImage = "/img/rules/cricketv3.jpeg";
  const ruleDescription = "";
  const [data, setData] = useState([]);
  const [playerA, setPlayerA] = useState(0); // Example player A value
  const [playerStatuses, setPlayerStatuses] = useState({ AUS: "", IND: "" });
  const [playerA_Back, setPlayerA_Back] = useState(0);
  const [playerB_Back, setPlayerB_Back] = useState(0);
  const [playerA_Lay, setPlayerA_Lay] = useState(0);
  const [playerB, setPlayerB] = useState(0); // Example player B value
  const [playerASize, setPlayerASize] = useState({ back: "", lay: "" }); // Example player B value
  const [playerBSize, setPlayerBSize] = useState({ back: "", lay: "" }); // Example player B value

  const [playerB_Lay, setPlayerB_Lay] = useState(0);
  const remark = useRef("Welcome");
  const [lastResult, setLastResult] = useState({});
  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  const { triggerSocket, setTriggerSocket, mybetModel } = useContext(CasinoContext);

  useEffect(() => {
   
    if (data?.t1?.gmid && casino_socket_scoreboard) {
     
      const payload = {type : 'casino', game : 'superover', scard : data?.t1?.gmid, match_id : "superover"}

      const encryptedPayload = encryptHybrid(payload);
      


      casino_socket_scoreboard.emit(
        "setPurposeFor",
        encryptedPayload
      );

      casino_socket_scoreboard.on(
        "getScoreDatacricketv3" + match_id,
        (data) => {
          let fetchedData = decryptAndVerifyResponse(data);

          fetchedData = JSON.parse(fetchedData);

          if (fetchedData?.data?.scoreboard) {
            scoreBoardData.current = fetchedData;
          } else {
            scoreBoardData.current = null;
          }
        }
      );
    }
  }, [data?.t1?.gmid, casino_socket_scoreboard]);


  useEffect(() => {
    
    if(!triggerSocket.scoreboard && triggerSocket.casino){
      setTriggerSocket({...triggerSocket, scoreboard : true})
    
        
    }
    
    
  }, [triggerSocket.casino, triggerSocket.scoreboard])


  
  useEffect(() => {
    setBetType("BOOKMAKER");

    if (data?.t2) {
      updatePlayerStats(
        data.t2?.[0]?.["section"]?.[0],
        setPlayerA_Back,
        setPlayerA_Lay,
        "AUS",
        setPlayerASize
      );
      updatePlayerStats(
        data.t2?.[0]?.["section"]?.[1],
        setPlayerB_Back,
        setPlayerB_Lay,
        "IND",
        setPlayerBSize
      );
    }

    if (data) {
      if (data?.t1?.card) {
        // Split the card string and map to images
        const result_cards = data.t1.card.split("|").map((item) => {
          // Return the image path if the item exists in ar_card_img, else null
          return item;
        });

        setCards(result_cards); // Assuming setCards is a state setter function
      }

      remark.current = data.remark || "Welcome";
    }
  }, [data]);

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;
  const updateAmount = async () => {
    await getExByTeamNameForCasino(
      sportList.id,
      data?.t1?.gmid,
      "AUS",
      match_id
    ).then((res) => setPlayerA(res.data));

    await getExByTeamNameForCasino(
      sportList.id,
      data?.t1?.gmid,
      "IND",
      match_id
    ).then((res) => setPlayerB(res.data));
  };
  useEffect(() => {
    if (data?.t2 && sportList?.id) {
      updateAmount();
    }
  }, [exposure, sportLength, roundId, mybetModel.length]);

  const updatePlayerStats = (
    playerData,
    setPlayerBack,
    setPlayerLay,
    playerName,
    setPlayerSize
  ) => {
    if (!playerData) return;
    let playerStatus = "";

    if (playerData.gstatus !== "ACTIVE") {
      playerStatus = "suspended suspended-box-2";
    }

    if (playerName === "AUS") {
      setMin(data?.t2[0].min);
      setMax(data?.t2[0].max);
    }

    const england_back = playerData["odds"].find(
      (item) => item.otype === "back"
    ).odds;

    const england_lay = playerData["odds"].find(
      (item) => item.otype === "lay"
    ).odds;
    setPlayerSize({
      back: playerData["odds"].find((item) => item.otype === "back").size,
      lay: playerData["odds"].find((item) => item.otype === "lay").size,
    });

    setPlayerStatuses((prev) => ({ ...prev, [playerName]: playerStatus }));

    if (england_back) {
      setPlayerBack(england_back);
    } else {
      setPlayerBack(0);
    }
    if (england_lay) {
      setPlayerLay(england_lay);
    } else {
      setPlayerLay(0);
    }
  };
  const openPopup = (isBakOrLay, teamnam, oddvalue) => {
    loss.current = "";
    profit.current = "";

    if (parseFloat(oddvalue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBakOrLay);
      setPopupDisplayForDesktop(true);
      teamname.current = teamnam;
      setOdds(oddvalue);
    } 
  };

  // Helper function to find data in data.sub for Cricketv3
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Cricketv3, find the item by nat field
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

  const renderCards = () =>
    cards?.map((card, index) => {
      if (card === null) return null;
      return (
        <div key={index} className="mt-1">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={`/img/casino/cards/${card}.png`} alt={`card-${index}`} />
              </div>
              <div className="flip-card-back">
                <img src={`/img/casino/cards/${card}.png`} alt={`card-${index}`} />
              </div>
            </div>
          </div>
        </div>
      );
    });

  const placeBet = async () => {
    const betData = {
      sportList,
      roundId,
      backOrLay,
      teamname,
      odds,
      profit,
      loss,
      betType: "BOOKMAKER",
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
      updateAmounts: updateAmount,
      Notify,
    };

    const success = await placeCasinoBet(betData, {
      placeName2: teamNames.current,
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
      
        <div className="casino-video-cards">
          {renderCards()}
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
    <CasinoLayout raceClass="five-cricket"
      ruleImage={ruleImage}
      ruleDescription={ruleDescription}
      hideLoading={hideLoading}
      isBack={backOrLay}
      getMinMaxLimits={getMinMaxLimits}
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
    >
      
      <div className="casino-detail detail-page-container position-relative">
        {data?.t2?.[0]?.section && (
          <div className="game-market market-2">
            <div className="market-title">
              <span>Bookmaker</span>
            </div>
            <div className="market-header">
              <div className="market-nation-detail">
                <span className="market-nation-name">
                  Min: {min} Max: {getSize(max, true)}
                </span>
              </div>
              <div className="market-odd-box back">
                <b>Back</b>
              </div>
              <div className="market-odd-box lay">
                <b>Lay</b>
              </div>
            </div>
            <div className="market-body" data-title="OPEN">
              {["AUS", "IND"].map((team, index) => (
                <div 
                  key={index} 
                  className={`market-row ${playerStatuses[team] ? 'suspended-row' : ''}`} 
                  data-title={playerStatuses[team] ? 'SUSPENDED' : 'ACTIVE'}
                >
                  <div className="market-nation-detail">
                    <span className="market-nation-name">{team}</span>
                    <div className="market-nation-book">
                      {getExByColor(team === "AUS" ? playerA : playerB)}
                    </div>
                  </div>
                  <div 
                    className={`market-odd-box back ${playerStatuses[team]}`}
                    onClick={() => openPopup("back", team, team === "AUS" ? playerA_Back : playerB_Back)}
                  >
                    <span className="market-odd">
                      {playerStatuses[team] ? '-' : (team === "AUS" ? playerA_Back : playerB_Back)}
                    </span>
                    {!playerStatuses[team] && (
                      <span className="market-volume">
                        {team === "AUS" ? playerASize.back : playerBSize.back}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`market-odd-box lay ${playerStatuses[team]}`}
                    onClick={() => openPopup("lay", team, team === "AUS" ? playerA_Lay : playerB_Lay)}
                  >
                    <span className="market-odd">
                      {playerStatuses[team] ? '-' : (team === "AUS" ? playerA_Lay : playerB_Lay)}
                    </span>
                    {!playerStatuses[team] && (
                      <span className="market-volume">
                        {team === "AUS" ? playerASize.lay : playerBSize.lay}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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


export default Cricketv3;
