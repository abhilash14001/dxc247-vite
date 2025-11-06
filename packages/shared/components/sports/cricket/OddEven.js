import React, { useContext, useEffect, useRef, useMemo } from "react";
import axiosFetch, {
  chunkArray,
  generateBackAndLayFunction,
  getSize,
  handleShowRules,
  useFancyHideStatus,
  exposureCheck,
} from "@dxc247/shared/utils/Constants";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";

const OddEven = ({
  gameData,
  model,
  setPopupDisplay,
  setDefaultTeamName,
  setBetOddValue,
  setbackOrLay,
  setMaxValue,
  setMinValue,
}) => {
  const fancyHideStatus = useFancyHideStatus(model, gameData);
  const {
    runnerRowDefault,
    rootClassDefault,
    setBetType,
    oddsk,
    setBetTypeFromArray,
  } = useContext(SportsContext);
  const betEvenCalculation = useRef([]);

  // Move hooks before early return
  const mainValue = gameData?.["oddeven"];
  const ar_sectionData = mainValue?.section;
  
  const maxValue = useMemo(() => ar_sectionData?.[0]?.['maxb'] || mainValue?.max, [ar_sectionData, mainValue]);
  
  useEffect(() => {
    if (setMaxValue !== null) {
      setMaxValue((prevState) => {
        return {...prevState, 'ODDEVEN': maxValue}
      })
    }

    if (setMinValue !== null) {
      setMinValue((prevState) => {
        
        return {...prevState, 'ODDEVEN': mainValue?.min ?? 100}
      })
    }
    //eslint-disable-next-line
  }, [maxValue]);

  const calculateBetevEn = () => {
    const section = gameData?.["oddeven"]?.section;
    if (!section || section.length === 0) return;

    // Map through section to collect all teamnames with " - ODD" suffix
    const teamnames = section.map((oddsArr) => `${oddsArr.nat} - ODD`);

    // Send single API request with all teamnames
    axiosFetch("calculate_bet_odd_even", "post", null, {
      sport_id: model.id,
      match_id: model.match_id,
      teamnames: teamnames,
    })
      .then((result) => {
        
        // Process the response and populate betEvenCalculation.current
        if (result && result?.data?.data) {
          section.forEach((oddsArr, index) => {
            const teamName = oddsArr.nat;
            // Handle different response structures:
            // 1. Object keyed by base teamname (e.g., "Team A")
            // 2. Object keyed by full teamname with suffix (e.g., "Team A - ODD")
            // 3. Array in same order as request
            const teamData = result.data.data[teamName] || result.data.data[teamName + " - ODD"] || result.data.data[index];
            if (teamData) {
              
              betEvenCalculation.current[teamName] = teamData;
            }
          });
        }
        else if (result && result.data) {
          section.forEach((oddsArr, index) => {
            const teamName = oddsArr.nat;
            // Handle different response structures:
            // 1. Object keyed by base teamname (e.g., "Team A")
            // 2. Object keyed by full teamname with suffix (e.g., "Team A - ODD")
            // 3. Array in same order as request
            const teamData = result.data[teamName] || result.data[teamName + " - ODD"] || result.data[index];
            if (teamData) {
              
              betEvenCalculation.current[teamName] = teamData;
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error calculating bet odd/even:", error);
      });
  };

  useEffect(() => {
    
    if (Object.keys(model).length > 0) {
      calculateBetevEn();
    }
    // eslint-disable-next-line
  }, [Object.keys(model).length, exposureCheck(), gameData?.["oddeven"]?.section.length]);

  // Early return after all hooks
  if (!gameData || !gameData?.["oddeven"] || !mainValue || !ar_sectionData) return null;

  return (
    <>
      {[gameData?.["oddeven"]].map((mainValue, mainKey) => {
        if (!mainValue.status) return null;

        let remark = "";
        let minValue = model.fancy_min_limit;
        let maxValue = model.fancy_max_limit;

        if (mainValue.min) minValue = mainValue.min;
        if (mainValue.max) maxValue = mainValue.max;

        minValue = getSize(minValue, true);
        maxValue = getSize(maxValue, true);

        const sectionData = mainValue.section || [];

        return (
          <div className="game-market market-6" key={mainKey}>
            <div className="market-title">
              <span>{mainValue.mname}</span>
              <span
                className="m-r-5 game-rules-icon"
                onClick={() => handleShowRules("Fancyrule")}
              >
                <span>
                  <i className="fa fa-info-circle float-right"></i>
                </span>
              </span>
            </div>
            <div className="market-body" data-title="OPEN">
              <div className="row row10">
                {chunkArray(sectionData, 2).map((arr, valkey) => (
                  <React.Fragment key={valkey}>
                    {arr.map((oddsArr, key) => {
                      const teamName = oddsArr.nat.trim();
                      if (
                        fancyHideStatus[oddsArr.sid] ||
                        !teamName ||
                        teamName.trim() === ""
                      ) {
                        return null;
                      }

                      const teamNameArrs = {};
                      if (teamNameArrs[teamName.trim()]) return null;
                      teamNameArrs[teamName.trim()] = teamName;

                      let isSuspendedClass = "";
                      let isSuspended = "";
                      let back = 0,
                        lay = 0,
                        backk = 0,
                        layk = 0;
                      oddsArr["odd"] = [];
                      oddsArr["even"] = [];

                      if (oddsArr.odds) {
                        oddsArr.odds.forEach((aValue) => {
                          if (aValue.otype === "back") {
                            oddsArr["odd"].push(aValue);
                            back = aValue.odds;
                            backk = aValue.size;
                          }
                          if (aValue.otype === "lay") {
                            oddsArr["even"].push(aValue);
                            back = aValue.odds;

                            lay = aValue.odds;
                            layk = aValue.size;
                          }
                        });
                      }

                      let total = parseFloat(back) + parseFloat(lay);
                      if (
                        model.match_suspend_fancy === 1 ||
                        model.match_suspend === 1
                      )
                        total = 0;

                      const runnerRow = 0;
                      const teamNames = `${teamName} - Odd`;
                      const teamNameLay = `${teamName} - Even`;
                      const gstatus = oddsArr.gstatus?.toUpperCase() || "";

                      if (
                        [
                          "SUSPENDED",
                          "BALL_RUNNING",
                          "MATCH-SUSPENDED",
                        ].includes(gstatus)
                      )
                        total = 0;

                      if (total === 0) {
                        isSuspended = gstatus || "SUSPENDED";
                        isSuspendedClass = "suspended suspend_box";
                      }

                      const nKey = `${key}`;
                      let backFunctionSes = generateBackAndLayFunction(
                        total,
                        oddsArr,
                        "odd",
                        teamNames,
                        runnerRow,
                        nKey,
                        "ODDEVEN",
                        setBetOddValue,
                        setbackOrLay,
                        [],
                        setPopupDisplay,
                        setDefaultTeamName,
                        runnerRowDefault,
                        rootClassDefault,
                        setBetType,
                        oddsk,
                        setBetTypeFromArray,
                        "oddeven",
                        back,
                        backk
                      );

                      const layFunctionSes = generateBackAndLayFunction(
                        total,
                        oddsArr,
                        "even",
                        teamNameLay,
                        runnerRow,
                        nKey,
                        "ODDEVEN",
                        setBetOddValue,
                        setbackOrLay,
                        [],
                        setPopupDisplay,
                        setDefaultTeamName,
                        runnerRowDefault,
                        rootClassDefault,
                        setBetType,
                        oddsk,
                        setBetTypeFromArray,
                        "oddeven",
                        lay,
                        layk
                      );

                      if (back > 0) {
                        back = parseFloat(back);
                      } else {
                        back = lay;
                        backFunctionSes = layFunctionSes;
                      }

                      if (backk > 0) {
                        backk = parseFloat(backk);
                      } else {
                        backk = layk;
                      }

                      let getFancySessionValue =
                        betEvenCalculation.current?.[teamName] != 0 ? 
                          (typeof betEvenCalculation.current?.[teamName] === 'object' ? 
                            betEvenCalculation.current?.[teamName]?.data || betEvenCalculation.current?.[teamName] : 
                            betEvenCalculation.current?.[teamName]) : "";

                      if (oddsArr.min) minValue = oddsArr.min;
                      if (oddsArr.max) maxValue = oddsArr.max;

                      minValue = getSize(minValue, true);
                      maxValue = getSize(maxValue, true);
                      if (oddsArr.rem) remark = oddsArr.rem;

                      return (
                        <div className="col-md-6" key={key}>
                          <div
                            className={`fancy-market ${
                              isSuspendedClass ? "suspended-row" : ""
                            }`}
                            data-title={isSuspended || ""}
                          >
                            <div className="market-row">
                              <div className="market-nation-detail">
                                <span className="market-nation-name">
                                  {teamName}
                                </span>
                                <div class="market-nation-book">
                                  <span class={`market-book text-danger ${getFancySessionValue < 0 ? 'text-danger' : 'text-success'} `}>
                                    {getFancySessionValue}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="market-odd-box back"
                                onClick={
                                  total > 0 && backFunctionSes
                                    ? Array.isArray(backFunctionSes)
                                      ? backFunctionSes[0]
                                      : backFunctionSes
                                    : null
                                }
                              >
                                <span className="market-odd">{back}</span>
                                <span className="market-volume">
                                  {total === 0 ? '' : getSize(backk, false)}
                                </span>
                              </div>
                              <div
                                className="market-odd-box back"
                                onClick={
                                  total > 0 && layFunctionSes
                                    ? Array.isArray(layFunctionSes)
                                      ? layFunctionSes[0]
                                      : layFunctionSes
                                    : null
                                }
                              >
                                <span className="market-odd">{lay}</span>
                                <span className="market-volume">
                                  {total === 0 ? '' : getSize(parseFloat(layk), false)}
                                </span>
                              </div>
                              <div className="fancy-min-max-box">
                                <div className="fancy-min-max">
                                  <span className="w-100 d-block">
                                    Min: {oddsArr.min}
                                  </span>
                                  <span className="w-100 d-block">
                                    Max: {getSize(oddsArr.max, true)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {remark && (
                              <div className="market-row">
                                {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                                <marquee className="market-remark">
                                  {remark}
                                </marquee>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OddEven;
