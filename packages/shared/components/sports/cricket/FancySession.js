import React, {useContext, useEffect, useState, useMemo} from 'react';
import {
    chunkArray,

    generateBackAndLayFunction,
    getSize,
    handleShowRules, useFancyHideStatus
} from "@dxc247/shared/utils/Constants";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import FancyBetPopup from "./FancyBetPopup";
import axios from "axios";


const FancySession = ({
                          data,
                          sportList,
                          betPlaceStatus,
                          setDefaultTeamName,
                          setBetOddValue,
                          showCricketSessionBook,
                          setbackOrLay,
                          teamNames,
                          setMaxValue,
                          setMinValue,
                          setPopupDisplay
                      }) => {
    const fancyHideStatus = useFancyHideStatus(sportList, data);
    const {runnerRowDefault, oddsk, rootClassDefault, setBetType, setBetTypeFromArray} = useContext(SportsContext);

    const [fancyData, setFancyData] = useState(null)
    const [closePopup, setClosePopup] = useState(false)

    // Move hooks before early return
    const mainValue = data?.['normal'];
    const ar_sectionData = mainValue?.section;
    const maxValue = useMemo(() => ar_sectionData?.['normal']?.['maxb'], [ar_sectionData]);
    
    useEffect(() => {
        if (setMaxValue !== null) {
            setMaxValue((prevState) => {
                return {...prevState, 'FANCY_SESSION': maxValue}
            })
        }

        if (setMinValue !== null) {
            setMinValue((prevState) => {
                return {...prevState, 'FANCY_SESSION': mainValue?.['normal']?.['min'] ?? 100}
            })
        }
        //eslint-disable-next-line
    }, [maxValue]);

    // Early return after all hooks
    if (!data || data['normal'] === undefined) return null;

    
    // Initialize FANCY_SESSION team names as an array
    teamNames.current['FANCY_SESSION'] = [];

    return (
        <div className="game-market market-6">
            <div className="market-title">
                <span>Normal</span>
                <a className="m-r-5 game-rules-icon" onClick={() => handleShowRules('Fancyrule')}>
                <span>
                    <i className="fa fa-info-circle float-right"></i>
                </span>
                </a>
            </div>
            <div className="row row10">
                <div className="col-md-6">
                    <div className="market-header">
                        <div className="market-nation-detail"></div>
                        <div className="market-odd-box lay">
                            <b>No</b>
                        </div>
                        <div className="market-odd-box back">
                            <b>Yes</b>
                        </div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                </div>
                <div className="col-md-6 d-none d-xl-block">
                    <div className="market-header">
                        <div className="market-nation-detail"></div>
                        <div className="market-odd-box lay">
                            <b>No</b>
                        </div>
                        <div className="market-odd-box back">
                            <b>Yes</b>
                        </div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                </div>
            </div>
            <div className="market-body" data-title="OPEN">
                <div className="row row10">
                    {chunkArray(ar_sectionData, 2).map((arr, valkey) => (
                        <React.Fragment key={valkey}>
                            {arr.map((oddsArr, key) => {
                                    const teamName = oddsArr.nat.trim();

                                    teamNames.current['FANCY_SESSION'].push(teamName);

                                    if (fancyHideStatus[oddsArr.sid] || !teamName || teamName.trim() === '') {
                                        return null;
                                    }

                                    const runnerRow = 0;
                                    let isSuspendedClass = '';
                                    let back = 0, lay = 0, backk = '0', layk = '0';
                                    oddsArr['back'] = [];
                                    oddsArr['lay'] = [];

                                    if (oddsArr.odds && oddsArr.odds.length > 0) {
                                        let no = 0;

                                        oddsArr.odds.forEach(a_value => {
                                            const tno = a_value.tno;
                                            if (a_value.otype === 'back') {
                                                oddsArr['back'][tno] = a_value;
                                                back = a_value.odds;
                                                backk = a_value.size;
                                            } else if (a_value.otype === 'lay') {
                                                oddsArr['lay'][no] = a_value;
                                                lay = a_value.odds;
                                                layk = a_value.size;
                                                no++;
                                            }
                                        });
                                    }

                                    let totalOdds = parseFloat(back) + parseFloat(lay);
                                    if (sportList.match_suspend_fancy === 1 || sportList.match_suspend === 1) {
                                        totalOdds = 0;
                                    }

                                    const gstatus = oddsArr.gstatus ? oddsArr.gstatus.toUpperCase() : '';

                                    if (gstatus === 'SUSPENDED' || gstatus === 'BALL_RUNNING' || gstatus === 'MATCH-SUSPENDED') {
                                        totalOdds = 0;
                                    }

                                    if (totalOdds === 0) {
                                        isSuspendedClass = 'suspended suspend_box';
                                    }

                                    const backFunctionSes = generateBackAndLayFunction(totalOdds, oddsArr, 'back', teamName, runnerRow, key, 'FANCY_SESSION', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'normal', back, backk);

                                    const layFunctionSes = generateBackAndLayFunction(totalOdds, oddsArr, 'lay', teamName, runnerRow, key, 'FANCY_SESSION', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'normal', lay, layk);

                                    const betPlaceCheck = betPlaceStatus?.current?.[teamName];
                                    
                                    const get_fancy_session_value = betPlaceCheck?.fancy_list ? (
                                        <span className="market-book float-end  text-danger"> {betPlaceCheck?.fancy_list?.[teamName] ? - + " " +   betPlaceCheck?.fancy_list?.[teamName] : ''}</span>
                                    ) : null;

                                    return (
                                        <div key={key} className="col-md-6">
                                            <div className={`fancy-market ${totalOdds === 0 ? 'suspended-row' : ''}`} data-title={totalOdds === 0 ? (totalOdds === 0 ? 'SUSPENDED' : gstatus) : ""}>
                                                <div className="market-row">
                                                    <div className="market-nation-detail">
                                                        <span className="market-nation-name">
                                                            {betPlaceCheck?.bet ? (
                                                                <a className="link-session"
                                                                   onClick={() => showCricketSessionBook(teamName, sportList.id, setFancyData, 'FANCY_SESSION')}>
                                                                    {teamName}
                                                                </a>
                                                            ) : (
                                                                <span>{teamName}</span>
                                                            )}
                                                        </span>
                                                        {/* Add badla-icon for certain markets - you can add logic here to show/hide based on market type */}
                                                        
                                                        {get_fancy_session_value}
                                                    </div>
                                                    <div className="market-odd-box lay"
                                                         onClick={totalOdds > 0 && layFunctionSes ? (Array.isArray(layFunctionSes) ? layFunctionSes[0] : layFunctionSes) : null}>
                                                        <span className="market-odd">{lay > 0 ? lay : '-'}</span>
                                                        <span className="market-volume">{layk}</span>
                                                    </div>
                                                    <div className="market-odd-box back"
                                                         onClick={totalOdds > 0 && backFunctionSes ? (Array.isArray(backFunctionSes) ? backFunctionSes[0] : backFunctionSes) : null}>
                                                        <span className="market-odd">{back > 0 ? back : '-'}</span>
                                                        <span className="market-volume">{backk}</span>
                                                    </div>
                                                    <div className="fancy-min-max-box">
                                                        <div className="fancy-min-max">
                                                            <span className="w-100 d-block">Min: {oddsArr.min}</span>
                                                            <span className="w-100 d-block">Max: {getSize(oddsArr.max, true)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {fancyData !== null && (
            <FancyBetPopup fancyData={fancyData} setFancyData={setFancyData} closePopup={closePopup}
                           setClosePopup={setClosePopup}/>
            )}
        </div>
    );
};

export default FancySession;