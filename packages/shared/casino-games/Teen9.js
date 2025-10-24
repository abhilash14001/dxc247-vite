import React, {useState, useEffect, useRef, useContext} from 'react';
import CasinoLayout from "../components/casino/CasinoLayout";
import axiosFetch, {
    getExBySingleTeamNameCasino,
    getPlayerCardAccordingToNumberOfPlayers, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";

const Teen9 = () => {
    const profitData = useRef(0);
    const profit = useRef(0);
    const loss = useRef(0);
    const ruleImage = '/img/rules/teen20.jpg'
    

    const [roundId, setRoundId] = useState('');
    const roundIdSaved = useRef(null);
    const remark = useRef('Welcome');
    const teamname = useRef('');
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

    const [lastResult, setLastResult] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0);
    const [backOrLay, setbackOrLay] = useState('back');
    const [sportList, setSportList] = useState({});
    const {match_id} = useParams();
    const {betType, setBetType, setPopupDisplayForDesktop} = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext);
    const [hideLoading, setHideLoading] = useState(true);

    const teamNames = useRef(["Player A", "Player B"]);
    const [data, setData] = useState([]);

    const [playerAmounts, setPlayerAmounts] = useState({
        "Tiger Winner": '',
        "Tiger Pair": '',
        "Tiger Flush": '',
        "Tiger Straight": '',
        "Tiger Trio": '',
        "Tiger Straight Flush": '',
        "Dragon Winner": '',
        "Dragon Pair": '',
        "Dragon Flush": '',
        "Dragon Straight": '',
        "Dragon Trio": '',
        "Dragon Straight Flush": '',
        "Lion Winner": '',
        "Lion Pair": '',
        "Lion Flush": '',
        "Lion Straight": '',
        "Lion Trio": '',
        "Lion Straight Flush": '',
    });


    const [playerStatuses, setPlayerStatuses] = useState({
        "Tiger Winner": 'suspended-box',
        "Tiger Pair": 'suspended-box',
        "Tiger Flush": 'suspended-box',
        "Tiger Straight": 'suspended-box',
        "Tiger Trio": 'suspended-box',
        "Tiger Straight Flush": 'suspended-box',
        "Dragon Winner": 'suspended-box',
        "Dragon Pair": 'suspended-box',
        "Dragon Flush": 'suspended-box',
        "Dragon Straight": 'suspended-box',
        "Dragon Trio": 'suspended-box',
        "Dragon Straight Flush": 'suspended-box',
        "Lion Winner": 'suspended-box',
        "Lion Pair": 'suspended-box',
        "Lion Flush": 'suspended-box',
        "Lion Straight": 'suspended-box',
        "Lion Trio": 'suspended-box',
        "Lion Straight Flush": 'suspended-box',
    });

    const [oddsData, setOddsData] = useState({
        "Winner": {Tiger: '', Lion: '', Dragon: ''},
        "Pair": {Tiger: '', Lion: '', Dragon: ''},
        "Flush": {Tiger: '', Lion: '', Dragon: ''},
        "Straight": {Tiger: '', Lion: '', Dragon: ''},
        "Trio": {Tiger: '', Lion: '', Dragon: ''},
        "Straight Flush": {Tiger: '', Lion: '', Dragon: ''}
    });


    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


    useEffect(() => {
        const getPlayerNameSuffix = (playerName) => {
            if (playerName.includes('Winner')) {
                return 'WINNER'; // Default to Winner if 'Winner' is not in playerName
            } else if (playerName.includes('Tiger')) {
                return 'OTHER_T'; // If it contains Tiger, use 'other_t'
            } else if (playerName.includes('Dragon')) {
                return 'OTHER_D'; // If it contains Dragon, use 'other_d'
            } else if (playerName.includes('Lion')) {
                return 'OTHER_L'; // If it contains Lion, use 'other_l'
            }
            return 'Winner'; // Fallback to Winner
        };
        if (data?.sub && sportList?.id) {
            const keys = Object.keys(playerAmounts); // Get the keys (player names) from playerAmounts

            keys.forEach((playerName) => {
                getExBySingleTeamNameCasino(sportList.id, data.mid, playerName, match_id, getPlayerNameSuffix(playerName))
                    .then(res => {
                        // Update playerAmounts based on the response
                        setPlayerAmounts(prev => ({
                            ...prev,
                            [playerName]: res.data // Assuming the amount is in the response
                        }));
                    })
                    .catch(error => {
                        console.error(`Error fetching data for ${playerName}:`, error);
                    });
            });
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);
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
            match_id: 'teen9',
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
    useEffect(() => {


        if (data?.sub) {
            Object.keys(playerStatuses).forEach((team, index) => {

                updatePlayerStats(data.sub[index], team);
            });

            data.sub.forEach(item => {
                const {nat, b} = item; // Destructure nat and b from item
                const [team, ...betTypeArr] = nat.split(' '); // Split nat into team and bet type
                const betType = betTypeArr.join(' '); // Rejoin the remaining parts as the bet type

                // Check if betType exists in oddsData
                if (oddsData[betType]) {
                    setOddsData(prevOdds => ({
                        ...prevOdds,
                        [betType]: {
                            ...prevOdds[betType],
                            [team]: b // Update the b value for the specific team
                        }
                    }));
                }
            });


        }

    }, [data]);

    const updatePlayerStats = (playerData, playerName) => {
        if (!playerData) return;

        let playerStatus = playerData.gstatus === "SUSPENDED" ? "suspended-box" : '';
        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));
    };

    const openPopup = (isBakOrLay, teamnam, oddvalue, winnerName, playerName) => {


        if (playerName === 'Tiger' && winnerName !== 'Winner') {
            setBetType('OTHER_T');
        } else if (playerName === 'Dragon' && winnerName !== 'Winner') {
            setBetType('OTHER_D');
        } else if (playerName === 'Lion' && winnerName !== 'Winner') {
            setBetType('OTHER_L');
        }
        else{
            setBetType('WINNER');
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

    // Helper function to find data in data.sub for Teen9
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen9, find the item by nat field
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



        const renderVideoBox = () => {
        return (
            <div className='casino-video-cards'>
                <div className="">
                    <h5>Tiger</h5>
                    <div className="flip-card-container">
                        {getPlayerCardAccordingToNumberOfPlayers(data, 1, 3).map((img, key) => (
                            <div key={key} className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={img} alt={`Tiger Card ${key}`}/>
                                    </div>
                                    <div className="flip-card-back">
                                        <img src={img} alt={`Tiger Card ${key}`}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-1">
                    <h5>Lion</h5>
                    <div className="flip-card-container">
                        {getPlayerCardAccordingToNumberOfPlayers(data, 2, 3).map((img, key) => (
                            <div key={key} className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={img} alt={`Lion Card ${key}`}/>
                                    </div>
                                    <div className="flip-card-back">
                                        <img src={img} alt={`Lion Card ${key}`}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-1">
                    <h5>Dragon</h5>
                    <div className="flip-card-container">
                        {getPlayerCardAccordingToNumberOfPlayers(data, 3, 3).map((img, key) => (
                            <div key={key} className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={img} alt={`Dragon Card ${key}`}/>
                                    </div>
                                    <div className="flip-card-back">
                                        <img src={img} alt={`Dragon Card ${key}`}/>
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
        <CasinoLayout ruleImage={ruleImage} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList} 
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} raceClass="teenpattitest" virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>


            
               
            
            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-full-box">
                        <div className="casino-table-header">
                            <div className="casino-nation-detail"></div>
                            <div className="casino-odds-box back">Tiger</div>
                            <div className="casino-odds-box back">Lion</div>
                            <div className="casino-odds-box back">Dragon</div>
                        </div>
                        <div className="casino-table-body">
                            {Object.keys(oddsData).map(status => (
                                <div key={status} className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">{status}</div>
                                    </div>
                                    <div className={`casino-odds-box back ${playerStatuses[`Tiger ${status}`]}`} onClick={() => openPopup('back', "Tiger " + status, oddsData[status]?.Tiger, status, 'Tiger')}>
                                        <span className="casino-odds">{oddsData[status]?.Tiger}</span>
                                    </div>
                                    <div className={`casino-odds-box back ${playerStatuses[`Lion ${status}`]}`} onClick={() => openPopup('back', "Lion " + status, oddsData[status]?.Lion, status, 'Lion')}>
                                        <span className="casino-odds">{oddsData[status]?.Lion}</span>
                                    </div>
                                    <div className={`casino-odds-box back ${playerStatuses[`Dragon ${status}`]}`} onClick={() => openPopup('back', "Dragon " + status, oddsData[status]?.Dragon, status, 'Dragon')}>
                                        <span className="casino-odds">{oddsData[status]?.Dragon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                    <span><a href="/casino-results/teen9">View All</a></span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>

            
        </CasinoLayout>
    );
};

export default Teen9;
