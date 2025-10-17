import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    resetBetFields,
    getExByTeamNameForCasino, getPlayerCardAccordingToNumberOfPlayers, updatePlayerStats, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";

import Notify from "../utils/Notify";

const Poker = () => {
    const [roundId, setRoundId] = useState('')

    const ruleImage = '/img/rules/poker.jpeg'
    
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

    const [hideLoading, setHideLoading] = useState(true)


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({
        "Player A": 'suspended-box', 
        "Player B": 'suspended-box',
        "Player A 2 card Bonus": 'suspended-box',
        "Player A 7 card bonus": 'suspended-box',
        "Player B 2 card Bonus": 'suspended-box',
        "Player B 7 card bonus": 'suspended-box'
    });
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value

    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('ODDS')

        if (data?.sub) {
            // Main players (sid: 1, 2)
            updatePlayerStats(data.sub[0], setPlayerA_Back, setPlayerA_Lay, "Player A", setPlayerStatuses, 'suspended-box');
            updatePlayerStats(data.sub[1], setPlayerB_Back, setPlayerB_Lay, "Player B", setPlayerStatuses, 'suspended-box');
            
            // Bonus players (sid: 3, 4, 5, 6)
            if (data.sub[2]) {
                updatePlayerStats(data.sub[2], () => {}, () => {}, "Player A 2 card Bonus", setPlayerStatuses, 'suspended-box');
            }
            if (data.sub[3]) {
                updatePlayerStats(data.sub[3], () => {}, () => {}, "Player A 7 card bonus", setPlayerStatuses, 'suspended-box');
            }
            if (data.sub[4]) {
                updatePlayerStats(data.sub[4], () => {}, () => {}, "Player B 2 card Bonus", setPlayerStatuses, 'suspended-box');
            }
            if (data.sub[5]) {
                updatePlayerStats(data.sub[5], () => {}, () => {}, "Player B 7 card bonus", setPlayerStatuses, 'suspended-box');
            }
        }

    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id, 'ODDS').then(res => setPlayerA(res.data))

            getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id, 'ODDS').then(res => setPlayerB(res.data))
        }
    }, [exposure, sportLength, roundId]);


    const openPopup = (isBakOrLay, teamnam, oddvalue) => {


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

    // Helper function to find data in data.sub for Poker
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Poker, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        if (backOrLay === 'back') {


            loss.current = stakeValue.current.value;


            profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)

        } else {

            profit.current = profitData.current = stakeValue.current.value;


            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
        }


    }


    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "ODDS",
            stakeValue,
            match_id: "POKER",
            roundIdSaved,
            totalPlayers: null,
            playerStatuses: playerStatuses[teamname.current],
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
                //  is already handled by placeCasinoBet
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="casino-video-cards">
                <div className="d-flex flex-wrap justify-content-between">
                    <div>
                        <h5>Player A</h5>
                        <div className="flip-card-container">
                            {getPlayerCardAccordingToNumberOfPlayers(data, 1, 9, [0, 1]).map((card, index) => (
                                <div key={index} className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={card} alt={`Player A card ${index}`}/>
                                        </div>
                                        <div className="flip-card-back">
                                            <img src={card} alt={`Player A card ${index}`}/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5>Player B</h5>
                        <div className="flip-card-container justify-content-end">
                            {getPlayerCardAccordingToNumberOfPlayers(data, 1, 9, [2, 3]).map((card, index) => (
                                <div key={index} className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={card} alt={`Player B card ${index}`}/>
                                        </div>
                                        <div className="flip-card-back">
                                            <img src={card} alt={`Player B card ${index}`}/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-1">
                    <h5>Board</h5>
                    <div className="flip-card-container">
                        {getPlayerCardAccordingToNumberOfPlayers(data, 1, 9, [4, 5, 6, 7, 8]).map((card, index) => (
                            <div key={index} className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={card} alt={`Board card ${index}`}/>
                                    </div>
                                    <div className="flip-card-back">
                                        <img src={card} alt={`Board card ${index}`}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
        <CasinoLayout raceClass="poker1day" ruleImage={ruleImage} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="casino-table-box">
                    <div className="casino-table-left-box">
                        <div className="casino-table-body">
                            <div className="casino-table-row">
                                <div className="casino-nation-detail">
                                    <div className="casino-nation-name">Player A</div>
                                    <div>{getExByColor(playerA)}</div>
                                </div>
                                <div className={`casino-odds-box back ${playerStatuses['Player A']}`}
                                     onClick={() => openPopup('back', 'Player A', playerA_Back)}>
                                    <span className="casino-odds">{playerA_Back}</span>
                                </div>
                                <div className={`casino-odds-box lay ${playerStatuses['Player A']}`}
                                     onClick={() => openPopup('lay', 'Player A', playerA_Lay)}>
                                    <span className="casino-odds">{playerA_Lay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="casino-table-box-divider"></div>
                    <div className="casino-table-right-box">
                        <div className="casino-table-body">
                            <div className="casino-table-row">
                                <div className="casino-nation-detail">
                                    <div className="casino-nation-name">Player B</div>
                                    <div>{getExByColor(playerB)}</div>
                                </div>
                                <div className={`casino-odds-box back ${playerStatuses['Player B']}`}
                                     onClick={() => openPopup('back', 'Player B', playerB_Back)}>
                                    <span className="casino-odds">{playerB_Back}</span>
                                </div>
                                <div className={`casino-odds-box lay ${playerStatuses['Player B']}`}
                                     onClick={() => openPopup('lay', 'Player B', playerB_Lay)}>
                                    <span className="casino-odds">{playerB_Lay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="poker1day-other-odds">
                    <div className="casino-table-left-box">
                        <div className="w-100 d-xl-none mobile-nation-name">Player A</div>
                        <div className={`casino-odds-box back ${playerStatuses['Player A 2 card Bonus']}`}>
                            <span className="casino-odds">2 Cards Bonus</span>
                        </div>
                        <div className={`casino-odds-box back ${playerStatuses['Player A 7 card bonus']}`}>
                            <span className="casino-odds">7 Cards Bonus</span>
                        </div>
                    </div>
                    <div className="casino-table-box-divider"></div>
                    <div className="casino-table-right-box">
                        <div className="w-100 d-xl-none mobile-nation-name">Player B</div>
                        <div className={`casino-odds-box back ${playerStatuses['Player B 2 card Bonus']}`}>
                            <span className="casino-odds">2 Cards Bonus</span>
                        </div>
                        <div className={`casino-odds-box back ${playerStatuses['Player B 7 card bonus']}`}>
                            <span className="casino-odds">7 Cards Bonus</span>
                        </div>
                    </div>
                </div>
                <div className="casino-remark mt-1">
                    <marquee scrollamount="3">{remark.current}</marquee>
                </div>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>


        </CasinoLayout>
    );

};


export default Poker;
