import React, {useContext, useState, useEffect, useMemo} from 'react';
import {
    chunkArray,

    generateBackAndLayFunction,
    getSize,
    handleShowRules, useFancyHideStatus
} from "@dxc247/shared/utils/Constants";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import FancyBetPopup from "./FancyBetPopup";


const BallByBall = ({
                        data,
                        sportList,
                        betPlaceStatus,
                        oddsChange,
                        setDefaultTeamName,
                        setBetOddValue,
                        showCricketSessionBook,
                        setbackOrLay,
                        teamNames,
                        setPopupDisplay,
                        setMaxValue,
                        setMinValue
                    }) => {
    const fancyHideStatus = useFancyHideStatus(sportList, data);
    const {runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray} = useContext(SportsContext);
    const [fancyData, setFancyData] = useState(null)
    const [closePopup, setClosePopup] = useState(false)

    // Move hooks before early return
    const mainValue = data?.['ball by ball'];
    const ar_sectionData = mainValue?.section || [];
    const maxValue = useMemo(() => mainValue?.max || sportList.fancy_max_limit, [mainValue, sportList.fancy_max_limit]);
    
    useEffect(() => {
        if (setMaxValue !== null) {
            setMaxValue((prevState) => {
                return {...prevState, 'BALL_BY_BALL': maxValue}
            })
        }

        if (setMinValue !== null) {
            setMinValue((prevState) => {
                return {...prevState, 'BALL_BY_BALL': mainValue?.min ?? sportList.fancy_min_limit}
            })
        }
        //eslint-disable-next-line
    }, [maxValue]);

    // Early return after all hooks
    if (!data ||  data['ball by ball'] === undefined) return null;

    teamNames.current['BALL_BY_BALL'] = [];


    return (
        <div className="game-market market-6">
            <div className="market-title">
                <span>Ball By Ball</span>
            </div>
            <div className="row row10">
                <div className="col-md-6">
                    <div className="market-header">
                        <div className="market-nation-detail"></div>
                        <div className="market-odd-box lay"><b>No</b></div>
                        <div className="market-odd-box back"><b>Yes</b></div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                </div>
                <div className="col-md-6 d-none d-xl-block">
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
                    {ar_sectionData.map((oddsArr, key) => {
                        const teamName = oddsArr.nat.trim();
                        teamNames.current['BALL_BY_BALL'].push(teamName);

                        if (fancyHideStatus[oddsArr.sid] || !teamName || teamName.trim() === '') {
                            return null;
                        }

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
                            isSuspendedClass = 'suspended-row';
                        }

                        const n_key_lay = key;
                        const n_key_back = key;

                        let backFunctionSes = [], layFunctionSes = [];
                        backFunctionSes = generateBackAndLayFunction(totalOdds, oddsArr, 'back', teamName, 0, n_key_back, 'BALL_BY_BALL', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'ball by ball', back, backk);

                        layFunctionSes = generateBackAndLayFunction(totalOdds, oddsArr, 'lay', teamName, 0, n_key_lay, 'BALL_BY_BALL', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, oddsk, setBetTypeFromArray, 'ball by ball', lay, layk);

                        const betPlaceCheck = betPlaceStatus?.current?.[teamName];
                        const fancyListValues = Object.values(betPlaceCheck?.fancy_list || []);

                        const min_value = fancyListValues.length > 0 ? Math.min(...fancyListValues) : null;

                        const get_fancy_session_value = betPlaceCheck?.fancy_list ? (
                            <span className="span_fancy_session_value color-font-red">{min_value}</span>
                        ) : null;

                        return (
                            <div key={key} className="col-md-6">
                                <div className={`fancy-market ${isSuspendedClass}`} data-title={gstatus}>
                                    <div className="market-row">
                                        <div className="market-nation-detail">
                                            <span className="market-nation-name">
                                                {betPlaceCheck?.bet ? (
                                                    <a className="link-session"
                                                       onClick={() => showCricketSessionBook(teamName, sportList.id, setFancyData)}>
                                                        {teamName}
                                                    </a>
                                                ) : (
                                                    teamName
                                                )}
                                            </span>
                                        </div>
                                        <div className="market-odd-box lay" onClick={layFunctionSes[0]}>
                                            <span className="market-odd">{lay > 0 ? lay : '-'}</span>
                                            {lay > 0 && <span className="market-volume">{getSize(layk, false)}</span>}
                                        </div>
                                        <div className="market-odd-box back" onClick={backFunctionSes[0]}>
                                            <span className="market-odd">{back > 0 ? back : '-'}</span>
                                            {back > 0 && <span className="market-volume">{getSize(backk, false)}</span>}
                                        </div>
                                        <div className="fancy-min-max-box">
                                            <div className="fancy-min-max">
                                                <span className="w-100 d-block">Min: {oddsArr.min || '100.00'}</span>
                                                <span className="w-100 d-block">Max: {getSize(oddsArr.max, true) || '2L'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <FancyBetPopup fancyData={fancyData} setFancyData={setFancyData} closePopup={closePopup}
                           setClosePopup={setClosePopup}/>
        </div>
    );
};

export default BallByBall;