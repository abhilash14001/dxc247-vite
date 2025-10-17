import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, getPlayerCardAccordingToNumberOfPlayers, resetBetFields, updatePlayerStats, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Poker20 = () => {
    const [roundId, setRoundId] = useState('')

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


    const [data, setData] = useState([]);

    const handRanks = [
        "Winner",
        "One Pair",
        "Two Pair",
        "Three of a Kind",
        "Straight",
        "Flush",
        "Full House",
        "Four of a Kind",
        "Straight Flush"
    ];

    const [playerStatuses, setPlayerStatuses] = useState(() => {
        const initialStatus = {};
        handRanks.forEach(rank => {
            initialStatus[rank] = 'suspended-box'


        });
        return initialStatus;
    });

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('ODDS')

        if (data?.sub) {


            const t2Data = data.sub;


            const playerAdata = t2Data.slice(0, 9);
            const playerBdata = t2Data.slice(9, 18);

            t2Data.forEach((value) => {


                updatePlayerStats(value, null, null, value.nat, setPlayerStatuses, 'suspended-box')

            })


            playerAdata.forEach(value => {


                const {b, nat} = value
                if (oddsData[nat]) {
                    setOddsData(prevOdds => ({
                        ...prevOdds,
                        [nat]: {
                            ...prevOdds[nat],  // Spread the previous data for the specific rank
                            "Player A": b      // Update only the "Player A" field
                        }
                    }));
                }
            })
            playerBdata.forEach(value => {

                const {b, nat} = value
                if (oddsData[nat]) {
                    setOddsData(prevOdds => ({
                        ...prevOdds,
                        [nat]: {
                            ...prevOdds[nat],  // Spread the previous data for the specific rank
                            "Player B": b      // Update only the "Player A" field
                        }
                    }));
                }
            })


            //
            //
            // // Set player statuses at once after looping through data
            // setPlayerStatuses((prev) => ({
            //     ...prev,
            //     ...playerAStats,
            // }));
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            Object.entries(playerAmounts).map(([value]) => {
                getExBySingleTeamNameCasino(sportList.id, data.mid, value, match_id, 'WINNER')
                    .then(res => {
                        // Update playerAmounts based on the response
                        setPlayerAmounts(prev => ({
                            ...prev,
                            [value]: res.data // Assuming the amount is in the response
                        }));
                    })
            })
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


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

    // Helper function to find data in data.sub for Poker20
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Poker20, find the item by nat field
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
            betType: "WINNER",
            stakeValue,
            match_id: "POKER20",
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

    const [oddsData, setOddsData] = useState(() => {
        const initialStatus = {};
        handRanks.forEach(rank => {
            initialStatus[rank] = {
                "Player A": 0,
                "Player B": 0
            }


        });
        return initialStatus;
    });

    const [playerAmounts, setPlayerAmounts] = useState({
        "Player A": '',
        "Player B": '',


    });
    const getOdds = (rank, player) => {
        // This function simulates getting the odds. You should replace it with your logic.
        return oddsData[rank][player];
    };
    const renderRow = (rank) => {
        const playerAStatus = playerStatuses[rank];

        return (
            <tr data-title="SUSPENDED" className="bet-info">
                <td className="box-6"><b>{rank}</b></td>
                <td
                    className={`box-2 back teen-section ${playerAStatus}`}
                    onClick={() => rank === 'Winner' ? openPopup('back', "Player A", getOdds(rank, "Player A")) : ''}
                >
                    <button className="back">
                        <span className="odd">{getOdds(rank, "Player A")}</span>
                        {rank === 'Winner' && getExByColor(playerAmounts['Player A'])}



                    </button>

                </td>
                <td
                    className={`box-2 back teen-section ${playerAStatus}`}
                    onClick={() => rank === 'Winner' ? openPopup('back', "Player B", getOdds(rank, "Player B")) : ''}
                >
                    <button className="back">
                        <span className="odd">{getOdds(rank, "Player B")}</span>
                        {rank === 'Winner' && getExByColor(playerAmounts['Player B'])}
                    </button>

                </td>
            </tr>
        );
    };

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
        <CasinoLayout raceClass="poker20" ruleImage="/img/rules/poker.jpeg"  hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="poker20-other-odds">
                    <div className="casino-table-box">
                        <div className="casino-table-left-box">
                            <div className="w-100 d-xl-none mobile-nation-name">Player A</div>
                            {handRanks.map(rank => (
                                <div key={rank} className="casino-odds-box-container">
                                    <div className="casino-nation-name text-center">{rank}</div>
                                    <div className={`casino-odds-box back ${playerStatuses[`Player A ${rank}`] || 'suspended-box'}`}
                                         onClick={() => playerStatuses[`Player A ${rank}`] !== 'suspended-box' && openPopup('back', `Player A ${rank}`, oddsData[`Player A ${rank}`])}>
                                        <span className="casino-odds">{oddsData[`Player A ${rank}`] || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="casino-table-box-divider"></div>
                        <div className="casino-table-right-box">
                            <div className="w-100 d-xl-none mobile-nation-name">Player B</div>
                            {handRanks.map(rank => (
                                <div key={rank} className="casino-odds-box-container">
                                    <div className="casino-nation-name text-center">{rank}</div>
                                    <div className={`casino-odds-box back ${playerStatuses[`Player B ${rank}`] || 'suspended-box'}`}
                                         onClick={() => playerStatuses[`Player B ${rank}`] !== 'suspended-box' && openPopup('back', `Player B ${rank}`, oddsData[`Player B ${rank}`])}>
                                        <span className="casino-odds">{oddsData[`Player B ${rank}`] || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
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


export default Poker20;
