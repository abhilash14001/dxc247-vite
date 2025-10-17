import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck, fetchAndHandleResultPopup
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Goal = () => {
    const [roundId, setRoundId] = useState(null)
    const teamNameCurrentBets = useRef({})
    const roundIdSaved = useRef(null);
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const {match_id} = useParams();
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)
    const [hideLoading, setHideLoading] = useState(true)


    const ruleDescription = `<div><style type="text/css">
    .rules-section .row.row5 {
        margin-left: -5px;
        margin-right: -5px;
    }

    .rules-section .pl-2 {
        padding-left: .5rem !important;
    }

    .rules-section .pr-2 {
        padding-right: .5rem !important;
    }
 .rules-section .pl-4 {
        padding-left: 1.5rem !important;
    }

    .rules-section .pr-4 {
        padding-right: 1.5rem !important;
    }


    .rules-section .row.row5>[class*="col-"],
    .rules-section .row.row5>[class*="col"] {
        padding-left: 5px;
        padding-right: 5px;
    }

    .rules-section {
        text-align: left;
        margin-bottom: 10px;
    }

    .rules-section .table {
        color: #fff;
        border: 1px solid #444;
        background-color: #222;
        font-size: 12px;
    }

    .rules-section .table td,
    .rules-section .table th {
        border-bottom: 1px solid #444;
    }

    .rules-section ul li,
    .rules-section p {
        margin-bottom: 5px;
    }

    .rules-section::-webkit-scrollbar {
        width: 8px;
    }

    .rules-section::-webkit-scrollbar-track {
        background: #666666;
    }

    .rules-section::-webkit-scrollbar-thumb {
        background-color: #333333;
    }

    .rules-section .rules-highlight {
        color: #FDCF13;
        font-size: 16px;
    }

    .rules-section .rules-sub-highlight {
        color: #FDCF13;
        font-size: 14px;
    }

    .rules-section .list-style,
    .rules-section .list-style li {
        list-style: disc;
    }

    .rules-section .rule-card {
        height: 20px;
        margin-left: 5px;
    }

    .rules-section .card-character {
        font-family: Card Characters;
    }

    .rules-section .red-card {
        color: red;
    }

    .rules-section .black-card {
        color: black;
    }

    .rules-section .cards-box {
        background: #fff;
        padding: 6px;
        display: inline-block;
        color: #000;
        min-width: 150px;
    }
.rules-section img {
  max-width: 100%;
}
    </style>

<div class="rules-section">
                                            <h6 class="rules-highlight">1. Objective</h6>
                                            <p>The goal of this game is to predict which player or method will result in the next goal, providing players with exciting opportunities to win big.</p>
                                        </div>
                                        <br></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">2. Betting Options</h6>
                                            <ul class="pl-2 pr-2 ">
                                                <li>
                                                    <h7 class="rules-sub-highlight">1.Who Will Goal Next?</h7>
                                                    <ul class="pl-4 pr-4 list-style">
                                                        <li><b>Description:</b> Predict which player (from the available player selection) will score the next goal.</li>
                                                        <li><b>Winning Criteria:</b> If the selected player scores the next goal, the bet is won.</li>
                                                        <li><b>No Goal Condition:</b> If no goal is scored by any player (i.e., the shot is missed or saved), the bet is considered a No Goal.</li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <h7 class="rules-sub-highlight">2. Method of the Next Goal</h7>
                                                    <ul class="pl-4 pr-4 list-style">
                                                        <li><b>Description:</b> Predict the method by which the next goal will be scored. The following options are available:
                                                            <ul class="pl-4 pr-4 list-style">
                                                                <li><b>Header Goal:</b> The goal scorer must use their head to score. The last touch on the ball before entering the net must be from the head.</li>
                                                                <li><b>Free-kick Goal:</b> The goal must be scored directly from a free-kick, meaning no additional touches are allowed before the ball crosses the goal line.</li>
                                                                <li><b>Penalty Goal:</b> The goal must be scored from a penalty, and the penalty taker must be the one who scores.</li>
                                                                <li><b>Shot Goal:</b> This includes all other types of goals that are not covered by the above categories, including shots from open play, volleys, or any other direct goals.</li>
                                                            </ul>
                                                        </li>
                                                        
                                                        <li><b>Winning Criteria:</b> If the goal is scored by the method selected, the bet is won.</li>
                                                        <li><b>No Goal Condition:</b> If the goal attempt fails or is blocked, the bet is considered a No Goal.</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
<br></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">3. General Rules</h6>
                                            <p><b>No Goal Condition:</b> In all instances, if no goal is scored (due to a miss, save, or other reasons), the bet will be marked as a No Goal.</p>
                                            <p><b>Goal Misses or Saved Shots:</b> If a player misses or the shot is saved, bets placed on that player or method will be settled as No Goal.</p>
                                            <p><b>Broadcast Delays:</b> Please note that the video feeds used to confirm goal outcomes may come from different broadcasters, which can result in a delay in updating the scoreboard. However, the final result will be determined by our official rules and the video evidence available at the time.</p>
                                        </div>
                                        <br></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">4. Disclaimers</h6>
                                            <p><b>Official Decision:</b> In case of any disputes regarding the goal, the casino’s decision based on video reviews will be final.</p>
                                            <p><b>Video Evidence:</b> The casino reserves the right to use available video footage to confirm whether a goal was scored by the chosen player or method. If the footage is inconclusive, the bet may be voided and refunded.</p>
                                        </div>
                                        <br></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">5. Terms of Participation</h6>
                                            <p>All players must be aware of the potential delay in goal announcements due to broadcast lag.</p>
                                            <p>Players accept that the casino's decision is final in the event of any discrepancies.</p>
                                            <br>
                                            <p class="text-center"><b>"Best of luck! Enjoy the excitement of the casino and win BIG!"</b></p>
                                        </div></div>`;
    
    const [data, setData] = useState([]);
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);
    const remark = useRef('Welcome');
    const [playerStatuses, setPlayerStatuses] = useState({});
    const [showGoalPopup, setShowGoalPopup] = useState(false);
    const [goalResult, setGoalResult] = useState('');
    const [previousRoundId, setPreviousRoundId] = useState('');
  
    // Goal Players Data
    const [goalPlayers, setGoalPlayers] = useState([
        { name: 'Cristiano Ronaldo', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Lionel Messi', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Robert Lewandowski', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Neymar', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Harry Kane', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Zlatan Ibrahimovic', odds: 0, status: 'suspended', min: 100, max: 50000, exposure : '' },
        { name: 'Romelu Lukaku', odds: 0, status: 'suspended', min: 100, max: 50000, exposure : '' },
        { name: 'Kylian Mbappe', odds: 0, status: 'suspended', min: 100, max: 50000, exposure : '' },
        { name: 'Erling Haaland', odds: 0, status: 'suspended', min: 100, max: 50000, exposure : '' },
        { name: 'No Goal', odds: 0, status: 'suspended', min: 100, max: 25000, exposure : '' }
    ]);

    // Method of Goal Data
    const [goalMethods, setGoalMethods] = useState([
        { name: 'Shot Goal', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Header Goal', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Penalty Goal', odds: 0, status: 'suspended', min: 100, max: 100000, exposure : '' },
        { name: 'Free Kick Goal', odds: 0, status: 'suspended', min: 100, max: 50000, exposure : '' },
        { name: 'No Goal', odds: 0, status: 'suspended', min: 100, max: 25000, exposure : '' }
    ]);


    useEffect(() => {
        

        if (data?.sub) {
            // Separate players and goal methods from API data
            const playersData = data.sub.filter(item => item.subtype === 'player');
            const methodsData = data.sub.filter(item => item.subtype === 'goal');

            // Update playerStatuses for all players and methods
            const newPlayerStatuses = {};
            
            // Update goal players from API data
            const updatedPlayers = goalPlayers.map(player => {
                const apiData = playersData.find(item => item.nat === player.name);
                if (apiData) {
                    const playerStatus = apiData.gstatus === 'OPEN' ? '' : 'suspended';
                    newPlayerStatuses[player.name] = playerStatus;
                    
                    return {
                        ...player,
                        odds: apiData.b || 0,
                        layOdds: apiData.l || 0,
                        backSize: apiData.bs || 0,
                        laySize: apiData.ls || 0,
                        status: apiData.gstatus === 'OPEN' ? 'active' : 'suspended',
                        min: apiData.min || player.min,
                        max: apiData.max || player.max,
                        sid: apiData.sid
                    };
                }
                
                return player;
            });
            setGoalPlayers(updatedPlayers);

            // Update goal methods from API data
            const updatedMethods = goalMethods.map(method => {
                const apiData = methodsData.find(item => item.nat === method.name);
                if (apiData) {
                    const methodStatus = apiData.gstatus === 'OPEN' ? '' : 'suspended';
                    newPlayerStatuses[method.name] = methodStatus;
                    
                    return {
                        ...method,
                        odds: apiData.b || 0,
                        layOdds: apiData.l || 0,
                        backSize: apiData.bs || 0,
                        laySize: apiData.ls || 0,
                        status: apiData.gstatus === 'OPEN' ? 'active' : 'suspended',
                        min: apiData.min || method.min,
                        max: apiData.max || method.max,
                        sid: apiData.sid
                    };
                }
                
                return method;
            });
            setGoalMethods(updatedMethods);
            
            // Set the playerStatuses state
            setPlayerStatuses(newPlayerStatuses);
        }

    }, [data?.sub]);

    // Handle round ID changes and show goal popup
    useEffect(() => {
        
        if (roundId && data?.mid && previousRoundId && previousRoundId !== roundId) {
            // Call API with previous round ID to get the result of completed round
            fetchAndHandleResultPopup(previousRoundId, 'goal', setGoalResult, setShowGoalPopup, 'goal', 1500);
        }
        
        // Update previous round ID for next change
        if (roundId) {
            setPreviousRoundId(roundId);
        }
    }, [roundId]);


    // Update exposure amounts for players using separate API calls for different bet types
    const updateAmount = async () => {
        if (sportList?.id && data?.mid) {
            try {
                // Get player names for WHO_WILL_GOAL_NEXT bet type
                const playerNames = goalPlayers.map(player => player.name);
                
                // Get method names for METHOD_OF_NEXT_GOAL bet type
                const methodNames = goalMethods.map(method => method.name);

                // Make separate API calls for different bet types
                const [playerRes, methodRes] = await Promise.all([
                    // API call for players with WHO_WILL_GOAL_NEXT bet type
                    getExByTeamNameForCasino(
                        sportList.id, 
                        data.mid, 
                        playerNames, 
                        match_id, 
                        'WHO_WILL_GOAL_NEXT', 
                        true // batch request flag
                    ),
                    // API call for methods with METHOD_OF_NEXT_GOAL bet type
                    getExByTeamNameForCasino(
                        sportList.id, 
                        data.mid, 
                        methodNames, 
                        match_id, 
                        'METHOD_OF_NEXT_GOAL', 
                        true // batch request flag
                    )
                ]);
                
                // Update exposures for goal players
                if (playerRes?.data) {
                    setGoalPlayers(prevPlayers => 
                        prevPlayers.map(player => ({
                            ...player,
                            exposure: playerRes.data[player.name] || 0
                        }))
                    );
                }

                // Update exposures for goal methods
                if (methodRes?.data) {
                    setGoalMethods(prevMethods => 
                        prevMethods.map(method => ({
                            ...method,
                            exposure: methodRes.data[method.name] || 0
                        }))
                    );
                }
            } catch (error) {
                console.error('Error updating exposures:', error);
            }
        }
    };
    const exposure = exposureCheck();
    
    useEffect(() => {


        if (data?.sub && sportList?.id) {
            updateAmount();
        }
    }, [roundId, exposure]);
    const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {
        setBetType(betType);
        loss.current = '';
        profit.current = '';

        // Check if player/method is suspended
        if (playerStatuses[teamnam] === 'suspended') {
            Notify(`Bet Not Confirmed. Reason: ${teamnam} is suspended`, null, null, 'danger');
            return;
        }

        if (parseFloat(oddvalue) > 0) {
            roundIdSaved.current = roundId;
            setbackOrLay(isBakOrLay);
            setPopupDisplayForDesktop(true);
            teamname.current = teamnam;
            setOdds(oddvalue);
        } else {
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger');
        }
    };

    // Helper function to find data in data.sub for Goal
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds;
        if (backOrLay === 'back') {
            loss.current = stakeValue.current.value;
            profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
        } else {
            profit.current = profitData.current = stakeValue.current.value;
            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
        }
    };


    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: betType,
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: null,
            playerStatuses: playerStatuses[teamname.current],
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: updateAmount,
            Notify
        };

        const success = await placeCasinoBet(betData, {
            odd_min_limit: () => {
                if (teamname.current && betType) {
                    const foundData = findDataInSub(teamname.current, betType);
                    if (foundData && foundData.min) {
                        return foundData.min;
                    }
                }
                return null;
            },
            odd_max_limit: () => {
                if (teamname.current && betType) {
                    const foundData = findDataInSub(teamname.current, betType);
                    if (foundData && foundData.max) {
                        return foundData.max;
                    }
                }
                return null;
            },
            onSuccess: () => {
                //  is already handled by placeCasinoBet
            }
        });

        return success;
    }

    // Function to get current min/max limits for the active bet
    const getMinMaxLimits = () => {
        if (teamname.current && betType) {
            const foundData = findDataInSub(teamname.current, betType);
            if (foundData) {
                return {
                    min: foundData.min || 100,
                    max: foundData.max || 100000
                };
            }
        }
        return { min: 100, max: 100000 }; // Default fallback
    };

    return (
        
           
            <CasinoLayout
                raceClass="ball-by-ball goal"
                ruleDescription={ruleDescription} 
                hideLoading={hideLoading} 
                isBack={backOrLay} 
                teamname={teamname} 
                handleStakeChange={casinoBetDataNew} 
                odds={odds}
                stakeValue={stakeValue} 
                setOdds={setOdds} 
                placeBet={placeBet}
                submitButtonDisable={submitButtonDisable} 
                data={data} 
                roundId={roundId} 
                setRoundId={setRoundId}
                      sportList={sportList}
                setSportList={setSportList} 
                setData={setData} 
                setLastResult={setLastResult}
                getMinMaxLimits={getMinMaxLimits}
                goalResult={goalResult}
                showGoalPopup={showGoalPopup}
            >
            <div className="casino-detail detail-page-container position-relative">
                {/* Goal Popup - shows when round ID changes */}
             
                {/* Who Will Goal Next Market */}
                <div className="game-market market-6 container-fluid container-fluid-5">
                    <div className="market-title row row5">Who Will Goal Next?</div>
                    <div className="market-header row row5">
                        <div className="col-12 col-md-12 d-none d-md-block">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                </div>
            </div>
                        <div className="col-12 col-md-4 d-md-none">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                    <div className="market-body row">
                        {goalPlayers.map((player, index) => (
                            <div key={index} className="col-12 col-md-12">
                                <div className="fancy-market" data-title={player.status.toUpperCase()}>
                                    <div className="market-row">
                                        <div className="market-nation-detail">
                                            <span className="market-nation-name pointer">{player.name}</span>
                                            <div className="market-book float-end">
                                                {getExByColor(player.exposure)}
                                            </div>
                                        </div>
                                        <div className={`blb-box ${player.status === 'suspended' ? 'suspended-box' : ''}`}>
                                            <div 
                                                className="market-odd-box back" 
                                                onClick={() => player.status !== 'suspended' && openPopup('back', player.name, player.odds, 'WHO_WILL_GOAL_NEXT')}
                                            >
                                                <span className="market-odd">
                                                    {player.status === 'suspended' ? '-' : player.odds || '-'}
                                                </span>
                                                <span className="market-volume">
                                                    {player.status === 'suspended' ? '-' : player.backSize || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="fancy-min-max-box">
                                            <div className="fancy-min-max">
                                                <span className="w-100 d-block">Min: {player.min}.00</span>
                                                <span className="w-100 d-block">Max: {player.max >= 100000 ? '1L' : `${player.max/1000}K`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Method Of Next Goal Market */}
                <div className="game-market market-6 container-fluid container-fluid-5">
                    <div className="market-title row row5">Method Of Next Goal</div>
                    <div className="market-header row row5">
                        <div className="col-12 col-md-12 d-none d-md-block">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 d-md-none">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                    <div className="market-body row">
                        {goalMethods.map((method, index) => (
                            <div key={index} className="col-12 col-md-12">
                                <div className="fancy-market" data-title={method.status.toUpperCase()}>
                                    <div className="market-row">
                                        <div className="market-nation-detail">
                                            <span className="market-nation-name pointer">{method.name}</span>
                                            <div className="exposure-display">
                                                {getExByColor(method.exposure)}
                                            </div>
                                        </div>
                                        <div className={`blb-box ${method.status === 'suspended' ? 'suspended-box' : ''}`}>
                                            <div 
                                                className="market-odd-box back" 
                                                onClick={() => method.status !== 'suspended' && openPopup('back', method.name, method.odds, 'METHOD_OF_NEXT_GOAL')}
                                            >
                                                <span className="market-odd">
                                                    {method.status === 'suspended' ? '-' : method.odds || '-'}
                                                </span>
                                                <span className="market-volume">
                                                    {method.status === 'suspended' ? '-' : method.backSize || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="fancy-min-max-box">
                                            <div className="fancy-min-max">
                                                <span className="w-100 d-block">Min: {method.min}.00</span>
                                                <span className="w-100 d-block">Max: {method.max >= 100000 ? '1L' : `${method.max/1000}K`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Casino Remark */}
                <div className="casino-remark mt-1">
                    <div className="remark-icon">
                        <img src="/img/icons/remark.png" alt="remark" />
                    </div>
                    <marquee scrollamount="3">{data?.remark || 'Results are based on stream only'}</marquee>
                </div>

                {/* Last Results */}
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                    <span><a href="/casino-results/goal">View All</a></span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>
        </CasinoLayout>
        
    );

};

export default Goal;
