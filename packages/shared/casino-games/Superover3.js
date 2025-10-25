import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import encryptHybrid from "../utils/encryptHybrid";
import { decryptAndVerifyResponse } from "../utils/decryptAndVerifyResponse";
import {
  getExByColor,
  getExByTeamNameForCasino,
  resetBetFields,
  placeCasinoBet,
  exposureCheck,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";

import Notify from "../utils/Notify";
import { CasinoContext } from "../contexts/CasinoContext";

const Superover3 = () => {
  const [roundId, setRoundId] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const {
    triggerSocket,
    casino_socket_scoreboard,
    scoreBoardData,
    setTriggerSocket,
  } = useContext(CasinoContext);

  const teamNameCurrentBets = useRef({});

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
  const { mybetModel } = useContext(CasinoContext);

  // Get user data from Redux instead of AuthContext
  const userBalance = useSelector((state) => state.user.balance);
  const [hideLoading, setHideLoading] = useState(true);

  useEffect(() => {
    if (!triggerSocket.scoreboard && triggerSocket.casino) {
      setTriggerSocket({ ...triggerSocket, scoreboard: true });
    }
  }, [triggerSocket.casino, triggerSocket.scoreboard]);

  const teamNames = useRef(["IND", "AUS"]);

  const ruleImage = "";
  const ruleDescription = `<ul className="pl-2 pr-2">
        <li>Mini Super Over is a shorter version of super over cricket.</li>
    <li>This game is played between two teams. Team batting first is India and
        team batting second is Australia.
    </li>
    <li>Mini Super over is a four Ball each side match.</li>
    <li>This game is played with 21 card deck.
        <ul className="pl-2 pr-2">
            <li>A = (One run) X 3 cards</li>
            <li>2 = (Two runs) X 3 cards</li>
            <li>3 = (Three runs) X 3 cards</li>
            <li>4 = (Four runs) X 3 cards</li>
            <li>6 = (Six runs) X 3 cards</li>
            <li>10 = (0 run) X 3 cards</li>
            <li>K = (wicket) X 3 cards</li>
            <li>21 cards total</li>
        </ul>
    </li>
    <li>If wicket falls at any stage of the innings the team batting will be
        considered as all out.
    </li>
    <li>If scores of both the teams are equal then the match will be
        considered as Tie.
    </li>
    <li>Difference of wicket between teams does not count.</li>
    <li>Session and Fancy markets will be considered valid though the
        match ends in Tie.
    </li>
    <li>Team Scoring maximum runs will be the winner.</li>
    <li>At the end of each inning deck will be shuffled.</li>
    <li>Odds will be available for every ball.</li>
    <li>Term boundary in fancy market defines four &amp; six both or scoring four
        runs or six runs both will be considered as boundary.
    </li>
</ul>`;
  const [data, setData] = useState([]);
  const [playerA, setPlayerA] = useState(0); // Example player A value
  const [playerStatuses, setPlayerStatuses] = useState({
    IND: "suspended",
    AUS: "suspended",
  });
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

  useEffect(() => {
    setBetType("BOOKMAKER");

    if (data?.t2) {
      updatePlayerStats(
        data.t2?.[0]?.["section"]?.[0],
        setPlayerA_Back,
        setPlayerA_Lay,
        "IND",
        setPlayerASize
      );
      updatePlayerStats(
        data.t2?.[0]?.["section"]?.[1],
        setPlayerB_Back,
        setPlayerB_Lay,
        "AUS",
        setPlayerBSize
      );

      remark.current = data.remark || "Welcome";
    }

    // Update teamNameCurrentBets
    if (!teamNameCurrentBets.current?.["BOOKMAKER"]) {
      teamNameCurrentBets.current["BOOKMAKER"] = [];
    }
    teamNameCurrentBets.current["BOOKMAKER"]["IND"] = playerA;
    teamNameCurrentBets.current["BOOKMAKER"]["AUS"] = playerB;
  }, [data?.t2]);

  useEffect(() => {
    if (data?.t1?.card) {
      let ar_card_img = {
        K: "/img/casino/rules/ball/wicket1.png",
        A: "/img/casino/rules/ball/ball1.png",
        2: "/img/casino/rules/ball/ball2.png",
        3: "/img/casino/rules/ball/ball3.png",
        4: "/img/casino/rules/ball/ball4.png",
        6: "/img/casino/rules/ball/ball6.png",
        10: "/img/casino/rules/ball/ball0.png",
      };
      const ar_explode = ["CC", "HH", "DD", "SS"];

      // Split the card string and map to images
      const result_cards = data.t1.card.split("|").map((item) => {
        // Remove any "CC", "HH", "DD", "SS" from the item
        ar_explode.forEach((str) => {
          item = item.replace(str, "");
        });

        // Return the image path if the item exists in ar_card_img, else null
        return item !== "1" ? ar_card_img[item] || null : null;
      });

      setCards(result_cards); // Assuming setCards is a state setter function
    }
  }, [data?.t1?.card]);

  useEffect(() => {
    if (data?.t1?.gmid && casino_socket_scoreboard) {
      const payload = {
        type: "casino",
        game: "superover3",
        scard: data?.t1?.gmid,
        match_id: "superover3",
      };

      const encryptedPayload = encryptHybrid(payload);

      casino_socket_scoreboard.emit("setPurposeFor", encryptedPayload);

      casino_socket_scoreboard.on(
        "getScoreDatasuperover3" + match_id,
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

  const exposure = exposureCheck();
  const sportLength = Object.keys(data).length;
  const updateAmount = async () => {
    await getExByTeamNameForCasino(
      sportList.id,
      data?.t1?.gmid,
      "IND",
      match_id
    ).then((res) => setPlayerA(res.data));

    await getExByTeamNameForCasino(
      sportList.id,
      data?.t1?.gmid,
      "AUS",
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
      playerStatus = "suspended";
    }

    if (playerName === "IND") {
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

  // Helper function to find data in data.sub for Superover3
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;

    // For Superover3, find the item by nat field
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
        <div className="mt-1" key={index}>
          <img key={index} src={card} alt={`card-${index}`} />
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
    return <div className="casino-video-cards">{renderCards()}</div>;
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

  return (
    <CasinoLayout
      raceClass="super-over"
      videoBox="video-box-container"
      virtualVideoCards={renderVideoBox}
      ruleImage={ruleImage}
      getMinMaxLimits={getMinMaxLimits}
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
    >
      <div className="casino-detail detail-page-container position-relative">
        <div className="game-market market-2">
          <div className="market-title">
            <span>Bookmaker</span>
          </div>
          <div className="market-header">
            <div className="market-nation-detail">
              <span className="market-nation-name">
                Min: {min} Max: {max}
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
            {["IND", "AUS"].map((team, index) => (
              <div
                key={index}
                className={`market-row ${
                  playerStatuses[team] === "suspended" ? "suspended-row" : ""
                }`}
                data-title={
                  playerStatuses[team] === "suspended" ? "SUSPENDED" : "ACTIVE"
                }
              >
                <div className="market-nation-detail">
                  <span className="market-nation-name">{team}</span>
                  <div className="market-">
                    {getExByColor(team === "IND" ? playerA : playerB)}
                  </div>
                </div>
                <div
                  className="market-odd-box back"
                  onClick={() =>
                    openPopup(
                      "back",
                      team,
                      team === "IND" ? playerA_Back : playerB_Back
                    )
                  }
                >
                  <span className="market-odd">
                    {team === "IND" ? playerA_Back || "-" : playerB_Back || "-"}
                  </span>
                  {team === "IND" && playerASize.back && (
                    <span className="market-volume">{playerASize.back}</span>
                  )}
                  {team === "AUS" && playerBSize.back && (
                    <span className="market-volume">{playerBSize.back}</span>
                  )}
                </div>
                <div
                  className="market-odd-box lay"
                  onClick={() =>
                    openPopup(
                      "lay",
                      team,
                      team === "IND" ? playerA_Lay : playerB_Lay
                    )
                  }
                >
                  <span className="market-odd">
                    {team === "IND" ? playerA_Lay || "-" : playerB_Lay || "-"}
                  </span>
                  {team === "IND" && playerASize.lay && (
                    <span className="market-volume">{playerASize.lay}</span>
                  )}
                  {team === "AUS" && playerBSize.lay && (
                    <span className="market-volume">{playerBSize.lay}</span>
                  )}
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
      </div>
    </CasinoLayout>
  );
};

export default Superover3;
