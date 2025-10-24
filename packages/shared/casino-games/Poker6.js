import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    classifyCard,
    getExByColor,
    getExBySingleTeamNameCasino, getPlayerCardAccordingToNumberOfPlayers, resetBetFields, updatePlayerStats, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Poker6 = () => {
    const [roundId, setRoundId] = useState('')

    const TOTALPLAYERS = {
        "Player 1": '',
        "Player 2": '',
        "Player 3": '',
        "Player 4": '',
        "Player 5": '',
        "Player 6": '',

    };
    const [cards, setCards] = useState([])
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


    const [playerStatuses, setPlayerStatuses] = useState(() => {
        const initialOdds = {};
        Object.keys(TOTALPLAYERS).forEach(player => {
            initialOdds[player] = 'suspended-box'; // Initialize each player with odds of 0
        });
        return initialOdds;
    });

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('BOOKMAKER')

        if (data?.sub) {
            data.sub.slice(0, 6).map((value, key) => {
                const {nat, b} = value;
                setOddsData(prev => ({...prev, [nat]: b}));

                updatePlayerStats(value, null, null, nat, setPlayerStatuses, 'suspended-box');

            })

            setCards(data.card.split(",").map(value => classifyCard(value)));

    
        }

    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    const [playerAmounts, setPlayerAmounts] = useState(TOTALPLAYERS);
    useEffect(() => {

        if (data?.sub && sportList?.id) {

            remark.current = data.remark || 'Welcome';

            Object.keys(TOTALPLAYERS).map(value => {

                getExBySingleTeamNameCasino(sportList.id, data.mid, value, match_id, 'ODDS')
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


    const [oddsData, setOddsData] = useState(() => {
        const initialOdds = {};
        Object.keys(TOTALPLAYERS).forEach(player => {
            initialOdds[player] = 0; // Initialize each player with odds of 0
        });
        return initialOdds;
    });
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

    // Helper function to find data in data.sub for Poker6
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Poker6, find the item by nat field
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

    const renderCards = () => (


        getPlayerCardAccordingToNumberOfPlayers(data, 1, 2, [12, 13, 14, 15, 16])?.map((card, index) => {
            const imgSrc = card ? `${card}` : '/img/casino/cards/1.png';
            return (
                <img src={imgSrc} key={index}/>

            );
        })

    );

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
            match_id: 'poker6',
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

            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="casino-video-cards">
                <div>
                    <div className="flip-card-container">
                        {renderCards().map((cardImg, index) => (
                            <div key={index} className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={cardImg.props.src} alt={`Card ${index}`}/>
                                    </div>
                                    <div className="flip-card-back">
                                        <img src={cardImg.props.src} alt={`Card ${index}`}/>
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
        <CasinoLayout raceClass="poker6player" ruleImage="/img/rules/poker.jpeg" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="tab-content">
                    <div role="tabpanel" id="uncontrolled-tab-example-tabpane-hands" 
                         aria-labelledby="uncontrolled-tab-example-tab-hands" 
                         className="fade hands tab-pane active show">
                        <div className="row row5">
                            {Object.keys(playerStatuses).map((player, key) => (
                                <div key={player} className="col-md-6">
                                    <div className={`casino-odds-box back ${playerStatuses[player]}`}
                                         onClick={() => openPopup('back', player, oddsData[player])}>
                                        <div className="casino-nation-name">
                                            {player}
                                            <div className="patern-name ms-3">
                                                {Array.from({length: Math.min(2, Math.ceil(cards.length / 6))}, (_, index) => {
                                                    const a = key + index * 6;
                                                    if (cards[a] && cards[a].card_no) {
                                                        return (
                                                            <span key={a} className="card-icon ms-2">
                                                                {cards[a].card_no}
                                                                <span className={`${cards[a].card_class} ms-1`}>
                                                                    {cards[a].card_icon}
                                                                </span>
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="casino-odds">{oddsData[player] || 0}</span>

                                            <div className="casino- text-danger">
                                                {getExByColor(playerAmounts[player])}
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                 
                </div>
                <div className="casino-remark mt-1">
                    <marquee scrollamount="3">{remark.current}</marquee>
                </div>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results last-result-container">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>

        </CasinoLayout>
    )
        ;

};

export default Poker6;
