import React, { useContext, useMemo, useCallback, useEffect } from "react";
import {
  getSize,
  organiseOdds,
  generateBackAndLayFunction,
  dummyDataOdds,
  getExByColor
} from "@dxc247/shared/utils/Constants";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

function CPLCupBookmaker({
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
    setBetTypeFromArray,
    runnerRowDefault,
    rootClassDefault,
    setBetType,
    setGlobalMname,
    globalMname,
    stakeValue,
  } = useContext(SportsContext);
  const { clearTeam } = useSetCashoutTeam();

  // Use normalized key for internal references
  const normalizedKey = "cup";

  if (!teamNames.current[normalizedKey]) {
    teamNames.current[normalizedKey] = []; // Initialize 'CUP' as an empty array
  }
  // Memoize bookmaker data for CPL Cup 2025

  const bookmakerData = useMemo(() => {
    // Look for the "CUP" key (simplified)
    return ar_sectionData?.["cup"];
  }, [ar_sectionData]);

  useEffect(() => {
    if (bookmakerData?.mname && globalMname === "") {
      setGlobalMname(bookmakerData?.mname);
    }
  }, [bookmakerData?.mname]);

  const sections = bookmakerData?.section || [];

  // Determine if any section (runner) is ACTIVE (not suspended)
  const hasAnyActiveSection = useMemo(() => {
    if (!sections || sections.length === 0) return false;
    return sections.some((s) => s?.gstatus && s.gstatus !== "SUSPENDED");
  }, [sections]);

  useEffect(() => {
    if (setMaxValue !== null && bookmakerData?.max) {
      setMaxValue((prevState) => {
        return { ...prevState, [normalizedKey]: bookmakerData?.max };
      });
      if (setMinValue !== null) {
        setMinValue((prevState) => {
          return { ...prevState, [normalizedKey]: bookmakerData?.min ?? 100 };
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
          {oddsArr.back?.slice(0, 1).map((back, b_key) => {
            const backFunction = generateBackAndLayFunction(
              tot,
              oddsArr,
              "back",
              teamName,
              runnerRow,
              key11,
              "cup",
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
              "cup",
              undefined,
              undefined,
              clearTeam,
              stakeValue
            );
            const value_price = tot === 0 ? "-" : back?.odds || "-";
            const value_size =
              tot === 0 ? "" : getSize(back?.size || "", false);

            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
            if (
              oddsChange.current[`cplcupbookmakerback${key11}${b_key}`] ===
              undefined
            ) {
              oddsChange.current[`cplcupbookmakerback${key11}${b_key}`] =
                value_price;
            } else if (
              oddsChange.current[`cplcupbookmakerback${key11}${b_key}`] !==
              value_price
            ) {
              updateOdds(`cplcupbookmakerback${key11}${b_key}`, value_price);
            }

            return (
              <>
                <div
                  key={b_key}
                  className={`box-1 market-odd-box back float-left text-center ${
                    oddsChange.current[
                      `cplcupbookmakerback${key11}${b_key}`
                    ] !== value_price &&
                    oddsChange.current[
                      `cplcupbookmakerback${key11}${b_key}`
                    ] !== ""
                      ? "blink"
                      : ""
                  }`}
                  onClick={backFunction[0]}
                >
                  <span className="market-odd">{value_price}</span>
                  <span className="market-volume">{value_size}</span>
                </div>
              </>
            );
          })}

          {/* Lay Odds - Single Box */}
          {dummyDataOdds(oddsArr.lay)
            ?.slice(0, 1)
            .map((lay, l_key) => {
              const value_price = tot === 0 ? "-" : lay?.odds || "-";
              const value_size =
                tot === 0 ? "" : getSize(lay?.size || "", true);

              const layFunction = generateBackAndLayFunction(
                tot,
                oddsArr,
                "lay",
                teamName,
                runnerRow,
                l_key,
                "cup",
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
                "cup",
                undefined,
                undefined,
                clearTeam,
                stakeValue
              );

              // Initialize oddsChange if it doesn't exist to prevent initial yellow class
              if (
                oddsChange.current[`cplcupbookmakerlay${key11}${l_key}`] ===
                undefined
              ) {
                oddsChange.current[`cplcupbookmakerlay${key11}${l_key}`] =
                  value_price;
              } else if (
                oddsChange.current[`cplcupbookmakerlay${key11}${l_key}`] !==
                value_price
              ) {
                updateOdds(`cplcupbookmakerlay${key11}${l_key}`, value_price);
              }

              return (
                <div
                  key={l_key}
                  className={`box-1 market-odd-box lay float-left text-center checkdataval ${
                    oddsChange.current[`cplcupbookmakerlay${key11}${l_key}`] !==
                      value_price &&
                    oddsChange.current[`cplcupbookmakerlay${key11}${l_key}`] !==
                      ""
                      ? "blink"
                      : ""
                  }`}
                  onClick={layFunction[0]}
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
        <div className="game-market market-2">
          <div className="market-title">
            <span>{bookmakerData?.mname || "CUP"}</span>
          </div>
          <div className="market-header">
            <div className="market-nation-detail">
              <span className="market-nation-name">
                Min: {bookmakerData.min}&nbsp; Max:{" "}
                {getSize(bookmakerData.max, true)}
              </span>
            </div>
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
                ? "suspended-table"
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
                isSuspendedClass = "suspended-row";
              }

              const teamName = oddsArr.nat.trim() || "";
              teamNames.current[normalizedKey][teamName] = teamName;

              const teamEx = bookmakerTeamData?.[teamName] ?? 0;
              if (!allTeamName.current[normalizedKey]) {
                allTeamName.current[normalizedKey] = [];
              }
              if (!allTeamName.current[normalizedKey].includes(teamName))
                allTeamName.current[normalizedKey].push(teamName);
              const runnerRow = `table-row-${sportList.match_id}-${key}`;

              // Organize odds
              const organizedOdds = organiseOdds(oddsArr);
              const n_key = `${sportList.match_id}-${key}`;
              if (!teamNameCurrentBets.current?.[normalizedKey]) {
                teamNameCurrentBets.current[normalizedKey] = [];
                teamNameCurrentBets.current[normalizedKey][teamName] = "";
              }

              teamNameCurrentBets.current[normalizedKey][teamName] = teamEx;

              return (
                <div
                  key={key}
                  className={`market-row ${isSuspendedClass}`}
                  data-title={isSuspended}
                >
                  <div className="market-nation-detail">
                    <span className="market-nation-name">{teamName}</span>
                    <div className="market-nation-book">
                      <span className={`teamEx`}>
                        {getExByColor(teamEx, true)}
                      </span>
                      {placingBets[normalizedKey]?.[teamName] && (
                        <span
                          className={
                            placingBets[normalizedKey]?.[teamName] < 0
                              ? "market-live-book text-danger"
                              : "market-live-book text-success"
                          }
                        >
                          {placingBets[normalizedKey][teamName] % 1 !== 0 &&
                          placingBets[normalizedKey][teamName]
                            .toString()
                            .split(".")[1]?.length > 2
                            ? Math.round(
                                placingBets[normalizedKey][teamName] * 100
                              ) / 100
                            : placingBets[normalizedKey][teamName]}
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

export default CPLCupBookmaker;
