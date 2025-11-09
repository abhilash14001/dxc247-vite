import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import RulesCards from "./RulesCards";
import { useParams } from "react-router-dom";
import { SportsContext } from "../../contexts/SportsContext";
import { CasinoContext } from "../../contexts/CasinoContext";
import { useSelector, useDispatch } from "react-redux";
import { resetSelectQuestions, setSelectQuestions } from "../../store/slices/kbcSlice";
import { setIsSubmitDisabled } from "../../store/slices/casinoSlice";
import { isAdminRoute } from "../../utils/Constants";

import MatchedBetTable from "../casino/MatchedBetTable";
import { useStake } from "../../contexts/StakeContext";
import { useCardSelection } from "../../hooks/useCardSelection";
import { Modal, Button } from "react-bootstrap";
import StakeModal from "../../components/EditStakeModal";
import { useDeleteMatchedBet } from "../../utils/Constants";
import useStakeValuesCheck from "../../hooks/useStakeValuesCheck";

const RightSideBarCasino = ({
  sportList,
  myBetModel,
  hideLoading,
  teamname,
  isBack,
  gamename,
  placeBet,
  submitButtonDisable,
  setOdds,
  handleStakeChange,
  odds,
  stakeValue,
  setSubmitButton = null,
  refreshBets = null,
  getMinMaxLimits = null,
}) => {
  const { match_id } = useParams();
  const dispatch = useDispatch();
  const { deleteBet, undoBet } = useDeleteMatchedBet();
  const ourroulleteRates = useSelector((state) => state.roulette?.ourroulleteRates || {Single: 0, Split: 0, Street: 0, Corner: 0});
  const { popupDisplayForDesktop, setPopupDisplayForDesktop } =
    useContext(SportsContext);
  const { stakeValues } = useStake();
  
  // Get casino state from Redux
  const {isSubmitDisabled} = useSelector((state) => state.casino);
  
  // Use the custom hook for stake values checking
  useStakeValuesCheck();

  const {
    showMobilePopup,
    setSelectedTeenUniqueCards,
    selectedJoker,
    rouletteStatistics,
    roundId,
    shouldBlinkForRoulette,
    setShouldBlinkForRoulette,
  } = useContext(CasinoContext);
  const statisticsData = useSelector((state) => state.roulette?.statisticsData || {});

  const { resetCardSelection, currentBetType } = useCardSelection();

  // Dynamic mobile detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // State for stake modal
  const [stakeshowModal, setStakeShowModal] = useState(false);

  // State for statistics blinking


  // Function to get current min/max limits
  const getCurrentLimits = () => {
    if (getMinMaxLimits && typeof getMinMaxLimits === "function") {
      return getMinMaxLimits();
    }
    return { min: 100, max: 100000 }; // Default fallback
  };

  // Function to format the range display
  const formatRange = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 100000) {
        return (num / 100000).toFixed(0) + "L";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }
      return num.toString();
    };

    return `${formatNumber(min)} to ${formatNumber(max)}`;
  };

  // Get current limits
  const currentLimits = getCurrentLimits();
  const rangeText = formatRange(
    currentLimits.min || 100,
    currentLimits.max || 100000
  );


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
  }, [showMobilePopup]);


  // Effect to handle blinking when round ID changes
  useEffect(() => {
    if (roundId && match_id.includes("roulette")) {
      // Trigger blinking when round ID changes

      // Stop blinking after 2 seconds
      const timeout = setTimeout(() => {
        alert("stop blinking");
        setShouldBlinkForRoulette(false);
      }, 2000);

      // Cleanup timeout on unmount or round ID change
      return () => {
        
        clearTimeout(timeout);
      };
    }
    
  }, [roundId, match_id]);

  const handleCurrentStakeValue = (value, increment = false) => {
    const newvalue = parseFloat(value) || 0;
    if(value !== ''){
      
      dispatch(setIsSubmitDisabled(false));
    }else{
      dispatch(setIsSubmitDisabled(true));
    }
    
    if (increment) {
      value = parseFloat(stakeValue.current.value || 0) + parseFloat(newvalue);
    }

    // Update Redux state
    

    if (typeof setSubmitButton === "function") {
      if (value === "") {
        setSubmitButton(true);
      } else {
        setSubmitButton(false);
      }
    }

    handleStakeChange(value);
  };

  const [isSticky, setIsSticky] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Add sticky class when scrolled down past the sidebar's original position
      if (scrollTop > 105) {
        // 100px buffer
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <StakeModal
        show={stakeshowModal}
        handleClose={() => {setStakeShowModal(false); dispatch(setIsSubmitDisabled(true));}}
      />
      <div
        id="sidebar-right"
        className={`right-sidebar casino-right-sidebar ${
          isSticky ? "sticky" : ""
        }`}
        ref={sidebarRef}
      >
        {gamename === "lottcard" && (
          <div className="lottery-buttons">
            <button className="btn btn-lottery">Repeat</button>
            <button className="btn btn-lottery">Clear</button>
            <button className="btn btn-lottery">Remove</button>
          </div>
        )}
        {!isAdminRoute() && popupDisplayForDesktop === true && !isMobileDevice && (
          <div className="sidebar-box place-bet-container">
            {hideLoading === false && <div className="loader1 loderBet"></div>}
            <div className="sidebar-title">
              <h4>Place Bet</h4>
              <span>Range: {rangeText}</span>
            </div>
            <div className={`place-bet-box ${isBack}`}>
              <div className="place-bet-box-header">
                <div className="place-bet-for">(Bet for)</div>
                <div className="place-bet-odds">Odds</div>
                <div className="place-bet-stake">Stake</div>
                <div className="place-bet-profit">Profit</div>
              </div>
              <div className="place-bet-box-body">
                <div className="place-bet-for">
                  {match_id !== "teenunique" && (
                    <i
                      className="fas fa-times text-danger me-1"
                      onClick={() => setPopupDisplayForDesktop(false)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  )}
                  {match_id === "teenunique" ? (
                    <div className="unique-teen20-place-balls">
                      {teamname?.current.map((card, index) => (
                        <img key={index} src={`/img/sequence/s${card}.png`} />
                      ))}
                    </div>
                  ) : match_id === "kbc" ? (
                    <div className="kbcbtesbox">
                      {Object.values(teamname?.current || {}).map((betName, index) => (
                        <div key={index} className="bet-box">
                          <span>{betName}</span>
                          <i 
                            className="float-right fas fa-times"
                            onClick={() => {
                              // Remove this bet from teamname.current
                              const updatedTeamname = { ...teamname.current };
                              const keyToRemove = Object.keys(teamname.current).find(key => teamname.current[key] === betName);
                              delete updatedTeamname[keyToRemove];
                              teamname.current = updatedTeamname;
                              
                              // Also remove from Redux state
                              // Note: This is a simplified approach - you might want to implement a more sophisticated removal
                              dispatch(resetSelectQuestions());
                              Object.values(updatedTeamname).forEach(team => {
                                dispatch(setSelectQuestions(team));
                              });
                              
                              // Force re-render by updating state
                              setPopupDisplayForDesktop(false);
                              setTimeout(() => setPopupDisplayForDesktop(true), 10);
                            }}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span id="ShowRunnderName">
                      {currentBetType
                        ? currentBetType + " " + teamname?.current
                        : teamname?.current}
                    </span>
                  )}
                </div>
                {match_id === "kbc" ? (
                  <div className="bet-input back-border">
                    <input
                      type="number"
                      className="form-control input-stake"
                      maxLength="10"
                      required
                      id="stakeValue"
                      ref={stakeValue}
                      onChange={(event) =>
                        handleCurrentStakeValue(event.target.value)
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div className="place-bet-odds">
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={odds}
                        id="ShowBetPrice"
                        maxLength="4"
                      />
                    </div>
                    <div className="place-bet-stake">
                      <input
                        type="number"
                        className="form-control"
                        maxLength="10"
                        required
                        id="stakeValue"
                        ref={stakeValue}
                        onChange={(event) =>
                          handleCurrentStakeValue(event.target.value)
                        }
                      />
                    </div>
                    <div className="place-bet-profit" id="profitData"></div>
                  </>
                )}
              </div>
              <div className="place-bet-buttons">
                {Object.entries(stakeValues).map(([index, value], i) => (
                  <button
                    key={i}
                    className="btn btn-place-bet"
                    value={value.val}
                    onClick={() => handleCurrentStakeValue(value.val, true)}
                  >
                    +{value.label}
                  </button>
                ))}
                <button
                  className="btn btn-sm btn-link text-dark flex-fill text-end"
                  onClick={() => handleCurrentStakeValue("")}
                >
                  clear
                </button>
              </div>
              <div className="place-bet-action-buttons">
                <div>
                  <button
                    className="btn btn-info"
                    onClick={() => setStakeShowModal(true)}
                  >
                    Edit
                  </button>
                </div>
                {match_id === "joker120" && (
                  <div className="joker-card">
                    <span>
                      <img
                        src={`${
                          selectedJoker
                            ? `/img/joker1/${selectedJoker}.png`
                            : "/img/joker1/14.png"
                        }`}
                        alt={`Joker ${selectedJoker}`}
                      />
                    </span>
                  </div>
                )}
                <div>
                  <button
                    className="btn btn-danger me-1"
                    onClick={() => {
                      if (match_id === "3cardj") {
                        resetCardSelection();
                      } else if (match_id === "teenunique") {
                        setSelectedTeenUniqueCards([]);
                      } else if (match_id === "kbc") {
                        // Reset KBC selections
                        teamname.current = {};
                        // Also reset Redux state
                        dispatch(resetSelectQuestions());
                      }
                      setPopupDisplayForDesktop(false);
                      if (typeof setSubmitButton === "function"){

                        setSubmitButton(true);
                        }
                      dispatch(setIsSubmitDisabled(true))
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-success"
                    disabled={isSubmitDisabled}
                    onClick={placeBet}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {match_id.includes("roulette") && !isAdminRoute() &&
          Object.keys(statisticsData).length > 0 && (
            <div className="sidebar-box my-bet-container roulette-rules">
              <div className="sidebar-title">
                <h4>Statistics</h4>
              </div>
              <div className="">
                <div className="roulette11-table">
                  {rouletteStatistics.map((row, rowIndex) => (
                    <div className="roulette11-table-row" key={rowIndex}>
                      {row.map((cell, cellIndex) => {
                        const key = Object.keys(cell)[0]; // e.g. "C1st12"
                        const label = cell[key]; // e.g. "1st12"
                        return (
                          <div
                            className="roulette11-table-cell"
                            key={cellIndex}
                          >
                            <span>{label}:</span>
                            <b
                              className={
                                shouldBlinkForRoulette ? "blink_me" : ""
                              }
                            >
                              {statisticsData[key] + "%" || "-"}
                            </b>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="sidebar-box my-bet-container">
          <div className="sidebar-title">
            <h4>My Bet</h4>
          </div>

          <div className="my-bets">
            <MatchedBetTable
              type={sportList?.match_id}
              mybetModel={myBetModel}
              isAdmin={isAdminRoute()}
              onDelete={async (data) => {
                await deleteBet(
                  data,
                  // Success callback
                  () => {
                    // Refresh the bet list
                    if (refreshBets) {
                      refreshBets();
                    }
                  },
                  // Error callback
                  (errorMessage) => {
                    console.error("Delete bet error:", errorMessage);
                  }
                );
              }}
              onUndo={async (data) => {
                await undoBet(
                  data,
                  // Success callback
                  () => {
                    // Refresh the bet list
                    if (refreshBets) {
                      refreshBets();
                    }
                  },
                  // Error callback
                  (errorMessage) => {
                    console.error("Restore bet error:", errorMessage);
                  }
                );
              }}
            />
          </div>
        </div>
        
        {match_id === "ourroullete" && (
          <div className="sidebar-box my-bet-container roulette-rules">
            <div className="sidebar-title">
              <h4>Rates</h4>
            </div>
            <div className="">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">Single</th>
                      <th className="text-center">Split</th>
                      <th className="text-center">Street</th>
                      <th className="text-center">Corner</th>
                    </tr>
                  </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">
                          <b>{ourroulleteRates.Single}</b>
                        </td>
                        <td className="text-center">
                          <b>{ourroulleteRates.Split}</b>
                        </td>
                        <td className="text-center">
                          <b>{ourroulleteRates.Street}</b>
                        </td>
                        <td className="text-center">
                          <b>{ourroulleteRates.Corner}</b>
                        </td>
                      </tr>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <RulesCards gamename={match_id} />

        {/* Mobile Modal Version of Place Bet */}
        <Modal
          show={!isAdminRoute() && popupDisplayForDesktop && isMobileDevice && showMobilePopup}
          onHide={() => setPopupDisplayForDesktop(false)}
          dialogClassName="modal-top"
        >
          <Modal.Header closeButton>
            <Modal.Title className="h4">Place Bet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={`place-bet-modal ${isBack}`}>
              <div className="row row5">
                <div className="col-6">
                  {match_id === "teenunique" ? (
                    <div className="unique-teen20-place-balls">
                      {teamname?.current.map((card, index) => (
                        <img key={index} src={`/img/sequence/s${card}.png`} />
                      ))}
                    </div>
                  ) : match_id === "joker120" ? (
                    <div className="joker-card">
                      <span>
                        <img
                          src={`/img/joker1/${selectedJoker}.png`}
                          alt={`Joker ${selectedJoker}`}
                        />
                      </span>
                    </div>
                  ) : (
                    <b>
                      {currentBetType
                        ? currentBetType + " " + teamname?.current
                        : teamname?.current}
                    </b>
                  )}
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
                      onChange={(event) =>
                        handleCurrentStakeValue(event.target.value)
                      }
                    />
                  </div>
                  <div className="col-6">
                    <div className="float-end">
                      <input
                        type="text"
                        className="stakeinput"
                        disabled
                        value={odds}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="place-bet-buttons mt-2">
                {Object.entries(stakeValues).map(([index, value], i) => (
                  <button
                    key={i}
                    className="btn btn-place-bet"
                    onClick={() => handleCurrentStakeValue(value.val, true)}
                  >
                    +{value.label}
                  </button>
                ))}
              </div>
              <div className="mt-1 place-bet-btn-box">
                <button
                  className="btn btn-link"
                  onClick={() => handleCurrentStakeValue("")}
                >
                  clear
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => setStakeShowModal(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (match_id === "3cardj") {
                      resetCardSelection();
                    }
                    setPopupDisplayForDesktop(false);
                    if (typeof setSubmitButton === "function"){

                      setSubmitButton(true);
                      }
                    dispatch(setIsSubmitDisabled(true))
                  }}
                >
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
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <b>
                  <span>Range: {rangeText}</span>
                </b>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default RightSideBarCasino;
