import React, {useContext, useState, useEffect, useMemo, useRef} from 'react';
import {
    chunkArray,
    generateBackAndLayFunction,
    getSize,
    handleShowRules, useFancyHideStatus
} from "@dxc247/shared/utils/Constants";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import FancyBetPopup from "./FancyBetPopup";
import {Link} from "react-router-dom";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

const OverByOver = ({
                        gameData,
                        model,
                        showCricketSessionBook,
                        setPopupDisplay, betPlaceStatus,
                        setbackOrLay,
                        setBetOddValue,
                        teamNames,
                        setDefaultTeamName,
                        setMaxValue,
                        setMinValue
                    }) => {

    const fancyHideStatus = useFancyHideStatus(model, gameData);

    const [closePopup, setClosePopup] = useState(false)
    const {runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, stakeValue} = useContext(SportsContext);
    const { clearTeam } = useSetCashoutTeam();

    const [fancyData, setFancyData] = useState(null)
    
    // Store fancy_list values persistently to preserve them after bet placement
    const persistentFancyLists = useRef({})

    // Move hooks before early return
    const mainValue = gameData?.['over by over'];
    const arSectionData = mainValue?.section || [];
    const maxValue = useMemo(() => mainValue?.max || model.fancy_max_limit, [mainValue, model.fancy_max_limit]);
    
    useEffect(() => {
        if (setMaxValue !== null) {
            setMaxValue((prevState) => {
                return {...prevState, 'OVER_BY_OVER': maxValue}
            })
        }

        if (setMinValue !== null) {
            setMinValue((prevState) => {
                return {...prevState, 'OVER_BY_OVER': mainValue?.min ?? model.fancy_min_limit}
            })
        }
        //eslint-disable-next-line
    }, [maxValue]);

    // Early return after all hooks
    if (!gameData || !gameData['over by over']) return null;
    
    // Initialize OVER_BY_OVER team names as an array
    teamNames.current['OVER_BY_OVER'] = [];
    
    let minValue = model.fancy_min_limit;
    let maxValueLocal = model.fancy_max_limit;

    if (mainValue.min) {
        minValue = mainValue.min;
    }

    if (mainValue.max) {
        maxValueLocal = mainValue.max;
    }

    minValue = getSize(minValue, true);
    maxValueLocal = getSize(maxValueLocal, true);


    return (
        <div className="game-market market-6">
            <div className="market-title">
                <span>Over By Over</span>
                <span className="m-r-5 game-rules-icon" onClick={() => handleShowRules('Fancyrule')}>
                    <span><i className="fa fa-info-circle float-right"/></span>
                </span>
            </div>
            <div className="row row10">
                <div className="col-md-12">
                    <div className="market-header">
                        <div className="market-nation-detail"></div>
                        <div className="market-odd-box lay"><b>No</b></div>
                        <div className="market-odd-box back"><b>Yes</b></div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                </div>
            </div>
            <div className="market-body" data-title="OPEN">
                <div className="row row10">
                    <div className="col-md-12">
                        {chunkArray(arSectionData, 1).map((arr, vaee) => (
                            <React.Fragment key={vaee}>
                                {arr.map((oddsArr, key) => {
                                const teamName = oddsArr.nat.trim();
                                
                                // Add team name to the OVER_BY_OVER array
                                teamNames.current['OVER_BY_OVER'].push(teamName);

                                if (fancyHideStatus[oddsArr.sid] || !teamName || teamName.trim() === '') {
                                    return null;
                                }


                                let back = 0, lay = 0, backk = '0', layk = '0';
                                const odds = oddsArr.odds || [];

                                oddsArr['back'] = [];
                                oddsArr['lay'] = [];

                                let no = 0;


                                odds.forEach(aValue => {
                                    const tno = aValue.tno;
                                    if (aValue.otype === "back") {
                                        oddsArr['back'][tno] = aValue;
                                        back = aValue.odds;
                                        backk = aValue.size;
                                    } else if (aValue.otype === "lay") {
                                        oddsArr['lay'][no] = aValue;
                                        lay = aValue.odds;
                                        layk = aValue.size;
                                        no++;
                                    }
                                });

                                let total = (parseFloat(back) + parseFloat(lay));
                                if (model.match_suspend_fancy === 1 || model.match_suspend === 1) {
                                    total = 0;
                                }

                                let isSuspendedClass = '';
                                let isSuspended = '';

                                const gstatus = oddsArr.gstatus ? oddsArr.gstatus.toUpperCase() : "";
                                if (gstatus && ['SUSPENDED', 'BALL_RUNNING', 'MATCH-SUSPENDED'].includes(gstatus)) {
                                    total = 0;
                                }

                                if (total === 0) {
                                    isSuspended = gstatus || 'SUSPENDED';
                                    isSuspendedClass = 'suspended suspend_box';
                                }

                                const backFunctionSes = generateBackAndLayFunction(total, oddsArr, 'back', teamName, 0, key, 'OVER_BY_OVER', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'over by over', back, backk, undefined, undefined, clearTeam, stakeValue);

                                const layFunctionSes = generateBackAndLayFunction(total, oddsArr, 'lay', teamName, 0, key, 'OVER_BY_OVER', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'over by over', lay, layk, undefined, undefined, clearTeam, stakeValue);

                                back = back > 0 ? parseFloat(back) : "-";
                                backk = backk > 0 ? parseFloat(backk) : "";
                                lay = lay > 0 ? parseFloat(lay) : "-";
                                layk = layk > 0 ? parseFloat(layk) : "";


                                const betPlaceCheck = betPlaceStatus?.current?.[teamName];

                                // Store current fancy_list values persistently
                                if (betPlaceCheck?.fancy_list) {
                                    persistentFancyLists.current[teamName] = betPlaceCheck.fancy_list;
                                }

                                // Use persistent values if current values are not available
                                const currentFancyList = betPlaceCheck?.fancy_list || persistentFancyLists.current[teamName] || {};
                                const fancyListValues = Object.values(currentFancyList);

                                const min_value = fancyListValues.length > 0 ? Math.min(...fancyListValues) : null;

                                const get_fancy_session_value = Object.keys(currentFancyList).length > 0 ? (
                                    <span className="span_fancy_session_value color-font-red">{min_value}</span>
                                ) : null;

                                if (oddsArr.min) {
                                    minValue = oddsArr.min;
                                }

                                if (oddsArr.max) {
                                    maxValueLocal = oddsArr.max;
                                }

                                minValue = getSize(minValue, true);
                                maxValueLocal = getSize(maxValueLocal, true);
                                const remark = oddsArr.rem || '';

                                return (
                                    <div className={`fancy-market ${isSuspendedClass ? 'suspended-row' : ''}`} data-title={isSuspended || ""} key={key}>
                                        <div className="market-row">
                                            <div className="market-nation-detail">
                                                <span className="market-nation-name">
                                                    {betPlaceCheck?.bet ? (
                                                        <Link className="link-session"
                                                              onClick={() => showCricketSessionBook(teamName, model.id, setFancyData, 'OVER_BY_OVER')}>
                                                            {teamName}
                                                        </Link>
                                                    ) : (
                                                        <span>{teamName}</span>
                                                    )}
                                                </span>
                                                <div className="market-book float-end text-danger">
                                                    {get_fancy_session_value}
                                                </div>
                                                
                                            </div>
                                            <div className="market-odd-box lay"
                                                 onClick={total > 0 && layFunctionSes ? (Array.isArray(layFunctionSes) ? layFunctionSes[0] : layFunctionSes) : null}>
                                                <span className="market-odd">{lay !== "-" ? lay : "-"}</span>
                                                {layk && <span className="market-volume">{getSize(layk, false)}</span>}
                                            </div>
                                            <div className="market-odd-box back"
                                                 onClick={total > 0 && backFunctionSes ? (Array.isArray(backFunctionSes) ? backFunctionSes[0] : backFunctionSes) : null}>
                                                <span className="market-odd">{back !== "-" ? back : "-"}</span>
                                                {backk && <span className="market-volume">{getSize(backk, false)}</span>}
                                            </div>
                                            <div className="fancy-min-max-box">
                                                <div className="fancy-min-max">
                                                    <span className="w-100 d-block">Min: {minValue}</span>
                                                    <span className="w-100 d-block">Max: {maxValueLocal}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {remark && (
                                            <div className="market-row">
                                                {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                                                <marquee className="market-remark">{remark}</marquee>
                                            </div>
                                        )}
                                    </div>
                                );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <FancyBetPopup fancyData={fancyData} setFancyData={setFancyData} closePopup={closePopup}
                           setClosePopup={setClosePopup}/>
        </div>
    );
};

export default OverByOver;
