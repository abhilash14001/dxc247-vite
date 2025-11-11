import React, {useContext, useMemo, useCallback, useEffect, useState} from "react";
import {
    getSize,
    organiseOdds,
    getExByColor,
    handleShowRules,
    generateBackAndLayFunction,
    handleCashoutLogic,
    exposureCheck
    
} from "@dxc247/shared/utils/Constants";
import {getActiveBets} from "@dxc247/shared/utils/betUtils";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

function Bookmaker2({
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
    placingBets = {},
    setMaxValue = null,
    setMinValue = null,
    
}) {
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
                const matchId = sportList?.match_id || window.location.pathname.split('/').pop();
                if (matchId) {
                    const activeBets = await getActiveBets(matchId, 'BOOKMAKER2');
                    setHasActiveBets(activeBets && activeBets.length > 0);
                }
            } catch (error) {
                console.error('Error checking active bets:', error);
                setHasActiveBets(false);
            }
        };

        checkActiveBets();
        
        
    }, [sportList?.match_id, exposure]);



    // Add cashout function for Bookmaker2
    const handleCashout = async () => {
        setBetOddValue(0);
        
        const success = await handleCashoutLogic({
            currentMarketData: ar_sectionData?.['bookmaker 2']?.section || [],
            matchId: sportList?.match_id || window.location.pathname.split('/').pop(),
            betType: 'BOOKMAKER2',
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
            
            defaultBetType: 'BOOKMAKER2',
            
        });

        if (!success) {
            console.error('Cashout operation failed');
        } else {
        }
    };

    if (!teamNames.current['BOOKMAKER2']) {
        teamNames.current['BOOKMAKER2'] = []; // Initialize 'BOOKMAKER2' as an empty array
    }
    // Memoize bookmaker2 data

    
    const bookmaker2Data = useMemo(() => ar_sectionData?.['bookmaker 2'] || ar_sectionData?.bookmaker2, [ar_sectionData]);
    const sections = bookmaker2Data?.section || [];
    // Check if there are 3 teams - if so, hide cashout option
    const hasThreeTeams = useMemo(() => sections.length === 3, [sections]);

    // Determine if any section (runner) is ACTIVE (not suspended)
    const hasAnyActiveSection = useMemo(() => {
        if (!sections || sections.length === 0) return false;
        return sections.every((s) => s?.gstatus && s.gstatus == "SUSPENDED");
    }, [sections]);

    useEffect(() => {
        if (setMaxValue !== null && bookmaker2Data?.max) {
            setMaxValue((prevState) => {
                return {...prevState, 'BOOKMAKER2': bookmaker2Data?.max}
            })
            if (setMinValue !== null) {
                setMinValue((prevState) => {
                    return {...prevState, 'BOOKMAKER2': bookmaker2Data?.min ?? 100}
                })
            }

        }
        // eslint-disable-next-line
    }, [bookmaker2Data?.max]);


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
        

    }


    // Common function to render odds
    const renderOdds = useCallback(
        (oddsArr, key11, teamName, runnerRow, tot) => {
            // Extract back and lay odds from the odds array
            const backOdds = oddsArr.odds?.filter(odd => odd.otype === 'back') || [];
            const layOdds = oddsArr.odds?.filter(odd => odd.otype === 'lay') || [];
            
            // Debug logging
            
            
            return (
                <>
                    {/* Back Odds - Only show 1 back box */}
                    {(() => {
                        if (backOdds.length > 0) {
                            // Get the best back odds (usually the first one)
                            const back = backOdds[0];
                            const backFunction = generateBackAndLayFunction(
                                tot, oddsArr, 'back', teamName, runnerRow, key11, 'BOOKMAKER2', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType,
                                null, setBetTypeFromArray, 'bookmaker 2', undefined, undefined, clearTeam
                            );
                            const value_price = tot === 0 ? '-' : back?.odds || '-';
                            const value_size = tot === 0 ? '' : getSize(back?.size || '');

                            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
                            if (oddsChange.current[`bookmaker2back${key11}`] === undefined) {
                                oddsChange.current[`bookmaker2back${key11}`] = value_price;
                            } else if (oddsChange.current[`bookmaker2back${key11}`] !== value_price) {
                                updateOdds(`bookmaker2back${key11}`, value_price);
                            }

                            return (
                                <div
                                    key="back"
                                    className={`market-odd-box back ${oddsChange.current[`bookmaker2back${key11}`] !== value_price && oddsChange.current[`bookmaker2back${key11}`] !== '' ? 'blink' : ""}`}
                                    onClick={backFunction[0]}>
                                    <span className="market-odd">{value_price}</span>
                                    <span className="market-volume">{value_size}</span>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* Lay Odds - Only show 1 lay box */}
                    {(() => {
                        if (layOdds.length > 0) {
                            // Get the best lay odds (usually the first one)
                            const lay = layOdds[0];
                            const layFunction = generateBackAndLayFunction(
                                tot, oddsArr, 'lay', teamName, runnerRow, 0, 'BOOKMAKER2', setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, null,
                                setBetTypeFromArray, 'bookmaker 2', undefined, undefined, clearTeam
                            );
                            const value_price = tot === 0 ? '-' : lay?.odds || '-';
                            const value_size = tot === 0 ? '' : getSize(lay?.size || '');

                            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
                            if (oddsChange.current[`bookmaker2lay${key11}`] === undefined) {
                                oddsChange.current[`bookmaker2lay${key11}`] = value_price;
                            } else if (oddsChange.current[`bookmaker2lay${key11}`] !== value_price) {
                                // Update odds in oddsChange
                                updateOdds(`bookmaker2lay${key11}`, value_price);
                            }

                            return (
                                <div
                                    key="lay"
                                    className={`market-odd-box lay ${oddsChange.current[`bookmaker2lay${key11}`] !== value_price && oddsChange.current[`bookmaker2lay${key11}`] !== '' ? 'blink' : ''}`}
                                    onClick={layFunction[0]}>
                                    <span className="market-odd">{value_price}</span>
                                    <span className="market-volume">{value_size}</span>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </>
            );
        },
        [oddsChange, setBetOddValue, setbackOrLay, teamNames, setPopupDisplay, setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType, setBetTypeFromArray, clearTeam]
    );

    return (
        <>
            {bookmaker2Data && (
                <div className="game-market market-2 width30">
                    <div className="market-title">
                        <span>{bookmaker2Data?.mname || 'Bookmaker 2'}</span>
                        {!isAdmin && !hasThreeTeams && (
                            <button 
                                className="btn btn-success btn-sm" 
                                onClick={handleCashout}
                                disabled={!hasActiveBets}
                                title={hasActiveBets ? "No active bets to cashout" : "Click to cashout active bets"}
                            > 
                                Cashout 
                            </button>
                        )}
                    </div>
                    <div className="market-header">
                        <div className="market-nation-detail">
                            <span className="market-nation-name">Min: {bookmaker2Data.min}&nbsp; Max: {getSize(bookmaker2Data.max, true)}</span>
                        </div>
                        <div className="market-odd-box back"><b>Back</b></div>
                        <div className="market-odd-box lay"><b>Lay</b></div>
                    </div>
                    <div 
                        className={`market-body ${
                            (
                                (bookmaker2Data?.status === "SUSPENDED") ||
                                sportList.match_suspend_bookmaker === 1 ||
                                sportList.match_suspend === 1
                            ) && !hasAnyActiveSection
                                ? ""
                                : ""
                        }`}
                        data-title={
                            (
                                (bookmaker2Data?.status === "SUSPENDED") ||
                                sportList.match_suspend_bookmaker === 1 ||
                                sportList.match_suspend === 1
                            ) && !hasAnyActiveSection
                                ? "SUSPENDED"
                                : ""
                        }
                    >
                        {sections.map((oddsArr, key) => {
                            let isSuspended = "", isSuspendedClass = "";
                            let tot = 1;

                            // Check if suspended
                            if (oddsArr.gstatus === 'SUSPENDED' || sportList.match_suspend_bookmaker === 1 || sportList.match_suspend === 1) {
                                tot = 0;
                                isSuspended = "SUSPENDED";
                                isSuspendedClass = "suspended-row";
                            } else {
                                isSuspended = "ACTIVE";
                            }

                            const teamName = oddsArr.nat.trim() || '';
                            
                            if (!teamNames.current['BOOKMAKER2'].includes(teamName)) {
                                teamNames.current['BOOKMAKER2'].push(teamName);
                            }

                            
                            const teamEx = bookmakerTeamData?.[teamName] ?? 0;
                            if (!allTeamName.current['BOOKMAKER2']) {
                                allTeamName.current['BOOKMAKER2'] = [];
                            }
                            if (!allTeamName.current['BOOKMAKER2'].includes(teamName)) {
                                allTeamName.current['BOOKMAKER2'].push(teamName);
                            }
                            const runnerRow = `table-row-${sportList.match_id}-${key}`;

                            // Organize odds
                            const organizedOdds = organiseOdds(oddsArr);
                            const n_key = `${sportList.match_id}-${key}`;
                            if (!teamNameCurrentBets.current?.['BOOKMAKER2']) {
                                teamNameCurrentBets.current['BOOKMAKER2'] = [];
                                teamNameCurrentBets.current['BOOKMAKER2'][teamName] = ''
                            }

                            
                            teamNameCurrentBets.current['BOOKMAKER2'][teamName] = teamEx;

                            return (
                                <div key={key} className={`market-row ${isSuspendedClass}`} data-title={isSuspended}>
                                    <div className="market-nation-detail">
                                        <span className="market-nation-name">{teamName}</span>
                                        <div className="market-nation-book">
                                        {getExByColor(teamEx, true)}

                                            {placingBets['BOOKMAKER2']?.[teamName] && (
                                                <span className={placingBets['BOOKMAKER2']?.[teamName] < 0 ? 'red-color' : 'green-color'}>
                                                    {(placingBets['BOOKMAKER2'][teamName] % 1 !== 0 && placingBets['BOOKMAKER2'][teamName].toString().split('.')[1]?.length > 2) 
                                                        ? Math.round(placingBets['BOOKMAKER2'][teamName] * 100) / 100 
                                                        : placingBets['BOOKMAKER2'][teamName]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {renderOdds(organizedOdds, n_key, teamName, runnerRow, tot)}
                                </div>
                            );
                        })}
                    </div>
                    {bookmaker2Data.rem && (
                        <div className="market-row">
                            <marquee className="market-remark">{bookmaker2Data.rem}</marquee>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Bookmaker2;
