import React, { useContext, useEffect, useState } from "react";
import Header from "../layouts/Header";
import { useParams, useLocation } from "react-router-dom";
import axiosFetch, { exposureCheck, getSize, ADMIN_BASE_PATH } from "../../utils/Constants";
import CasinoRules from "../casino/CasinoRules";
import CasinoReconnectModalPopup from "../casino/CasinoReconnectModalPopup";
import { CasinoContext } from "../../contexts/CasinoContext";
import { createGameConnect } from "../../utils/CasinoUtils";
import { useDispatch } from "react-redux";
import { setStatisticsData } from "../../store/slices/rouletteSlice";
import SidebarLayout from "../layouts/SidebarLayout";
import DesktopCasinoVideo from "../casino/DesktopCasinoVideo";
import RightSideBarCasino from "../layouts/RightSideBarCasino";
import Footer from "../layouts/Footer";
import CricketScoreboard from "../CricketScoreboard";
import MobileMatchedBetTable from "../MobileMatchedBetTable";

import { SportsContext } from "../../contexts/SportsContext";

const CasinoLayout = ({
  teamname,
  isAdmin = false, // New prop to determine if this is admin context
  hideLoading,
  isBack,
  handleStakeChange,
  odds,
  stakeValue,
  setOdds,
  submitButtonDisable = null,
  placeBet = null,
  setSubmitButton = null,
  virtualVideoCards = false,
  setData = null,
  data = {},

  setLastResult = null,
  sportList = {},
  setRoundId = null,
  roundId = 0,
  setSportList = null,
  children,
  ruleImage = null,
  ruleDescription = null,
  hideRules = false,
  raceClass = "teenpatti1day",
  placingBets = {},
  setPlacingBets = null,
  // Add min/max limit function
  getMinMaxLimits = null,
  ...props
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Use isAdmin prop instead of checking pathname
  // Keep legacy check for backward compatibility until all casino games are updated
  const isAdminRoute = isAdmin || location.pathname.toLowerCase().startsWith(ADMIN_BASE_PATH);
  const {
    casino_socket,
    triggerSocket,
    setTriggerSocket,
    scoreBoardData,
    setShouldBlinkForRoulette,
    mybetModel,
    setMybetModel,
  } = useContext(CasinoContext);

  const [socketDisconnectModal, setSocketDisconnectModal] = useState(false);
  const [showCasinoReconnectModal, setShowCasinoReconnectModal] =
    useState(false);

  const { match_id } = useParams();
  let socket_game = `getUserData${match_id}`;

  useEffect(() => {
    setPopupDisplayForDesktop(false);
  }, []);
  
  const { setPopupDisplayForDesktop } = useContext(SportsContext);
  const exposureheck = exposureCheck();
  const length = Object.keys(sportList).length;

  
  const [showRules, setShowRules] = useState(false);
  const [key, setKey] = useState("game");

  useEffect(() => {
    let interval = null;
    if (length > 0) {
      axiosFetch("matched-bet-details/" + sportList.id, "get", setMybetModel);
    }
    if(isAdminRoute && length > 0) {
     interval = setInterval(() => {
      axiosFetch("matched-bet-details/" + sportList.id, "get", setMybetModel);
     }, 2000);
    }

    return () => {
      if(isAdminRoute && length > 0 && interval) {
        clearInterval(interval);
      }
    }

    // eslint-disable-next-line
  }, [length, exposureheck]);

  const handleShowRules = () => setShowRules(true);
  const handleCloseRules = () => setShowRules(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosFetch(`casino_game/${match_id}`, "get");
        setSportList(res.data);
      } catch (error) {
        console.error("Error fetching casino game:", error);
      }
    };

    if (setSportList && match_id) {
      getData();
    }
  }, [match_id, setSportList]);

  // Socket emission effect - only runs once when socket is ready
  useEffect(() => {
    
    if (!triggerSocket.casino) {
      setTriggerSocket({ ...triggerSocket, casino: true });
      return;
    }

    
    if (casino_socket && match_id) {
      // Clear previous casino purpose and set new one - this should only happen once
      casino_socket.emit("setPurposeFor", "casinos", match_id, "");
      
    }

  }, [casino_socket, match_id, triggerSocket.casino]);

  const gameConnect = createGameConnect(
    casino_socket,
    socket_game,
    setData,
    setLastResult,
    setRoundId,
    (data) => dispatch(setStatisticsData(data))
  );
  // Game connection effect - handles game connection logic
  useEffect(() => {
    if (
      !casino_socket ||
      !match_id ||
      Object.keys(sportList).length === 0 ||
      setData === null
    ) {
      return;
    }

    gameConnect();

    return () => {
      
      casino_socket.off(socket_game);
    };
  }, [casino_socket, match_id, sportList, setData, setLastResult, setRoundId]);

  useEffect(() => {
    if (roundId && roundId > 0 && match_id.includes("roulette")) {
      setShouldBlinkForRoulette(true);

      const timeout = setTimeout(() => {
        setShouldBlinkForRoulette(false);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [match_id, roundId]);

  // Disconnect handling effect - handles socket disconnect/reconnect
  useEffect(() => {
    if (!casino_socket || !match_id) {
      return;
    }

    
    let connectInterval;

    const handleDisconnect = () => {
      connectInterval = setInterval(() => {
        gameConnect();
        clearInterval(connectInterval);
      }, 1000);
    };

    casino_socket.on("disconnect", handleDisconnect);

    return () => {
      if (connectInterval) {
        clearInterval(connectInterval);
      }
      casino_socket.off("disconnect", handleDisconnect);
    };
  }, [casino_socket, match_id, setData, setLastResult, setRoundId]);

  // Socket disconnect modal effect
  useEffect(() => {
    if (socketDisconnectModal === true && casino_socket) {
      casino_socket.disconnect();
    }
  }, [socketDisconnectModal, casino_socket]);

  return (
    <>
      {!isAdminRoute && <Header />}

      <div className="main-container">
      {!isAdminRoute && <SidebarLayout />}

        <div className="center-main-container casino-page">
          <div className="center-container">
            <div className={`casino-page-container ${raceClass}`}>
              <div className="casino-header">
                <span className="casino-name">
                  {sportList?.match_name}
                  &nbsp;
                  {!hideRules && (
                    <a
                      role="button"
                      className="ms-1"
                      onClick={handleShowRules}
                      tabIndex="0"
                    >
                      <u>Rules</u>
                    </a>
                  )}
                </span>

                <span className="casino-rid d-none d-xl-inline-block">
                  <small>
                    Round ID: <span className="roundID">{roundId}</span>
                  </small>
                  
                  {props.max && props.min && (
                    <small class="ms-2"><span>Range: {props.min} to {getSize(props.max, true)}</span></small>
                  )}
                  
                </span>
                {props.max && props.min && (
                <span class="casino-rid d-xl-none"><small class="ms-2"><span>Range: {props.min} to {getSize(props.max, true)}</span></small></span>
                )}

                
              </div>

              <div className="casino-title-header-mobile d-xl-none">
                <ul className="nav nav-tabs menu-tabs">
                  <li className="nav-item">
                    <div
                      className={`nav-link ${key === "game" ? "active" : ""}`}
                      onClick={() => setKey("game")}
                      style={{ cursor: "pointer" }}
                    >
                      Game
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      className={`nav-link ${key === "match" ? "active" : ""}`}
                      onClick={() => setKey("match")}
                      style={{ cursor: "pointer" }}
                    >
                      Placed Bets ({mybetModel.length})
                    </div>
                  </li>
                </ul>
                <div className="pe-2">
                  <span className="casino-rid">
                    Round ID:<span>{roundId}</span>
                  </span>
                </div>
              </div>

              {(match_id === "cricketv3" ||
                match_id === "superover" ||
                match_id === "superover3") &&
                scoreBoardData.current && (
                  <CricketScoreboard data={scoreBoardData.current.data} />
                )}

              <div className={`${key === "game" ? "" : "d-none"} ${props.casinoContainer ? "position-relative" : ""}`}>
                <div className={`casino-video ${props.full_video == true ? 'full' : ''}`}>
                  <DesktopCasinoVideo
                    {...props}
                    virtualVideoCards={virtualVideoCards}
                    showCasinoReconnectModal={showCasinoReconnectModal}
                    gamename={match_id}
                    data={data}
                  />
                </div>
                <div className="casino-detail">{children}</div>
              </div>

              <div className={`${key === "match" ? "" : "d-none"} ${props.casinoContainer ? "position-relative" : ""}`}>
                <MobileMatchedBetTable
                  type={sportList?.match_id}
                  mybetModel={mybetModel}
                />
              </div>
            </div>

            {/* Rules Modal */}
            <CasinoRules
              image={ruleImage}
              description={ruleDescription}
              showRules={showRules}
              handleCloseRules={handleCloseRules}
            />
            <CasinoReconnectModalPopup
              setSocketDisconnectModal={setSocketDisconnectModal}
              setShowCasinoReconnectModal={setShowCasinoReconnectModal}
              show={showCasinoReconnectModal}
            />
          </div>
          <RightSideBarCasino
            setSubmitButton={setSubmitButton}
            sportList={sportList}
            myBetModel={mybetModel}
            hideLoading={hideLoading}
            isBack={isBack}
            handleStakeChange={handleStakeChange}
            stakeValue={stakeValue}
            odds={odds}
            teamname={teamname}
            setOdds={setOdds}
            submitButtonDisable={submitButtonDisable}
            placeBet={placeBet}
            gamename={sportList?.match_name}
            placingBets={placingBets}
            setPlacingBets={setPlacingBets}
            getMinMaxLimits={getMinMaxLimits}
          />
        </div>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
};
export default CasinoLayout;
