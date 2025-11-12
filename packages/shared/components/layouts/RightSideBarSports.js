import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import { AuthContext } from "@dxc247/shared/contexts/AuthContext";
import axiosFetch, {
  setdecimalPoint,
  calculateUpdatedBets,
  updatePlacingBetsState,
  calculateProfitCommon,
  getSize,
} from "@dxc247/shared/utils/Constants";
import Notify from "@dxc247/shared/utils/Notify";
import StakeModal from "@dxc247/shared/components/EditStakeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "@dxc247/shared/components/css/blink-animation.css";
import { useStake } from "@dxc247/shared/contexts/StakeContext";
import { useCashoutTeam, useSetCashoutTeam } from "@dxc247/shared/store/hooks";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setIsSubmitDisabled } from "@dxc247/shared/store/slices/casinoSlice";
import { isAdminRoute, useDeleteMatchedBet } from "@dxc247/shared/utils/Constants";
import useStakeValuesCheck from "@dxc247/shared/hooks/useStakeValuesCheck";
import CricketScoreboard from "../CricketScoreboard";
const RightSideBarSports = ({
  setPlacingBets = null,
  callTeamDatas = null,
  placingBets = [],

  setPopupDisplay = () => {},
  popupDisplay = false,
  getBetListData = null,
  myBetModel = [],

  individualBetPlaceFetch = () => {},
  odds = 0,
  gameId = null,

  setOdds = () => {},
  backOrLay = "back",
  data = {},
  teamNameCurrentBets = {},
  teamNames = {},

  maxValue = 1,
  teamname = {current: ""},
  sportList = {},
  minValue = 1,
  refreshSpecificBetType = () => {},
  scoreboardData = null,
}) => {
  const [isTVVisible, setIsTVVisible] = useState(false);
  const [stakeshowModal, setStakeShowModal] = useState(false);
  const toggleTV = () => {
    setIsTVVisible(!isTVVisible);
  };
  const dispatch = useDispatch();
  const { isSubmitDisabled } = useSelector((state) => state.casino);
  const changeDataRef = useRef({});
  const [isFixed, setIsFixed] = useState(false);
  const [sidebarTop, setSidebarTop] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarTop(sidebarRef.current.offsetTop);
    }

    const handleScroll = () => {
      if (sidebarRef.current) {
        const scrollTop = window.scrollY;
        if (scrollTop >= sidebarTop) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sidebarTop]);

  useEffect(() => {
    if (popupDisplay === true) {
      setPlacingBets([]);
    }
    //eslint-disable-next-line
  }, [odds]);

  const {
    betType,
    oddsk,
    globalMname,
    betTypeFromArray,
    stakeValue,
    loss,
    profit,
    profitData,
  } = useContext(SportsContext);
  const { stakeValues } = useStake();
  const cashoutTeam = useCashoutTeam();
  const { clearTeam } = useSetCashoutTeam();
  const { deleteBet, undoBet } = useDeleteMatchedBet();
  
  // Use the custom hook for stake values checking
  useStakeValuesCheck();

  // Dynamic mobile detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);



  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileDevice(window.innerWidth <= 768);
    };

    // Check on initial load
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);


  const { getBalance } = useContext(AuthContext);
  const [hideLoading, setHideLoading] = useState(false);

  const { rootClassDefault, runnerRowDefault } = useContext(SportsContext);

  useEffect(() => {
    if (Object.entries(data).length > 0) {
      changeDataRef.current = data;
    }
    return () => {
      changeDataRef.current = {};
    };
  }, [data]);
  const handleStakeChange = (event, newodds = null, is_add = false) => {
    
    const value = parseFloat(event.target.value) || 0;
    
    if (value !== "") {
      dispatch(setIsSubmitDisabled(false));
    } else {
      dispatch(setIsSubmitDisabled(true));
    }
    
    // Calculate the actual stake value to use
    let actualStake;
    if (is_add) {
      actualStake = parseFloat(stakeValue.current.value || 0) + value;
      stakeValue.current.value = actualStake;
    } else {
      // Replace with new value
      actualStake = value;
      stakeValue.current.value = actualStake;
    }

    if (newodds !== null) {
      odds = newodds;
    }

    // Use actualStake for all calculations, not just the increment value
    calculateProfit(actualStake, odds);
    const losslayvalue = (parseFloat(odds) * parseFloat(actualStake)) / 100;

    const lossvalue = (parseFloat(odds) - 1) * parseFloat(actualStake);
    loss.current =
      backOrLay === "back"
        ? parseFloat(setdecimalPoint(actualStake))
        : betType === "ODDS"
        ? parseFloat(setdecimalPoint(lossvalue))
        : parseFloat(setdecimalPoint(losslayvalue));

    if (
      setPlacingBets !== null &&
      [
        "ODDS",
        "BOOKMAKER",
        "TIED_MATCH",
        "TIED MATCH",
        "cup",
        "BOOKMAKER2",
      ].includes(betType)
    ) {
      // Use the utility function to calculate updated bets
      const updatedBets = calculateUpdatedBets(
        betType,
        backOrLay,
        teamname.current,
        profit.current,
        loss.current,
        Object.values(teamNames.current[betType]),
        teamNameCurrentBets.current,
        placingBets
      );

      // Use the utility function to update state
      updatePlacingBetsState(setPlacingBets, betType, updatedBets);
    }
  };

  // Handle odds increase/decrease by 0.01
  const handleOddsChange = (direction) => {
    const currentOdds = parseFloat(odds) || 0;
    let newOdds;

    if (direction === "increase") {
      newOdds = currentOdds + 0.01;
    } else if (direction === "decrease") {
      newOdds = Math.max(0.01, currentOdds - 0.01); // Prevent going below 0.01
    }

    if(newOdds < 1.01)
      return;
    // Update odds state
    setOdds(newOdds.toFixed(2));

    // Recalculate profit/loss with new odds
    if (stakeValue.current.value) {
      calculateProfit(stakeValue.current.value, newOdds);
      const losslayvalue =
        (newOdds * parseFloat(stakeValue.current.value)) / 100;
      const lossvalue = (newOdds - 1) * parseFloat(stakeValue.current.value);
      loss.current =
        backOrLay === "back"
          ? parseFloat(setdecimalPoint(stakeValue.current.value))
          : betType === "ODDS"
          ? parseFloat(setdecimalPoint(lossvalue))
          : parseFloat(setdecimalPoint(losslayvalue));

      // Update placing bets if needed
      if (
        setPlacingBets !== null &&
        [
          "ODDS",
          "BOOKMAKER",
          "TIED_MATCH",
          "TIED MATCH",
          "cup",
          "BOOKMAKER2",
        ].includes(betType)
      ) {
        const updatedBets = calculateUpdatedBets(
          betType,
          backOrLay,
          teamname.current,
          profit.current,
          loss.current,
          teamNames.current[betType],
          teamNameCurrentBets.current,
          placingBets
        );
        updatePlacingBetsState(setPlacingBets, betType, updatedBets);
      }
    }
  };

  useEffect(() => {
    setPopupDisplay(false);
  }, []);

  useEffect(() => {
    if (stakeValue.current && stakeValue.current.value > 0) {
      handleStakeChange({ target: { value: stakeValue.current.value } });
    }
  }, [stakeValue.current, odds, betType]);

  const calculateProfit = (stake, odds) => {
    // Parse odds and stake once for performance
    calculateProfitCommon(
      betType,
      backOrLay,
      odds,
      stake,
      profit,
      profitData,
      oddsk
    );
  };

  const clearAllSelection = () => {
    stakeValue.current.value = "";

    profit.current = 0;
    dispatch(setIsSubmitDisabled(true));
    clearTeam();
    loss.current = 0;
    
    // Clear placingBets if setPlacingBets is available
    if (setPlacingBets !== null && typeof setPlacingBets === 'function') {
      setPlacingBets([]);
    }
  };
  const resetAll = () => {
    clearAllSelection();
    setOdds(0);
    
    profitData.current = 0;
    setPopupDisplay(false);
    setHideLoading(false);
    
    setPlacingBets([]);
  };
  const getLatestDataFound = () => {
    const teamm = [" - Odd", " - Even"].some((el) =>
      teamname.current.includes(el)
    )
      ? teamname.current.split(" - ")[0]
      : teamname.current;

    let betTypeis = betTypeFromArray;

    const globalMatch = globalMname
      ? Object.values(changeDataRef.current).find(
          (item) => item.mname === globalMname
        )
      : null;

    const findTeamGlobal = globalMatch
      ? globalMatch?.section.find((item) => item.nat.trim() === teamm.trim())
      : null;
    return (
      changeDataRef.current[betTypeis]?.section.find(
        (item) => item.nat.trim() === teamm.trim()
      ) || findTeamGlobal
    );
  };

  const placeBet = async () => {
    
    setHideLoading(true);

    let datafound = getLatestDataFound();

    backOrLay =
      betType === "ODDEVEN"
        ? backOrLay === "back"
          ? "odd"
          : "even"
        : backOrLay;
    let match_odd = datafound?.[backOrLay]?.[runnerRowDefault.current];

    const minMaxCheck = () => {
      // Get team-specific max/min values from data for OVER_BY_OVER bet type
      let teamMaxValue = maxValue?.[betType];
      let teamMinValue = minValue?.[betType];
      
      // Apply team-specific max/min logic for all bet types except ODDS and BOOKMAKER
      if (betType !== 'ODDS' && betType !== 'BOOKMAKER' && betType !== 'BOOKMAKER2' && data) {
        const currentTeamName = teamname.current;
        let currentSection = null;
        
        // Find the section based on bet type
        if (betType === 'OVER_BY_OVER' && data['over by over'] && data['over by over'].section) {
          currentSection = data['over by over'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        } else if (betType === 'BALL_BY_BALL' && data['ball by ball'] && data['ball by ball'].section) {
          currentSection = data['ball by ball'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        } else if (betType === 'FANCY_SESSION' && data['normal'] && data['normal'].section) {
          currentSection = data['normal'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        } else if (betType === 'ODDEVEN' && data['oddeven'] && data['oddeven'].section) {
          currentSection = data['oddeven'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        } else if (betType === 'METER' && data['meter'] && data['meter'].section) {
          currentSection = data['meter'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        } else if (betType === 'KHADO' && data['khado'] && data['khado'].section) {
          currentSection = data['khado'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        }
        else if(betType === 'fancy1' && data['fancy1'] && data['fancy1'].section) {
          currentSection = data['fancy1'].section.find(section => 
            section.nat?.trim() === currentTeamName
          );
        }
        
        if (currentSection) {
          teamMaxValue = currentSection.max || sportList.fancy_max_limit;
          teamMinValue = currentSection.min || sportList.fancy_min_limit;
        }
      }

      if (teamMaxValue && teamMaxValue < stakeValue.current.value) {
        setHideLoading(true);

      } else if (teamMinValue && teamMinValue > stakeValue.current.value) {
        setHideLoading(true);

        Notify("Min Max Bet Limit Exceed1", null, null, "danger");
        resetAll();

        return false;
      }
      return true;
    };

    if (!minMaxCheck()) {
      return;
    }

    if (betType === "ODDS") {
      const oddFunction = () => {
        let datafound = getLatestDataFound(); // Re-fetch latest data in each call

        backOrLay =
          betType === "ODDEVEN"
            ? backOrLay === "back"
              ? "odd"
              : "even"
            : backOrLay;

        const match_odd = {
          ...datafound[backOrLay]?.[runnerRowDefault.current],
        };

        if (datafound?.gstatus === "SUSPENDED" && datafound?.gstatus !== "") {
          Notify("Bet not Confirm. Game Suspended", null, null, "danger");
          resetAll();

          return false;
        }

        if (match_odd) {
          if (backOrLay === "back" && odds > match_odd.odds) {
            Notify("Odds Value change, Bet not Confirm!", null, null, "danger");
            resetAll();
            return false;
          }

          if (backOrLay === "lay" && odds < match_odd.odds) {
            Notify("Odds Value change, Bet not Confirm!", null, null, "danger");
            resetAll();
            return false;
          }
          calculateProfit(stakeValue.current.value, match_odd.odds);
          odds = match_odd.odds;
        }
        return true;
      };

      const isOddValid = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(oddFunction());
        }, 5000);
      });

      if (!isOddValid) return;
    } else if (betType === "BOOKMAKER" || betType === "BOOKMAKER2") {
      if (
        datafound &&
        datafound?.gstatus !== "ACTIVE" &&
        datafound?.gstatus !== ""
      ) {
        Notify("Bet not Confirm. Game Suspended", null, null, "danger");
        resetAll();

        return;
      }
      if (match_odd !== undefined) {
        if (odds !== match_odd.odds) {
          Notify("Odds Value change, Bet not Confirm!", null, null, "danger");
          resetAll();

          return;
        }
      }
    } else {
      if (datafound.gstatus === "SUSPENDED" && datafound.gstatus !== "") {
        Notify("Bet not Confirm. Game Suspended", null, null, "danger");
        resetAll();

        return;
      }
      if (match_odd !== undefined) {
        if (odds !== match_odd.odds) {
          Notify("Odds Value change, Bet not Confirm!", null, null, "danger");
          resetAll();

          return;
        }
      }
    }

    const submit = () => {
      

      let allTeamNames = teamNames?.current?.[betType] || [];

      // Convert object to array if it's not already an array
      if (
        allTeamNames &&
        typeof allTeamNames === "object" &&
        !Array.isArray(allTeamNames)
      ) {

        // Try different approaches to get the values
        const values = Object.values(allTeamNames);
        // Filter out any undefined values and ensure we have strings
        allTeamNames = values.filter((val) => val && typeof val === "string");
        
      }


      // Handle different bet types - map to correct teamNames keys
      if (!allTeamNames || allTeamNames.length === 0) {
        const teamNamesMapping = {
          SESSION: "FANCY_SESSION",
          ODDS: "ODDS",
          FANCY_SESSION: "FANCY_SESSION",
          fancy1: "fancy1",
          BALL_BY_BALL: "BALL_BY_BALL",
          METER: "METER",
          KHADO: "KHADO",
          BOOKMAKER2: "BOOKMAKER2",
          BOOKMAKER: "BOOKMAKER",
          OVER_BY_OVER: "OVER_BY_OVER",
        };

        const mappedKey = teamNamesMapping[betType];
        if (mappedKey) {
          allTeamNames = Object.values(teamNames?.current?.[mappedKey]) || [];
        }
      }

      const data = {
        sportId: sportList.id,
        matchId: sportList.match_id,
        isback: backOrLay === "back" ? 1 : 0,
        placeName: teamname?.current?.trim(),
        placeName2: "",
        odds: odds,
        oddsk: oddsk.current,
        profit: backOrLay === "lay" ? loss.current : profitData.current,
        loss: backOrLay === "lay" ? profit.current : loss.current,
        betRowNo: runnerRowDefault?.current,
        isfancy: betType === "SESSION" || betType === "FANCY_SESSION" ? 0 : 1,
        betType: betType,
        betAmount: stakeValue.current.value,
        rootClass: rootClassDefault.current,
        allTeamNames: allTeamNames, // Add all team names for the bet type
      };

      if (betType === "fancy1") {
        data.loss = stakeValue.current.value;
      }
      if (backOrLay === "lay") {
        data.profit = profit.current;
        data.loss = loss.current;
      }

      axiosFetch("betStore", "post", null, data)
        .then((data) => {
          if (data.data.status === true) {
            // setOddsTeamData(getExByTeamNameForCricket(ar_sectionData, 'ODDS', 'match_odds', sportList.id))

            individualBetPlaceFetch(teamname.current);
            Notify(data.data.msg, null, null, "success");
            getBetListData();
            if (refreshSpecificBetType && betType) {
              refreshSpecificBetType(betType);
            }
            
            // Also call callTeamDatas to refresh team data
            if (callTeamDatas && betType) {
              const betTypeMapping = {
                ODDS: "match_odds",
                BOOKMAKER: "bookmaker",
                BOOKMAKER2: "bookmaker 2",
                cup: "cup",
                TIED_MATCH: "tied match",
              };

              if (betTypeMapping[betType]) {
                callTeamDatas({ [betType]: betTypeMapping[betType] });
              }
            }
          } else {
            Notify(data.data.msg, null, null, "danger");
          }

          getBalance();
          resetAll();
          clearAllSelection();
        })
        .catch((error) => {
          resetAll();
          clearAllSelection();
        });
    };

    if (
      betType === "ODDS" ||
      betType === "BOOKMAKER" ||
      betType === "BOOKMAKER2" ||
      betType === "TIED_MATCH"
    ) {
      setHideLoading(true);

      submit();
    } else {
      submit();
    }
  };

  return (
    <div
      className="sidebar right-sidebar"
      ref={sidebarRef}
      style={{
        position: isFixed ? "sticky" : "relative",
        top: isFixed ? "0" : "auto",
        right: isFixed ? "0" : "auto",
      }}
    >
      <a
        href="#"
        className="blink-red-yellow text-decoration-underline mt-2 mb-2"
        onClick={(e) => e.preventDefault()}
        style={{ cursor: 'default' }}
      >
        <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
        Teenpatti Joker 20-20
      </a>
      <div className="ps">
        <div className="sidebar-right-inner">
          {sportList.match_id &&
            sportList.isTv == "1" &&
            sportList.isPlay == "1" && (
              <div className="sidebar-box">
                <div className="card-header" onClick={toggleTV}>
                  <h6 className="card-title">Live Match</h6>
                </div>
                <div
                  className={`tv-container collapse position-relative ${
                    isTVVisible ? "show" : ""
                  }`}
                  align="center"
                >
                  <div
                    className="loader1 loderTV"
                    style={{ display: isTVVisible ? "block" : "none" }}
                  >
                    {sportList.match_id && (
                      <iframe
                        className="video-iframe"
                        width="100%"
                        height="100%"
                        autoplay
                        src={`${import.meta.env.VITE_LIVE_STREAM_URL}/${sportList.match_id}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          {/* Place Bet Section - Desktop Sidebar */}
          {popupDisplay && !isMobileDevice && !isAdminRoute() && (
            <div className="sidebar-box place-bet-container">
              <div className="sidebar-title">
                <h4>Place Bet</h4>
              </div>
              <div className={`place-bet-box position-relative ${backOrLay}`}>
                {hideLoading && (
                  <div id="loader-section">
                    <div id="load-inner">
                      <i className="fa fa-spinner fa-spin"></i>
                    </div>
                  </div>
                )}
                <div className="place-bet-box-header">
                  <div className="place-bet-for">(Bet for)</div>
                  <div className="place-bet-odds">Odds</div>
                  <div className="place-bet-stake">Stake</div>
                  <div className="place-bet-profit">Profit</div>
                </div>
                <div className="place-bet-box-body">
                  <div className="place-bet-for">
                    <span>{cashoutTeam || teamname.current}</span>
                  </div>
                  <div className="place-bet-odds">
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={odds || ""}
                    />
                    <div className="spinner-buttons input-group-btn btn-group-vertical">
                      <button
                        className="btn-default"
                        onClick={() => handleOddsChange("increase")}
                        title="Increase odds by 0.01"
                      >
                        <i className="fa fa-angle-up"></i>
                      </button>
                      <button
                        className="btn-default"
                        onClick={() => handleOddsChange("decrease")}
                        title="Decrease odds by 0.01"
                      >
                        <i className="fa fa-angle-down"></i>
                      </button>
                    </div>
                  </div>
                  <div className="place-bet-stake">
                    <input
                      type="number"
                      className="form-control"
                      ref={stakeValue}
                      onChange={handleStakeChange}
                      onBlur={handleStakeChange}
                      onInput={handleStakeChange}
                    />
                  </div>
                  <div className="place-bet-profit">
                    {betType === "ODDS" ||
                    betType === "BOOKMAKER" ||
                    betType === "BOOKMAKER2" ||
                    betType === "TIED_MATCH" ||
                    betType === "cup"
                      ? parseFloat(profit.current || 0).toFixed(2)
                      : 0}
                  </div>
                </div>
                <div className="place-bet-buttons">
                  {Object.values(stakeValues).map((value, index) => (
                    <button
                      key={index}
                      className="btn btn-place-bet"
                      onClick={() =>
                        handleStakeChange(
                          { target: { value: value.val } },
                          null,
                          true
                        )
                      }
                    >
                      +{getSize(value.label, true)}
                    </button>
                  ))}
                </div>
                <div className="place-bet-action-buttons">
                  <button
                    onClick={() => clearAllSelection()}
                    type="button"
                    className="btn btn-link"
                  >
                    clear
                  </button>
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={() => {setStakeShowModal(true)

                        dispatch(setIsSubmitDisabled(true))
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={resetAll} className="btn btn-danger">
                    Reset
                  </button>
                  <button
                    className="btn btn-success"
                    type="button"
                    disabled={isSubmitDisabled}
                    onClick={placeBet}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <StakeModal
                show={stakeshowModal}
                handleClose={() => setStakeShowModal(false)}
              />
            </div>
          )}

          {/* Mobile Modal Version of Place Bet */}
          <Modal
            show={popupDisplay && isMobileDevice}
            onHide={() => setPopupDisplay(false)}
            dialogClassName="modal-top"
          >
            <Modal.Header closeButton>
              <Modal.Title className="h4">Place Bet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className={`place-bet-modal ${backOrLay}`}>
                {hideLoading && (
                  <div id="loader-section">
                    <div id="load-inner">
                      <i className="fa fa-spinner fa-spin"></i>
                    </div>
                  </div>
                )}
                <div className="row row5">
                  <div className="col-6">
                    <b>{cashoutTeam || teamname.current}</b>
                  </div>
                  <div className="col-6 text-end">
                    <span>
                      Profit:{" "}
                      {betType === "ODDS" ||
                      betType === "BOOKMAKER" ||
                      betType === "BOOKMAKER2" ||
                      betType === "TIED_MATCH"
                        ? profit.current
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="odd-stake-box">
                  <div className="row row5 mt-1">
                    <div className="col-6 text-center">Amount</div>
                    <div className="col-6 text-center">Odds</div>
                  </div>
                  <div className="row row5 mt-1">
                    <div className="col-6">
                      <input
                        type="number"
                        className="stakeinput w-100"
                        ref={stakeValue}
                        onChange={handleStakeChange}
                      />
                    </div>
                    <div className="col-6">
                      <div className="float-end">
                        <button
                          className="stakeactionminus btn"
                          onClick={() => handleOddsChange("decrease")}
                        >
                          <span className="fa fa-minus"></span>
                        </button>
                        <input
                          type="text"
                          className="stakeinput"
                          disabled
                          value={odds || ""}
                        />
                        <button
                          className="stakeactionminus btn"
                          onClick={() => handleOddsChange("increase")}
                        >
                          <span className="fa fa-plus"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="place-bet-buttons mt-2">
                  {Object.values(stakeValues).map((value, index) => (
                    <button
                      key={index}
                      className="btn btn-place-bet"
                      onClick={() =>
                        handleStakeChange(
                          { target: { value: value.val } },
                          null,
                          true
                        )
                      }
                    >
                      +{getSize(value.label, true)}
                    </button>
                  ))}
                </div>
                <div className="mt-1 place-bet-btn-box">
                  <button
                    className="btn btn-link"
                    onClick={() => {clearAllSelection()

                        dispatch(setIsSubmitDisabled(true))
                    }}
                  >
                    clear
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => {setStakeShowModal(true)

                        dispatch(setIsSubmitDisabled(true))
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={resetAll}>
                    Reset
                  </button>
                  <button
                    className="btn btn-success"
                    disabled={isSubmitDisabled}
                    onClick={placeBet}
                  >
                    Place Bet
                  </button>
                </div>
                <div className="odds-count mt-1">
                  {placingBets &&
                    Object.keys(placingBets).length > 0 &&
                    Object.keys(placingBets).map((marketType, index) =>
                      Object.keys(placingBets[marketType]).map(
                        (teamName, teamIndex) => (
                          <div
                            key={`${index}-${teamIndex}`}
                            className="row row5 mt-2"
                          >
                            <div className="col-6">
                              <span>{teamName}</span>
                            </div>
                            <div className="col-3 text-center">
                              {/* Additional data can be added here */}
                            </div>
                            <div className="col-3 text-end">
                              <span
                                className={
                                  placingBets[marketType][teamName] >= 0
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {placingBets[marketType][teamName]}
                              </span>
                            </div>
                          </div>
                        )
                      )
                    )}
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* Cricket Scoreboard - Admin Only */}
          {isAdminRoute() && scoreboardData && (
            <div className="sidebar-box cricket-scoreboard-container">
              <div className="sidebar-title">
                <h4>Cricket Scoreboard</h4>
              </div>
              <CricketScoreboard data={scoreboardData} />
            </div>
          )}

          {/* My Bet Section */}
          <div className="sidebar-box my-bet-container">
            <div className="sidebar-title">
              <h4>My Bet</h4>
            </div>
            <div className="my-bets">
              <div className="table-responsive w-100">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Matched Bet</th>
                      <th className="text-end">Odds</th>
                      <th className="text-end">Stake</th>
                      {isAdminRoute() && <th className="text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {myBetModel.length > 0 &&
                      myBetModel.map((data, index) => {
                        const className =
                          data.bet_side === "LAY" && data.type !== "ODDEVEN"
                            ? "lay"
                            : "back";
                        return (
                          <tr key={index} className={className}>
                            {data.type === "FANCY_SESSION" ||
                            data.type === "OVER_BY_OVER" ? (
                              <td>
                                {data.team_name} / {data.bet_oddsk}
                              </td>
                            ) : (
                              <td>{data.team_name} </td>
                            )}
                            <td className="text-end">{data.bet_odds}</td>
                            <td className="text-end">{data.bet_amount}</td>
                            {isAdminRoute() && (
                              <td className="text-center">
                                {data.is_deleted === 1 ? (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => undoBet(
                                      data.id || data.bet_id,
                                      () => {
                                        // Success callback - refresh bet list
                                        if (getBetListData) {
                                          getBetListData();
                                        }
                                      },
                                      (errorMessage) => {
                                        console.error("Restore bet error:", errorMessage);
                                      }
                                    )}
                                    title="Restore bet"
                                  >
                                    <i className="fa fa-undo"></i>
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteBet(
                                      data.id || data.bet_id,
                                      () => {
                                        // Success callback - refresh bet list
                                        if (getBetListData) {
                                          getBetListData();
                                        }
                                      },
                                      (errorMessage) => {
                                        console.error("Delete bet error:", errorMessage);
                                      }
                                    )}
                                    title="Delete bet"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBarSports;
