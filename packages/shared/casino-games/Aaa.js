import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap,
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Aaa = () => {
        const [roundId, setRoundId] = useState('')

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
        .rules-section .row.row5 > [class*="col-"], .rules-section .row.row5 > [class*="col"] {
            padding-left: 5px;
            padding-right: 5px;
        }
        .rules-section
        {
            text-align: left;
            margin-bottom: 10px;
        }
        .rules-section .table
        {
            color: #fff;
            border:1px solid #444;
            background-color: #222;
            font-size: 12px;
        }
        .rules-section .table td, .rules-section .table th
        {
            border-bottom: 1px solid #444;
        }
        .rules-section ul li, .rules-section p
        {
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
        .rules-section .rules-highlight
        {
            color: #FDCF13;
            font-size: 16px;
        }
        .rules-section .rules-sub-highlight {
            color: #FDCF13;
            font-size: 14px;
        }
        .rules-section .list-style, .rules-section .list-style li
        {
            list-style: disc;
        }
        .rules-section .rule-card
        {
            height: 20px;
            margin-left: 5px;
        }
        .rules-section .card-character
        {
            font-family: Card Characters;
        }
        .rules-section .red-card
        {
            color: red;
        }
        .rules-section .black-card
        {
            color: black;
        }
        .rules-section .cards-box
        {
            background: #fff;
            padding: 6px;
            display: inline-block;
            color: #000;
            min-width: 150px;
        }
    </style>

<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card is ACE,2,3,4,5, or 6 Amar Wins. </li>
                                                <li>If the card is 7,8,9 or 10 Akbar wins. </li>
                                                <li>If the card is J,Q or K Anthony wins.</li>
                                            </ul>
                                        </div></div>
                                        
                                        <div><div class="rules-section">
                                            <p>
                                                <b class="rules-sub-highlight">EVEN</b>
                                                <span class="ml-2">(PAYOUT 2.12)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card is 2 , 4 , 6 , 8 , 10 , Q</li>
                                            </ul>
                                            <p>
                                                <b class="rules-sub-highlight">ODD</b>
                                                <span class="ml-2">(PAYOUT 1.83)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card is A , 3 , 5 , 7 , 9 , J , K</li>
                                            </ul>
                                            <p>
                                                <b class="rules-sub-highlight">RED</b>
                                                <span class="ml-2">(PAYOUT 1.97)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card color is DIAMOND or HEART</li>
                                            </ul>
                                            <p>
                                                <b class="rules-sub-highlight">BLACK</b>
                                                <span class="ml-2">(PAYOUT 1.97)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card color is CLUB or SPADE</li>
                                            </ul>
                                            <p>
                                                <b class="rules-sub-highlight">UNDER 7</b>
                                                <span class="ml-2">(PAYOUT 2.0)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card is A , 2 , 3 , 4 , 5 , 6</li>
                                            </ul>
                                            <p>
                                                <b class="rules-sub-highlight">OVER 7</b>
                                                <span class="ml-2">(PAYOUT 2.0)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If the card is 8 , 9 , 10 , J , Q , K</li>
                                            </ul>
                                            <p>
                                                <b>Note: </b>
                                                <span>If the card is 7, Bets on under 7 and over 7 will lose 50% of the bet amount.</span>
                                            </p>
                                            <p>
                                                <b class="rules-sub-highlight">CARDS</b>
                                                <span class="ml-2">(PAYOUT 12.0)</span>
                                            </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>A , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , J , Q , K</li>
                                            </ul>
                                        </div></div>`
        const values = {status: "suspended-box", amounts: ""}
        const defaultValues = {odds: {back: 0, lay: 0}, ...values}
        const [totalPlayers, setTotalPlayers] = useState({

            "Amar": {canonical_name: "A. Amar", ...defaultValues},
            "Akbar": {canonical_name: "B. Akbar", ...defaultValues},
            "Anthony": {canonical_name: "C. Anthony", ...defaultValues},
            "Even": {...values, odds: 0, canonical_name: "Even", type: "ODD_EVEN"},
            "Odd": {...values, odds: 0, canonical_name: "Odd", type: "ODD_EVEN"},
            "Red": {...values, odds: 0, canonical_name: "Red", type: "RED_BLACK"},
            "Black": {...values, odds: 0, canonical_name: "Black", type: "RED_BLACK"},

            "UNDER 7": {...values, odds: 0, canonical_name: "Under 7", type: "UNDER_OVER"},


            "OVER 7": {...values, odds: 0, canonical_name: "Over 7", type: "UNDER_OVER"},
            "Cards": (Array.from({length: 13}, (_, index) => {

                index += 1;
                return {
                    imagePath: '/img/card/' + index + ".jpg", // Image path
                    ...values,
                    img_path: "Card " + cardMap(index, false),
                    odds: 0 // Spread default values into each card object
                };
            })),

        })

        const [playerStatuses, setPlayerStatuses] = useState({});


        const roundIdSaved = useRef(null);

        const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

        const [cards, setCards] = useState({});

        const stakeValue = useRef(0);
        const [odds, setOdds] = useState(0)

        const [backOrLay, setbackOrLay] = useState('back')
        const [sportList, setSportList] = useState({})
        const {match_id} = useParams();
        const {
            setBetType,
            betType,
            setPopupDisplayForDesktop,

        } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

        const [hideLoading, setHideLoading] = useState(true)


        const teamNames = useRef(["Player A", "Player B"])

        const [data, setData] = useState([]);

        const remark = useRef('Welcome');
        const [lastResult, setLastResult] = useState({});
        const teamname = useRef('');
        const loss = useRef(0);
        const profit = useRef(0);
        const profitData = useRef(0);


        useEffect(() => {


            if (data?.sub) {

                setTotalPlayers((prevState) => {
                    Object.entries(prevState).map(([index, value], i) => {

                        const foundData = data.sub.find(item => item.nat === index || item.nat === value.canonical_name)


                        if (foundData) {
                            prevState[index] = {
                                ...prevState[index],

                                status: foundData.gstatus === 'OPEN' ? '' : 'suspended-box',
                            }
                            
                            // Update playerStatuses
                            setPlayerStatuses(prev => ({
                                ...prev,
                                [index]: foundData.gstatus === 'OPEN' ? '' : 'suspended-box'
                            }));
                            if (['Amar', 'Akbar', 'Anthony'].includes(index)) {
                                prevState[index] = {
                                    ...prevState[index],
                                    odds: {back: foundData.b, lay: foundData.l},

                                }
                            } else {
                                prevState[index] = {
                                    ...prevState[index],
                                    odds: foundData.b,

                                }
                            }
                        }

                        const cardFoundData = data.sub.find(item => item.nat === 'Card A')

                        if (cardFoundData) {
                            prevState['Cards'] = Object.entries(prevState['Cards']).map(([index, value], i) => {

                                return {
                                    ...value,
                                    odds: cardFoundData.b,
                                    status: cardFoundData.gstatus === 'OPEN' ? '' : 'suspended-box',
                                };



                            })

                        }
                    })
                    return prevState

                })

                // Update playerStatuses dynamically for each player individually
                const newPlayerStatuses = {};
                
                // Update status for each player based on their individual status from data.sub
                data.sub.forEach(item => {
                    const playerStatus = item.gstatus === 'OPEN' ? '' : 'suspended-box';
                    newPlayerStatuses[item.nat] = playerStatus;
                });
                
                setPlayerStatuses(newPlayerStatuses);


            }

            if (data.card) {
                const cardArray = data.card.split(",").map(item => item.trim());
                setCards({
                    playerA: cardArray.slice(0, 3),
                    playerB: cardArray.slice(3, 6),
                });
                remark.current = data.remark || 'Welcome';
            }
        }, [data]);

        const exposure = exposureCheck();
        const sportLength = Object.keys(data).length;


        const updateAmounts = async () => {
            const results = await Promise.all([
                getExByTeamNameForCasino(sportList.id, roundId, 'Amar', match_id, 'ODDS'),
                getExByTeamNameForCasino(sportList.id, roundId, 'Akbar', match_id, 'ODDS'),
                getExByTeamNameForCasino(sportList.id, roundId, 'Anthony', match_id, 'ODDS'),
                getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
            ]);

            setTotalPlayers((prevState) => {
                const updatedState = {...prevState}; // Create a new state object

                Object.entries(prevState).forEach(([index, value], i) => {
                    if (['Amar', 'Akbar', 'Anthony'].includes(index)) {
                        // For Amar, Akbar, and Anthony
                        updatedState[index] = {
                            ...value,
                            amounts: results[i]?.data || ''
                        };
                    } else if (index === 'Cards') {
                        // For Cards
                        Object.entries(value).forEach(([cardIndex, cardValue]) => {
                            const cardFound = results[3]?.data.find(item => item.team_name === cardValue.img_path);
                            updatedState[index][cardIndex] = {
                                ...cardValue,
                                amounts: cardFound?.total_amount || ''
                            };
                        });
                    } else {
                        // For other teams
                        const dataFound = results[3]?.data.find(item => item.team_name === index);
                        updatedState[index] = {
                            ...value,
                            amounts: dataFound?.total_amount || ''
                        };
                    }
                });

                return updatedState; // Return the new state
            });
        };

        useEffect(() => {

            if (data?.sub && sportList?.id) {
                updateAmounts()
            }
        }, [exposure, sportLength, roundId, mybetModel.length]);


        const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {

            setBetType(betType)

            if (parseFloat(oddvalue) > 0) {
                roundIdSaved.current = roundId
                setbackOrLay(isBakOrLay)
                setPopupDisplayForDesktop(true);
                teamname.current = teamnam
                setOdds(oddvalue)
            } else {
                Notify("Odds Value Change Bet Not Confirm", null, null, 'danger')

            }


        }

        // Helper function to find data in data.sub for Aaa
        const findDataInSub = (teamName, betType) => {
            if (!data || !data.sub) return null;

            // For Aaa, find the item by nat field
            return data.sub.find(item => item.nat === teamName);
        };
        const casinoBetDataNew = (new_odds) => {
            stakeValue.current.value =  new_odds
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
                                    <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
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
                betType,
                stakeValue,
                match_id,
                roundIdSaved,
                totalPlayers: totalPlayers[teamname.current],
                playerStatuses, // Add playerStatuses to betData
                setHideLoading,
                setPopupDisplayForDesktop,
                setSubmitButtonDisable,
                resetBetFields,
                profitData,
                getBalance,
                updateAmounts,
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
                
                    <div className="video-overlay">
                        <div className="casino-video-cards">
                            <div>
                                {renderCards(cards.playerA, "Player A")}
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
            <CasinoLayout ruleDescription={ruleDescription} raceClass="aaa" d hideLoading={hideLoading}
                          isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                          getMinMaxLimits={getMinMaxLimits}>

                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).slice(0, 3).map(([index, value], i) => (
                            <div key={i} className="casino-odd-box-container">
                                <div className="casino-nation-name">
                                    {value.canonical_name}
                                    <div className="casino- d-md-none">{getExByColor(value.amounts)}</div>
                                </div>
                                <div className={`casino-odds-box back ${value.status}`} 
                                     onClick={() => openPopup('back', index, value.odds.back, 'ODDS')}>
                                    <span className="casino-odds">{value.odds.back}</span>
                                </div>
                                <div className={`casino-odds-box lay ${value.status}`}
                                     onClick={() => openPopup('lay', index, value.odds.lay, 'ODDS')}>
                                    <span className="casino-odds">{value.odds.lay}</span>
                                </div>
                                <div className="casino- text-center d-none d-md-block w-100">
                                    {getExByColor(value.amounts)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="casino-table-box mt-3">
                        <div className="casino-table-left-box">
                            {Object.entries(totalPlayers).slice(3, 5).map(([index, value], i) => (
                                <div key={i} className="aaa-odd-box">
                                    <div className="casino-odds text-center">{value.odds}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${value.status}`}
                                         onClick={() => openPopup('back', index, value.odds, value.type)}>
                                        <span className="casino-odds">{index}</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(value.amounts)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="casino-table-center-box">
                            {Object.entries(totalPlayers).slice(5, 7).map(([index, value], i) => (
                                <div key={i} className="aaa-odd-box">
                                    <div className="casino-odds text-center">{value.odds}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${value.status}`}
                                         onClick={() => openPopup('back', index, value.odds, value.type)}>
                                        <div className="casino-odds">
                                            {index === 'Red' ? (
                                                <>
                                                    <span className="card-icon ms-1"><span className="card-red">{"{"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-red">[</span></span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="card-icon ms-1"><span className="card-black">{"}"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-black">]</span></span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(value.amounts)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="casino-table-right-box">
                            {Object.entries(totalPlayers).slice(7, 9).map(([index, value], i) => (
                                <div key={i} className="aaa-odd-box">
                                    <div className="casino-odds text-center">{value.odds}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${value.status}`}
                                         onClick={() => openPopup('back', index, value.odds, value.type)}>
                                        <span className="casino-odds">{value.canonical_name}</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(value.amounts)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="casino-table-full-box aaacards mt-3">
                        <h4 className="w-100 text-center mb-2"><b>{totalPlayers['Cards'][0].odds}</b></h4>
                        {totalPlayers['Cards'].map((card, i) => (
                            <div className="card-odd-box" key={i}
                                 onClick={() => openPopup('back', `Card ${cardMap(i)}`, card.odds, 'CARD')}>
                                <div className={card.status}>
                                    <img src={card.imagePath} alt={`Card ${i + 1}`}/>
                                </div>
                                <div className="casino-">
                                    <span className="teamEx" style={{color: 'red'}}>{card.amounts}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </CasinoLayout>
        );
    };


export default Aaa;
