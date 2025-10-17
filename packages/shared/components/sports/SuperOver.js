import {
    getExByColor,
    getSize,
    handleShowRules,
    organiseOdds,
    generateBackAndLayFunction,
     handleCashoutLogic
} from "@dxc247/shared/utils/Constants";
// import {handleCashoutLogic} from "../../../Common_Functions/CashoutLogic";
import {getActiveBets} from "@dxc247/shared/utils/betUtils";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import { useSetCashoutTeam } from "@dxc247/shared/store/hooks";

function SuperOver({
                       ar_sectionData,
                       sportList,
                       allTeamName = {},
                       oddsChange,
                       setBetOddValue,
                       setbackOrLay,
                       teamNames,
                       teamNameCurrentBets = {},
                       setPopupDisplay,
                       setDefaultTeamName,
                       oddsTeamData,
                       setMaxValue = null,
                       setMinValue = null,
                       placingBets = []
                   }) {

    const {runnerRowDefault, rootClassDefault, setBetType, setBetTypeFromArray, stakeValue,
        loss,
        profit,
        profitData,

    } = useContext(SportsContext);
    
    // Redux hook for setting cashout team
    const { setTeam, clearTeam } = useSetCashoutTeam();
    
    const [hasActiveBets, setHasActiveBets] = useState(false);
    const exposure = localStorage.getItem('exposure')
    // Check for active bets when component mounts or myBetModel changes
    useEffect(() => {
        const checkActiveBets = async (type = 'SUPER_OVER') => {
            try {
                const matchId = sportList?.match_id || window.location.pathname.split('/').pop();
                if (matchId) {
                    const activeBets = await getActiveBets(matchId, type);
                    
                    setHasActiveBets(activeBets && activeBets.length > 0);

                }
            } catch (error) {
                console.error('Error checking active bets:', error);
                setHasActiveBets(false);
            }
        };

        checkActiveBets();
        
    }, [sportList?.match_id, exposure]);



    // Add cashout function with real-time data and automatic stake calculation
    const handleCashout = async () => {
setBetOddValue(0);
        const success = await handleCashoutLogic({
            currentMarketData: mainValue?.section || [],
            matchId: sportList?.match_id || window.location.pathname.split('/').pop(),
            betType: 'SUPER_OVER',
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
            
            
            defaultBetType: 'SUPER_OVER'
        });
        
        if (!success) {
            console.error('Cashout operation failed');
        }
    };

    // Memoize maxValue and mainValue to avoid recalculating
    const maxValue = useMemo(() => ar_sectionData?.['super_over']?.['maxb'], [ar_sectionData]);

    const mainValue = useMemo(() => ar_sectionData?.['super_over'], [ar_sectionData]);
    const sections = useMemo(() => mainValue?.['section'] || [], [mainValue]);
    // Determine if any section (runner) is ACTIVE (not suspended)
    const hasAnyActiveSection = useMemo(() => {
        if (!sections || sections.length === 0) return false;
        return sections.some((s) => s?.gstatus && s.gstatus !== 'SUSPENDED');
    }, [sections]);

    useEffect(() => {
        if (setMaxValue !== null) {
            setMaxValue((prevState) => {
                return {...prevState, 'SUPER_OVER': maxValue}
            })
        }

        if (setMinValue !== null) {
            setMinValue((prevState) => {
                return {...prevState, 'SUPER_OVER': mainValue?.['super_over']?.['min'] ?? 100}
            })
        }
        //eslint-disable-next-line
    }, [maxValue]);
    



    // Return null if there is no super_over data
    if (!ar_sectionData?.['super_over']) return null;
    
    if (!teamNames.current['SUPER_OVER']) {
        teamNames.current['SUPER_OVER'] = []; // Initialize 'SUPER_OVER' as an empty array
    }
    
    if (!allTeamName.current['SUPER_OVER']) {
        allTeamName.current['SUPER_OVER'] = [];


    }



    let debouncers = {};

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


    return (

        <div className="game-market market-4">
            <div className="market-title">
                <span>SUPER_OVER</span>
                
                <button 
                    className="float-right mb-0 btn btn-success" 
                    onClick={handleCashout}
                    disabled={!hasActiveBets}
                > 
                    Cashout   
                </button>
            </div>
            <div className="market-header">
                <div className="market-nation-detail">
                    <span className="market-nation-name">Max: {getSize(maxValue, true)}</span>
                </div>
                <div className="market-odd-box no-border d-none d-md-block"></div>
                <div className="market-odd-box no-border d-none d-md-block"></div>
                <div className="market-odd-box back"><b>Back</b></div>
                <div className="market-odd-box lay"><b>Lay</b></div>
                <div className="market-odd-box"></div>
                <div className="market-odd-box no-border"></div>
            </div>

            <div
                className={`market-body ${
                    ((mainValue.status === 'SUSPENDED' && !hasAnyActiveSection) ||
                        sportList.match_suspend_odd === 1 ||
                        sportList.match_suspend === 1)
                        ? 'suspended-table'
                        : ''
                }`}
                data-title={
                    ((mainValue.status === 'SUSPENDED' && !hasAnyActiveSection) ||
                        sportList.match_suspend_odd === 1 ||
                        sportList.match_suspend === 1)
                        ? 'SUSPENDED'
                        : ''
                }
            >
                                    {mainValue?.['section']?.map((oddsArr, key) => {

                                        const teamName = oddsArr.nat.trim() || "";
                                        if (!teamNames.current['SUPER_OVER'].includes(teamName)) {
                                            teamNames.current['SUPER_OVER'].push(teamName);
                                        }
                                        if (!allTeamName.current['SUPER_OVER'].includes(teamName)) {
                                            allTeamName.current['SUPER_OVER'].push(teamName);
                                        }

                                        // Determine if the odds are suspended
                                        let isSuspended = "", isSuspendedClass = "";
                                        let tot = mainValue.status === "OPEN" ? 1 : 0;

                                        if (sportList.match_suspend_odd === 1 || sportList.match_suspend === 1) {
                                            tot = 0;
                                        }

                                        if (tot === 0) {
                                            isSuspended = "SUSPENDED";
                                            isSuspendedClass = "suspended";
                                        }

                                        const runnerRow = `table-row-${sportList.match_id}-${key}`;
                                        const teamEx = oddsTeamData?.[teamName] ?? 0;
                                        

                                        // Organize odds only if they exist
                                        if (oddsArr.odds?.length > 0) {
                                            oddsArr = organiseOdds(oddsArr);
                                        }

                                        // Render back odds
                                        const backArr = (oddsArr.back);
                                        const backOdds = (oddsArr.back.length === 1
                                            ? backArr
                                            : backArr.slice().reverse()
                                        ).map((back, b_key) => {




                                            
                                            const backFunction = generateBackAndLayFunction(
                                                tot, oddsArr, 'back', teamName, runnerRow, oddsArr.back.length - 1, 'SUPER_OVER',
                                                setBetOddValue, setbackOrLay, teamNames, setPopupDisplay,
                                                setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType,
                                                null,

                                                setBetTypeFromArray, 'super_over',
                                                undefined,
                                                undefined,
                                                clearTeam
                                            );


                                            

                                            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
                                            if (oddsChange.current[`oddsback${key}${b_key}`] === undefined) {
                                                oddsChange.current[`oddsback${key}${b_key}`] = back.odds;
                                            } else if (oddsChange.current[`oddsback${key}${b_key}`] !== back.odds) {
                                                updateOdds(`oddsback${key}${b_key}`, back.odds);
                                            }


                                            // Determine the back class based on position
                                            const backClass = b_key === 0 ? 'back' : b_key === 1 ? 'back1' : 'back2';
                                            
                                            return (
                                                <div
                                                    className={`market-odd-box ${backClass} ${oddsChange.current[`oddsback${key}${b_key}`] !== back.odds && oddsChange.current[`oddsback${key}${b_key}`] !== undefined ? 'blink' : ''}`}
                                                    onClick={backFunction[b_key]}
                                                    key={b_key}
                                                >
                                                    <span className="market-odd">{back.odds || "-"}</span>
                                                    <span className="market-volume">{ tot === 0 ? '' : getSize(back.size, false) || ""}</span>
                                                </div>
                                            );
                                        });

                                        // Render lay odds
                                        const layArr = (oddsArr.lay);
                                        const layOdds = layArr.map((lay, l_key) => {
                                            

                                            // Initialize oddsChange if it doesn't exist to prevent initial yellow class
                                            if (oddsChange.current[`oddslay${key}${l_key}`] === undefined) {
                                                oddsChange.current[`oddslay${key}${l_key}`] = lay.odds;
                                            } else if (oddsChange.current[`oddslay${key}${l_key}`] !== lay.odds) {
                                                updateOdds(`oddslay${key}${l_key}`, lay.odds);
                                            }


                                            const layFunction = generateBackAndLayFunction(
                                                tot, oddsArr, 'lay', teamName, runnerRow, 0, 'SUPER_OVER',
                                                setBetOddValue, setbackOrLay, teamNames, setPopupDisplay,
                                                setDefaultTeamName, runnerRowDefault, rootClassDefault, setBetType,
                                                null,

                                                setBetTypeFromArray, 'super_over',
                                                undefined,
                                                undefined,
                                                clearTeam
                                            );

                                            // Determine the lay class based on position
                                            const layClass = l_key === 0 ? 'lay' : l_key === 1 ? 'lay1' : 'lay2';
                                            
                                            return (
                                                <div
                                                    className={`market-odd-box ${layClass} ${oddsChange.current[`oddslay${key}${l_key}`] !== lay.odds && oddsChange.current[`oddslay${key}${l_key}`] !== undefined ? 'blink' : ''}`}
                                                    onClick={layFunction[l_key]}
                                                    key={l_key}
                                                >
                                                    <span className="market-odd">{lay.odds || "-"}</span>
                                                    <span className="market-volume">{ tot === 0 ? '' : getSize(lay.size, false) || ""}</span>
                                                </div>
                                            );
                                        });
                                        if (!teamNameCurrentBets.current?.['SUPER_OVER']) {
                                            teamNameCurrentBets.current['SUPER_OVER'] = [];
                                            teamNameCurrentBets.current['SUPER_OVER'][teamName] = ''
                                        }

                                        teamNameCurrentBets.current['SUPER_OVER'][teamName] = teamEx
                                        return (
                                            <div
                                                className={`market-row ${runnerRow} ${isSuspendedClass}`}
                                                data-title={isSuspended || "ACTIVE"}
                                                key={key}
                                            >
                                                <div className="market-nation-detail">
                                                    <span className="market-nation-name">{teamName}</span>
                                                    <div className="market-nation-book">
                                                        <span className={`teamEx`}>
                                                            {getExByColor(teamEx, true)}
                                                        </span>
                                                        <span
                                                            className={`${placingBets?.['SUPER_OVER']?.[teamName] < 0 ? 'market-live-book d-none d-xl-block text-danger' : 'market-live-book d-none d-xl-block text-success '} `}>
                                                            {placingBets?.['SUPER_OVER']?.[teamName] ?? ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                {backOdds}
                                                {layOdds}
                                            </div>
                                        );
                                    })}
                {mainValue?.rem && (
                    <div className="market-row">
                        <marquee className="market-remark">{mainValue.rem}</marquee>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuperOver;
