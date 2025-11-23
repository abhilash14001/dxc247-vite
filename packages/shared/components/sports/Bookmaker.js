import React, {
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getSize,
  organiseOdds,
  getExByColor,
  handleShowRules,
  generateBackAndLayFunction,
  handleCashoutLogic,
  exposureCheck,
} from "@dxc247/shared/utils/Constants";
import { getActiveBets } from "@dxc247/shared/utils/betUtils";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

function Bookmaker({  
  isAdmin,
  ar_sectionData,
  allTeamName = {},
  sportList,
  oddsChange,
  setBetOddValue,
  setbackOrLay,
  teamNames,
  setDefaultTeamName,
  teamNameCurrentBets = {},
  setPopupDisplay,
  bookmakerTeamData,
  placingBets = [],
  setMaxValue = null,
  setMinValue = null,
}) {
  const {
    runnerRowDefault,
    rootClassDefault,
    setBetType,
    setBetTypeFromArray,
    loss,
    profit,
    profitData,
    stakeValue,
    betType, // Add this to see current state
  } = useContext(SportsContext);

  // Redux hook for setting cashout team
  const { setTeam, clearTeam } = useSetCashoutTeam();

  const [hasActiveBets, setHasActiveBets] = useState(false);

  const exposure = exposureCheck();
  // Check for active bets when component mounts
  useEffect(() => {
    const checkActiveBets = async () => {
      try {
        const matchId =
          sportList?.match_id || window.location.pathname.split("/").pop();
        if (matchId) {
          const activeBets = await getActiveBets(matchId, "BOOKMAKER");
          
          setHasActiveBets(activeBets && activeBets.length > 0);
        }
      } catch (error) {
        console.error("Error checking active bets:", error);
        setHasActiveBets(false);
      }
    };

    checkActiveBets();
  }, [sportList?.match_id, exposure]);

  // Add cashout function for Bookmaker
  const handleCashout = async () => {
    setBetOddValue(0);

    const success = await handleCashoutLogic({
      currentMarketData: ar_sectionData?.bookmaker?.section || [],
      matchId: sportList?.match_id || window.location.pathname.split("/").pop(),
      betType: "BOOKMAKER",
      getActiveBets,
      setBetType,
      setBetTypeFromArray,
      setBetOddValue,
      setbackOrLay,
      setTeam, // Using Redux setTeam directly
      setDefaultTeamName,
      stakeValue,
      setPopupDisplay,
      
      teamNameCurrentBets,
      runnerRowDefault,
      
      defaultBetType: "BOOKMAKER",
    });

    if (!success) {
      console.error("Cashout operation failed");
    } else {
    }
  };

  if (!teamNames.current["BOOKMAKER"]) {
    teamNames.current["BOOKMAKER"] = []; // Initialize 'BOOKMAKER' as an empty array
  }
  // Memoize bookmaker data

  const bookmakerData = useMemo(
    () => ar_sectionData?.bookmaker,
    [ar_sectionData]
  );
  const sections = bookmakerData?.section || [];
  // Check if there are 3 teams - if so, hide cashout option
  const hasThreeTeams = useMemo(() => sections.length === 3, [sections]);

  // Determine if any section (runner) is ACTIVE (not suspended)
  const hasAnyActiveSection = useMemo(() => {
    if (!sections || sections.length === 0) return false;
    return sections.every((s) => s?.gstatus && s.gstatus == "SUSPENDED");
  }, [sections]);

  useEffect(() => {
    if (setMaxValue !== null && bookmakerData?.max) {
      setMaxValue((prevState) => {
        return { ...prevState, BOOKMAKER: bookmakerData?.max };
      });
      if (setMinValue !== null) {
        setMinValue((prevState) => {
          return { ...prevState, BOOKMAKER: bookmakerData?.min ?? 100 };
        });
      }
    }

    // eslint-disable-next-line
  }, [bookmakerData?.max]);

  const debouncers = {};

  const updateOdds = (backlay, odds) => {
    if (oddsChange.current[backlay] !== odds) {
      // Clear the previous setTimeout
      if (debouncers[backlay]) {
        clearTimeout(debouncers[backlay]);
      }

      debouncers[backlay] = setTimeout(() => {
        oddsChange.current[backlay] = odds;
        delete debouncers[backlay]; // clear debouncer after execution
      }, 100);
    }
  };

  // Common function to render odds
  const renderOdds = useCallback(
    (oddsArr, key11, teamName, runnerRow, tot) => {
      return (
        <>
          {/* Back Odds */}
          {(oddsArr.back?.length === 1
            ? oddsArr.back
            : oddsArr.back?.slice().reverse()
          ).map((back, b_key) => {
            const reverseKey = oddsArr.back.length - 1 - b_key;

            const backFunction = generateBackAndLayFunction(
              tot,
              oddsArr,
              "back",
              teamName,
              runnerRow,
              key11,
              "BOOKMAKER",
              setBetOddValue,
              setbackOrLay,
              teamNames,
              setPopupDisplay,
              setDefaultTeamName,
              runnerRowDefault,
              rootClassDefault,
              setBetType,
              null,
              setBetTypeFromArray,
              "bookmaker",
              undefined,
              undefined,
              clearTeam,
              stakeValue
            );
            const value_price = back?.odds || "-";
            const value_size = tot === 0 ? "" : getSize(back?.size || "");

            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
            if (
              oddsChange.current[`bookmakerback${key11}${b_key}`] === undefined
            ) {
              oddsChange.current[`bookmakerback${key11}${b_key}`] = value_price;
            } else if (
              oddsChange.current[`bookmakerback${key11}${b_key}`] !==
              value_price
            ) {
              updateOdds(`bookmakerback${key11}${b_key}`, value_price);
            }

            const backClass =
              b_key === 0 ? "back" : b_key === 1 ? "back1" : "back2";
            return (
              <div
                key={b_key}
                className={`market-odd-box ${backClass} ${
                  tot !== 0 &&
                  oddsChange.current[`bookmakerback${key11}${b_key}`] !==
                    value_price &&
                  oddsChange.current[`bookmakerback${key11}${b_key}`] !== ""
                    ? "blink"
                    : ""
                }`}
                onClick={backFunction[b_key]}
              >
                <span className="market-odd">{value_price}</span>
                <span className="market-volume">{value_size}</span>
              </div>
            );
          })}

          {/* Lay Odds */}
          {oddsArr.lay?.map((lay, l_key) => {
            const value_price = lay?.odds || "-";
            const value_size = tot === 0 ? "" : getSize(lay?.size || "");

            const layFunction = generateBackAndLayFunction(
              tot,
              oddsArr,
              "lay",
              teamName,
              runnerRow,
              l_key,
              "BOOKMAKER",
              setBetOddValue,
              setbackOrLay,
              teamNames,
              setPopupDisplay,
              setDefaultTeamName,
              runnerRowDefault,
              rootClassDefault,
              setBetType,
              null,
              setBetTypeFromArray,
              "bookmaker",
              undefined,
              undefined,
              clearTeam,
              stakeValue
            );

            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
            if (
              oddsChange.current[`bookmakerlay${key11}${l_key}`] === undefined
            ) {
              oddsChange.current[`bookmakerlay${key11}${l_key}`] = value_price;
            } else if (
              oddsChange.current[`bookmakerlay${key11}${l_key}`] !== value_price
            ) {
              // Update odds in oddsChange
              updateOdds(`bookmakerlay${key11}${l_key}`, value_price);
            }

            const layClass =
              l_key === 0 ? "lay" : l_key === 1 ? "lay1" : "lay2";
            return (
              <div
                key={l_key}
                className={`market-odd-box ${layClass} checkdataval ${
                  oddsChange.current[`bookmakerlay${key11}${l_key}`] !==
                    value_price &&
                  oddsChange.current[`bookmakerlay${key11}${l_key}`] !== ""
                    ? "blink"
                    : ""
                }`}
                onClick={layFunction[l_key]}
              >
                <span className="market-odd">{value_price}</span>
                <span className="market-volume">{value_size}</span>
              </div>
            );
          })}
        </>
      );
    },
    [
      oddsChange,
      setBetOddValue,
      setbackOrLay,
      teamNames,
      setPopupDisplay,
      setDefaultTeamName,
      runnerRowDefault,
      rootClassDefault,
      setBetType,
    ]
  );

  return (
    <>
      {bookmakerData && (
        <div
          className={`game-market ${
            sections && sections.length > 0 && sections[0]?.odds && Array.isArray(sections[0].odds) && sections[0].odds.length === 2
              ? "market-2"
              : "market-4 width70"
          }`}
        >
          <div className="market-title">
            <span>{bookmakerData?.mname || "Bookmaker"}</span>
            {!isAdmin && !hasThreeTeams && (
            <button
              className="btn btn-success btn-sm"
              onClick={handleCashout}
              disabled={!hasActiveBets}
              title={
                !hasActiveBets
                  ? "No active bets to cashout"
                  : "Click to cashout active bets"
              }
            >
              Cashout
            </button>
            )}
          </div>
          <div className="market-header">
            <div className="market-nation-detail">
              <span className="market-nation-name">
                Min: {bookmakerData.min}&nbsp; Max:{" "}
                {getSize(bookmakerData.max, true)}
              </span>
             
            </div>
            
            {sections &&
              sections[0]?.odds && sections[0].odds &&
              sections[0].odds.length > 2 && (
                <>
                  <div className="market-odd-box no-border d-none d-md-block"></div>
                  <div className="market-odd-box no-border d-none d-md-block"></div>
                </>
              )}

            <div className="market-odd-box back">
              <b>Back</b>
            </div>
            <div className="market-odd-box lay">
              <b>Lay</b>
            </div>
          </div>
          <div
            className={`market-body ${
              (
                (bookmakerData?.status === "SUSPENDED") ||
                sportList.match_suspend_bookmaker === 1 ||
                sportList.match_suspend === 1
              ) && !hasAnyActiveSection
                ? ""
                : ""
            }`}
            data-title={
              (
                (bookmakerData?.status === "SUSPENDED") ||
                sportList.match_suspend_bookmaker === 1 ||
                sportList.match_suspend === 1
              ) && !hasAnyActiveSection
                ? "SUSPENDED"
                : ""
            }
          >
            {sections.map((oddsArr, key) => {
              let isSuspended = "",
                isSuspendedClass = "";
              let tot = 1;

              // Check if suspended
              if (
                oddsArr.gstatus === "SUSPENDED" ||
                sportList.match_suspend_bookmaker === 1 ||
                sportList.match_suspend === 1
              ) {
                tot = 0;
                isSuspended = "SUSPENDED";
                isSuspendedClass = "suspended";
              }

              const teamName = oddsArr.nat.trim() || "";
              teamNames.current["BOOKMAKER"][teamName] = teamName;

              const teamEx = bookmakerTeamData?.[teamName] ?? null;

              if (!allTeamName.current["BOOKMAKER"]) {
                allTeamName.current["BOOKMAKER"] = [];
              }
              if (!allTeamName.current["BOOKMAKER"].includes(teamName))
                allTeamName.current["BOOKMAKER"].push(teamName);
              const runnerRow = `table-row-${sportList.match_id}-${key}`;

              
              // Organize odds
              const organizedOdds = organiseOdds(oddsArr);
              const n_key = `${sportList.match_id}-${key}`;
              if (!teamNameCurrentBets.current?.["BOOKMAKER"]) {
                teamNameCurrentBets.current["BOOKMAKER"] = [];
                teamNameCurrentBets.current["BOOKMAKER"][teamName] = "";
              }

              teamNameCurrentBets.current["BOOKMAKER"][teamName] = teamEx;
              return (
                <div
                  key={key}
                  className={`market-row ${
                    isSuspendedClass ? "suspended-row" : ""
                  }`}
                  data-title={isSuspended || "ACTIVE"}
                >
                  <div className="market-nation-detail">
                    <span className="market-nation-name">{teamName}</span>
                    <div className="market-nation-book">
                      {getExByColor(teamEx)}
                    </div>
                    <div className="market-nation-book">
                      {placingBets?.["BOOKMAKER"]?.[teamName] && (
                        <span
                          className={`market-live-book d-none d-xl-block ${
                            placingBets["BOOKMAKER"][teamName] < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {placingBets["BOOKMAKER"][teamName] < 0
                            ? placingBets["BOOKMAKER"][
                                teamName
                              ].toLocaleString()
                            : `${placingBets["BOOKMAKER"][
                                teamName
                              ].toLocaleString()}`}
                        </span>
                      )}
                    </div>
                  </div>
                  {renderOdds(organizedOdds, n_key, teamName, runnerRow, tot)}
                </div>
              );
            })}

           
          </div>
          {bookmakerData.rem && (
              <div className="market-row">
                <marquee className="market-remark">{bookmakerData.rem}</marquee>
              </div>
            )}
        </div>
      )}
    </>
  );
}

export default Bookmaker;
