import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import {
    getExByTeamNameForCasino, getExBySingleTeamNameCasino, resetBetFields, placeCasinoBet, getSize,
    exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const BallByBall = () => {
    const [roundId, setRoundId] = useState('')


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(true)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const { match_id } = useParams();
    const isOneDay = match_id.includes('20') ? false : true;

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

<div className="rules-section">
                                            <ul className="pl-4 pr-4 list-style">
                                                <li>Ball by Ball is an exciting cricket betting game where you can bet on the outcome of each ball delivery.</li>
                                                <li>Each ball can result in different outcomes: 0, 1, 2, 3, 4, 6 runs, Boundary, Wicket, or Extra Runs.</li>
                                                <li>Place your bets before each ball is bowled and watch the live action unfold.</li>
                                                <li>The game features real-time odds and multiple betting options for maximum excitement.</li>
                                                <li>Good Luck and enjoy the ball-by-ball action!</li>
                                            </ul>
                                        </div>
</div>`;
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)
    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({});
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value
    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    
    // BallByBall runs betting options state
    const [runsOdds, setRunsOdds] = useState([]);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        if (data?.sub) {
            // Update runs betting options from API data
            const runsData = data.sub.map(item => ({
                sid: item.sid,
                nat: item.nat,
                back: item.b,
                backSize: item.bs,
                lay: item.l,
                laySize: item.ls,
                status: item.gstatus,
                visible: item.visible,
                min: item.min,
                max: item.max,
                amounts: runsOdds.find(run => run.nat === item.nat)?.amounts || 0
            }));
            setRunsOdds(runsData);
        }
    }, [data?.sub]);


    

    useEffect(() => {
        // Set remark from API data
        if (data?.remark) {
            remark.current = data.remark || 'Welcome to Ball by Ball';
        }
    }, [data?.remark]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    useEffect(() => {
        if (sportList?.id && runsOdds.length > 0) {
            refreshAllExposures();
        }
    }, [exposure, roundId, sportList?.id, runsOdds.length]);

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, teamsession) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-box";

        }
        setPlayerStatuses(prev => ({ ...prev, [playerName]: playerStatus }));

        if (playerData.b) {
            setPlayerBack(playerData.b);
        } else {
            setPlayerBack(0);
        }
        if (playerData.l) {
            setPlayerLay(playerData.l);
        } else {
            setPlayerLay(0);
        }
    };
    const openPopup = (isBakOrLay, teamnam, oddvalue) => {
        // Set bet type for BallByBall based on team name
        const runsOptions = ['0 Runs', '1 Runs', '2 Runs', '3 Runs', '4 Runs', '6 Runs', 'Boundary'];
        const wicketsOptions = ['Wicket', 'Caught', 'Bowled', 'Run Out', 'LBW', 'Stumped', 'Others'];
        const extrasOptions = ['Extra Runs', 'Wide', 'No Ball', 'Bye', 'Leg Bye'];

        if (runsOptions.includes(teamnam)) {
            setBetType('RUNS');
        } else if (wicketsOptions.includes(teamnam)) {
            setBetType('WICKETS');
        } else if (extrasOptions.includes(teamnam)) {
            setBetType('EXTRAS');
        } else {
            setBetType('BOOKMAKER'); // Default fallback
        }

        if (parseFloat(oddvalue) > 0) {
            roundIdSaved.current = roundId
            setbackOrLay(isBakOrLay)
            setPopupDisplayForDesktop(true);
            
            teamname.current = teamnam
            setOdds(oddvalue)
        } else {
            Notify("Odds Should Not Be Zero", null, null, 'danger')
        }
    }

    // Helper function to find data in data.sub for BallByBall
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For BallByBall, find the item by nat field (e.g., "0 Runs", "1 Runs", etc.)
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        if (submitButtonDisable === true) {
            setSubmitButtonDisable(false)
        }
        if (backOrLay === 'back') {


            loss.current = stakeValue.current.value;


            profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)

        } else {

            profit.current = profitData.current = stakeValue.current.value;


            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
        }



    }

    const renderCards = (cards, player) => (
        <div className="flip-card-container">
            {cards?.map((card, index) => {
                const imgSrc = card ? `/img/casino/cards/${card}.png` : '/img/casino/cards/1.png';
                return (
                    <div className="flip-card" key={index}>
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Helper function to get exposure by color like other casino games
    const getExByColor = (exposure) => {
        if (exposure > 0) {
            return <span className="text-success">{exposure}</span>;
        } else if (exposure < 0) {
            return <span className="text-danger">{exposure}</span>;
        } else {
            return <span>{exposure}</span>;
        }
    };

    const refreshAllExposures = () => {
        runsOdds.forEach((runOption, index) => {
            // Determine betType based on team name
            const runsOptions = ['0 Runs', '1 Runs', '2 Runs', '3 Runs', '4 Runs', '6 Runs', 'Boundary'];
            const wicketsOptions = ['Wicket', 'Caught', 'Bowled', 'Run Out', 'LBW', 'Stumped', 'Others'];
            const extrasOptions = ['Extra Runs', 'Wide', 'No Ball', 'Bye', 'Leg Bye'];

            let betTypeForExposure = 'BOOKMAKER'; // Default fallback
            if (runsOptions.includes(runOption.nat)) {
                betTypeForExposure = 'RUNS';
            } else if (wicketsOptions.includes(runOption.nat)) {
                betTypeForExposure = 'WICKETS';
            } else if (extrasOptions.includes(runOption.nat)) {
                betTypeForExposure = 'EXTRAS';
            }

            // Use getExBySingleTeamNameCasino with betType parameter
            getExBySingleTeamNameCasino(sportList.id, roundId, runOption.nat, match_id, betTypeForExposure).then(res => {
                setRunsOdds(prev => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], amounts: res.data || 0 };
                    return updated;
                });
            }).catch(error => {
                console.error(`Error fetching exposure for ${runOption.nat}:`, error);
            });
        });
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
            betType,
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: Object.keys(playerStatuses).length > 0 ? playerStatuses : null,
            playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: null,
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
                // Refresh all run exposures after successful bet
                refreshAllExposures();
            }
        });

        return success;
    }

    const renderVideoBox = () => {

      if(!data?.rdesc || data.rdesc === '') return null;
        return (
            <div className="cricket20ballpopup">
                <img src="https://g1ver.sprintstaticdata.com/v69/static/front/img/balls/ball-blank.png" />
                <span>{data?.rdesc }</span>
            </div>
        )
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
        <CasinoLayout ruleDescription={ruleDescription} raceClass="ball-by-ball" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} setSubmitButton={setSubmitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-detail detail-page-container position-relative">
                <div className="game-market market-6 container-fluid container-fluid-5">
                    <div className="market-title row row5">Runs</div>
                    <div className="market-header row row5">
                        <div className="col-12 col-md-4 d-none d-md-block">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 d-none d-md-block">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="market-row">
                                <div className="market-nation-detail"></div>
                                <div className="market-odd-box back"><b>Back</b></div>
                            </div>
                        </div>
                        <div className="fancy-min-max-box"></div>
                    </div>
                    <div className="market-body row row5">
                        {runsOdds.map((runOption, index) => (
                            <div key={runOption.sid} className="col-12 col-md-4">
                                <div className="fancy-market" data-title={runOption.status}>
                                    <div className="market-row">
                                        <div className="market-nation-detail">
                                            <span className="market-nation-name pointer">{runOption.nat}</span>
                                        </div>
                                        <div className={`blb-box ${runOption.status === 'SUSPENDED' ? 'suspended-box' : ''}`}>
                                            <div className="market-odd-box back"
                                                 onClick={() => runOption.status !== 'SUSPENDED' && runOption.back > 0 && openPopup('back', runOption.nat, runOption.back)}>
                                                <span className="market-odd">
                                                    {runOption.status === 'SUSPENDED' ? '-' : (runOption.back || 0)}
                                                </span>
                                                {runOption.status !== 'SUSPENDED' && runOption.backSize > 0 && (
                                                    <span className="market-volume">{runOption.backSize}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="fancy-min-max-box">
                                            <div className="fancy-min-max">
                                                <span className="w-100 d-block">Min: {runOption.min || 0}</span>
                                                <span className="w-100 d-block">Max: {getSize(runOption.max, true) || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="casino-remark mt-1">
                    <div className="remark-icon">
                        <img src="/img/icons/remark.png" alt="remark" />
                    </div>
                    <marquee scrollamount="3">{remark.current}</marquee>
                </div>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                    <span>
                        <a href="/casino-results/ballbyball">View All</a>
                    </span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                </div>
            </div>


        </CasinoLayout>
    );

};

export default BallByBall;