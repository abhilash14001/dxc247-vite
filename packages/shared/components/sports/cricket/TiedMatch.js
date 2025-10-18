import React, { useContext, useState, useEffect } from 'react';
import {
    handleShowRules,
    getSize,
    organiseOdds,
    generateBackAndLayFunction, getExByColor, dummyDataOdds,
    handleCashoutLogic,
    exposureCheck
} from "@dxc247/shared/utils/Constants";
import { getActiveBets } from "@dxc247/shared/utils/betUtils";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

const TiedMatch = ({
    isAdmin,
    gameData,
    model,
    tiedMatchData,
    allTeamName = [],
    teamNameArr,
    teamNameCurrentBets = {},
    setBetOddValue,
    setbackOrLay,
    teamNames,
    setPopupDisplay,
    setDefaultTeamName,
    placingBets = {},

}) => {

    const { runnerRowDefault, rootClassDefault, setBetType,
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
                const matchId = model?.match_id || window.location.pathname.split('/').pop();
                if (matchId) {
                    const activeBets = await getActiveBets(matchId, 'TIED_MATCH');

                    setHasActiveBets(activeBets && activeBets.length > 0);
                }
            } catch (error) {
                console.error('Error checking active bets:', error);
                setHasActiveBets(false);
            }
        };

        checkActiveBets();

    }, [model?.match_id, exposure]);




    // Add cashout function for TiedMatch
    const handleCashout = async () => {
        setBetOddValue(0);

        const success = await handleCashoutLogic({
            currentMarketData: gameData?.['tied match']?.section || [],
            matchId: model?.match_id || window.location.pathname.split('/').pop(),
            betType: 'TIED_MATCH',
            getActiveBets,
            setBetType,
            setBetTypeFromArray,
            setBetOddValue,
            setbackOrLay,
            setTeam, // Using Redux setTeam directly
            setDefaultTeamName,
            stakeValue,
            setPopupDisplay,
            teamNames,
            teamNameCurrentBets,
            loss,
            profit,
            profitData,
            placingBets,

            defaultBetType: 'TIED_MATCH',

        });

        if (!success) {
            console.error('Cashout operation failed');
        } else {
            console.log('Cashout successful, betType after:', betType);
        }
    };


    if (!gameData || !gameData['tied match']) {
        return null;
    }

    return gameData['tied match'] && (() => {

        let mainValue = gameData['tied match'];
        let mainKey = 0;
        let remark = mainValue['rem'] || '';
        let minValue = mainValue['min'] || model.odd_min_limit;
        let maxValue = mainValue['max'] || model.odd_max_limit;
        minValue = getSize(minValue, true);
        maxValue = getSize(maxValue, true);
        teamNames.current['TIED_MATCH'] = [];

        const arSectionData = mainValue['section'];


        return (
            <div key={mainKey} className="game-market market-2 width30">
                <div className="market-title">
                    <span>{mainValue['mname']}</span>
                    {!isAdmin && (
                    <button
                        className="btn btn-success btn-sm"
                        onClick={handleCashout}
                        disabled={!hasActiveBets}
                        title={!hasActiveBets ? "No active bets to cashout" : "Click to cashout active bets"}
                    >
                        Cashout
                    </button>
                    )}
                </div>
                <div className="market-header">
                    <div className="market-nation-detail">
                        <span className="market-nation-name">Min: {minValue}&nbsp; Max: {maxValue}</span>
                    </div>
                    <div className="market-odd-box back"><b>Back</b></div>
                    <div className="market-odd-box lay"><b>Lay</b></div>
                </div>
                <div className="market-body" data-title="SUSPENDED">
                        {arSectionData.map((oddsArr, key) => {

                            let teamName = oddsArr['nat']?.trim() || '';

                            teamNames.current['TIED_MATCH'][teamName] = oddsArr['nat'];


                            
                            const runnerRow = `table-row-${model.match_id}-${key}tied`;

                            const tot = (oddsArr['gstatus'] !== 'ACTIVE' || model.match_suspend_odd || model.match_suspend) ? 0 : 1;

                            let isSuspended = '';
                            let isSuspendedClass = '';
                            if (tot === 0) {
                                isSuspended = 'SUSPENDED';
                                isSuspendedClass = 'suspended';
                            }


                            if (oddsArr.odds && oddsArr.odds.length > 0) {
                                oddsArr = organiseOdds(oddsArr)

                            }

                            const n_key = model.match_id + "-" + key + "-" + (oddsArr['back']?.length - 1);


                            const teamEx = tiedMatchData?.[teamName];

                            if (!teamNameCurrentBets.current['TIED_MATCH']) {
                                teamNameCurrentBets.current['TIED_MATCH'] = [];
                                teamNameCurrentBets.current['TIED_MATCH'][teamName] = ''
                            }
                            if (!allTeamName.current['TIED_MATCH']) {
                                allTeamName.current['TIED_MATCH'] = [];


                            }
                            if (!allTeamName.current['TIED_MATCH'].includes(teamName))
                                allTeamName.current['TIED_MATCH'].push(teamName);

                            teamNameCurrentBets.current['TIED_MATCH'][teamName] = teamEx

                            return (
                                <div key={key} className={`market-row ${isSuspendedClass ? 'suspended-row' : ''}`} data-title={isSuspended || 'ACTIVE'}>
                                    <div className="market-nation-detail">
                                        <span className="market-nation-name">{teamName}</span>
                                       
                                        <div className={`market-nation-book`}>
                                        <span className={`market-book ${teamEx < 0 ? 'text-danger' : 'text-success'} `}>
                                            {teamEx}
                                        </span>
                                        <div className={`market-live-book ${placingBets?.['TIED_MATCH']?.[teamName] < 0 ? 'text-danger' : 'text-success'} `}>{placingBets?.['TIED_MATCH']?.[teamName] ?? ''}</div>
                                        </div>
                                        
                                    </div>



                                    {/* Back Odds - Only show the first one */}
                                    {(() => {
                                        const backOdds = dummyDataOdds(oddsArr?.back);
                                        if (backOdds && backOdds.length > 0) {
                                            const back = backOdds[2];
                                            const reverseKey = backOdds.length - 1;
                                            const value_price = tot === 0 ? "-" : (back?.odds ? parseFloat(back.odds) : "-");
                                            const value_size = tot === 0 ? "" : (back?.size ? getSize(parseFloat(back.size), false) : "");
                                            const backFunction = generateBackAndLayFunction(tot, oddsArr, 'back', teamName, runnerRow, reverseKey, 'TIED_MATCH', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, null, setBetTypeFromArray, 'tied match', back?.odds || '', back?.size || '', undefined, undefined, clearTeam);
                                            
                                            return (
                                                <div className="market-odd-box back"
                                                    onClick={backFunction ? backFunction[0] : null}>
                                                    <span className="market-odd">{value_price}</span>
                                                    {value_size && <span className="market-volume">{value_size}</span>}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="market-odd-box back">
                                                    <span className="market-odd">-</span>
                                                </div>
                                            );
                                        }
                                    })()}

                                    {/* Lay Odds - Only show the first one */}
                                    {(() => {
                                        const layOdds = dummyDataOdds(oddsArr?.lay);
                                        if (layOdds && layOdds.length > 0) {
                                            const lay = layOdds[0];
                                            const value_price = tot === 0 ? "-" : (lay?.odds ? parseFloat(lay.odds) : "-");
                                            const value_size = tot === 0 ? "" : (lay?.size ? getSize(parseFloat(lay.size), false) : "");
                                            const n_key = model.match_id + "-" + key + "-" + (layOdds.length - 1);
                                            const layFunction = generateBackAndLayFunction(tot, oddsArr, 'lay', teamName, runnerRow, n_key, 'TIED_MATCH', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, null, setBetTypeFromArray, 'tied match', lay?.odds || '', lay?.size || '', undefined, undefined, clearTeam);
                                            
                                            return (
                                                <div className="market-odd-box lay"
                                                    onClick={layFunction ? layFunction[0] : null}>
                                                    <span className="market-odd">{value_price}</span>
                                                    {value_size && <span className="market-volume">{value_size}</span>}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="market-odd-box lay">
                                                    <span className="market-odd">-</span>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            );
                        })}

                        {remark && (
                            <div className="market-row">
                                {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                                <marquee className="market-remark">{remark}</marquee>
                            </div>
                        )}
                </div>
            </div>
        );
    })();
};

export default TiedMatch;
