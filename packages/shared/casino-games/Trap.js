import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import  {
    getExByColor, getExByTeamNameForCasino,
    resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Trap = () => {
    const [roundId, setRoundId] = useState('')
    const defaultValues = {odds: {back: 0, lay: 0}, status: '', amounts: ''}

    const [totalPlayers, setTotalPlayers] = useState({
        "Player A": defaultValues,
        "Player B": defaultValues,
        "HighLowPlayer": {"Low": defaultValues, "High": defaultValues},
        "JQK": defaultValues
    })


    const desc = `<div><style type="text/css">
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
                                                <li> Trap is a 52 card deck game.</li>
                                                <li>Keeping Ace= 1 point, 2= 2 points, 3= 3 points, 4= 4 points, 5= 5 points, 6= 6 points, 7=7 points, 8= 8 Points, 9= 9 points, 10= 10 points, Jack= 11 points, Queen= 12 points and King= 13 points.</li>
                                                <li>Here there are two sides in TRAP. A and B respectively.
                                                </li>
                                                <li>First card that will open in the game would be from side ‘A’, next card will open in the game from Side ‘B’. Likewise till the end of the game.</li>
                                                <li>Any side that crosses a total score of 15 would be the winner of the game. For Example: the total score should be 16 or above.
                                                </li>
                                                <li>But if at any stage your score is at 13, 14, 15 then you will get into the trap which ideally means you lose.</li>
                                                <li>Hence there are only two conditions from which you can decide the winner here either your opponent has to be trapped in the score of 13, 14, 15 or your total score should be above 15.</li>
                                            </ul>
                                        </div></div>`
    const {getCardTotalCard32} = useContext(CasinoContext)


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

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
    const [playerStatuses, setPlayerStatuses] = useState({});

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {


        if (data?.sub) {

            setTotalPlayers((prevState) => {

                const prev = {...prevState}

                Object.entries(prev).map(([index, value]) => {
                    const itemfound = data.sub.find(item => item.nat === index)

                    const highfound = data.sub.slice(2, 15).find(item => item.gstatus === 'OPEN')

                    if (index === 'HighLowPlayer') {
                        if (highfound) {
                            prev[index].High = {
                                ...prev[index].High,
                                odds: {"back": highfound.odds[0].b},
                                status: highfound.gstatus === 'OPEN' ? '' : 'suspended-box',
                            }

                            prev[index].Low = {
                                ...prev[index].Low,
                                odds: {"back": highfound.odds[1].b},
                                status: highfound.gstatus === 'OPEN' ? '' : 'suspended-box',
                            }
                        } else {
                            prev[index].High = {
                                ...prev[index].High,
                                status: 'suspended-box',
                            }
                            prev[index].Low = {
                                ...prev[index].Low,
                                status: 'suspended-box',
                            }
                        }
                    }

                    const jqfound = data.sub.slice(16, 29).find(item => item.gstatus === 'OPEN')

                    if (index === 'JQK') {
                        if (jqfound) {
                            prev[index] = {
                                ...prev[index],
                                odds: {"back": jqfound.odds[0].b, "lay": jqfound.odds[0].l},
                                status: highfound.gstatus === 'OPEN' ? '' : 'suspended-box',
                            }
                        } else {
                            prev[index] = {
                                ...prev[index],

                                status: 'suspended-box',
                            }
                        }
                    }


                    if (itemfound) {
                        prev[index] = {
                            ...prev[index],
                            odds: {"back": itemfound.b, "lay": itemfound.l},
                            status: itemfound.gstatus === 'OPEN' ? '' : 'suspended-box',
                        }

                    }
                })


                return prev
            })
            
            // Update playerStatuses
            const newPlayerStatuses = {};
            data?.sub?.forEach(item => {
                newPlayerStatuses[item.nat] = item.gstatus === 'OPEN' ? '' : 'suspended-box';
            });
            setPlayerStatuses(newPlayerStatuses);

        }
        let cardTotA = 0, cardTotB = 0;
        setCards({

            playerACount: cardTotA,
            playerBCount: cardTotB,
        });
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            cardTotA = getCardTotalCard32([cardArray[0], cardArray[2], cardArray[4]].filter(item => item !== '1'), 0);
            cardTotB = getCardTotalCard32([cardArray[1], cardArray[3], cardArray[5]].filter(item => item !== '1'), 0);
            setCards({
                playerA: [cardArray[0], cardArray[2], cardArray[4]].filter(item => item !== '1'),
                playerB: [cardArray[1], cardArray[3], cardArray[5]].filter(item => item !== '1'),
                playerACount: cardTotA,
                playerBCount: cardTotB,
            });
            remark.current = data.remark || 'Welcome';
        }

    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;

    const updateAmounts = async () => {
        const result = [getExByTeamNameForCasino(sportList.id, roundId, 'Player A', match_id, 'ODDS'),
            getExByTeamNameForCasino(sportList.id, roundId, 'Player B', match_id, 'ODDS')]

        const promises = await Promise.all(result)
            setTotalPlayers((prevState) => {
            const updatedPlayers = Object.entries(prevState).map(([playerKey, playerValue], i) => {
                // Check if i is 0 or 1 to update "Player A" or "Player B"
                if (i === 0 || i === 1) {
                    return [
                        playerKey,
                        {
                            ...playerValue,
                            amounts: promises[i]?.data || '' // Use promises[i] for both players
                        }
                    ];
                }
                // For other players, return the existing playerValue
                return [playerKey, playerValue];
            });

            return Object.fromEntries(updatedPlayers);
        });



    }

    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()


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
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger')

        }


    }

    // Helper function to find data in data.sub for Trap
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Trap, find the item by nat field
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
            match_id,
            roundIdSaved,
            totalPlayers: totalPlayers[teamname.current],
            playerStatuses: playerStatuses,
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
        const sliderSettings = {
            vertical: true,
            verticalSwiping: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            speed: 500,
            dots: false, // Set to true if you want dots
            arrows: false, // Hide navigation arrows
        };

        if (!cards || cards?.playerACount <= 0)
            return null;
        return (
            <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div className="row row5">
                            <div className="col-6">
                                {cards?.playerACount && cards.playerACount > 0 && (
                                    <div>
                                        <div className="text-white">
                                            <b>A</b>
                                        </div>
                                        <div className="text-fancy">{cards.playerACount}</div>
                                    </div>
                                )}
                                {cards?.playerA && (
                                    <div className="v-slider">
                                        <Slider {...sliderSettings}>
                                            {cards?.playerA &&
                                                cards.playerA.map((value, index) => (
                                                    <div key={index} className="slick-slide">
                                                        <div>
                                                            <img
                                                                src={`${import.meta.env.VITE_CARD_PATH}${value}.png`}
                                                                style={{width: "100%", display: "inline-block"}}
                                                                alt={`Card ${index}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                        </Slider>
                                    </div>
                                )}
                            </div>

                            <div className="col-6">
                                {cards?.playerBCount && cards.playerBCount > 0 && (
                                    <div>
                                        <div className="text-white">
                                            <b>B</b>
                                        </div>
                                        <div className="text-fancy">{cards.playerBCount}</div>
                                    </div>
                                )}
                                {cards?.playerB && (
                                    <div className="v-slider">
                                        <Slider {...sliderSettings}>
                                            {cards?.playerB &&
                                                cards.playerB.map((value, index) => (
                                                    <div key={index} className="slick-slide">
                                                        <div>
                                                            <img
                                                                src={`${import.meta.env.VITE_CARD_PATH}${value}.png`}
                                                                style={{width: "100%", display: "inline-block"}}
                                                                alt={`Card ${index}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                        </Slider>
                                    </div>
                                )}
                            </div>
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

        <CasinoLayout raceClass="trap" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>






            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).slice(0, 2).map(([index, value]) => (
                            <>
                                <div
                                    className={index === 'Player A' ? `casino-table-left-box` : `casino-table-right-box`}>
                                    <div className="casino-table-body">
                                        <div className="casino-table-row">
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{index}</div>
                                                <div className="casino-">{getExByColor(value.amounts)}</div>
                                            </div>
                                            <div className={`casino-odds-box back ${value.status}`}
                                                 onClick={() => openPopup('back', index, value.odds.back)}>
                                                <span className="casino-odds">{value.odds.back}</span>
                                            </div>
                                            <div className={`casino-odds-box lay ${value.status}`}
                                                 onClick={() => openPopup('lay', index, value.odds.lay)}>
                                                <span className="casino-odds">{value.odds.lay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index === 'Player A' && (
                                    <div className="casino-table-box-divider"></div>
                                )}
                            </>
                        ))}

                    </div>

                    <div className="casino-table-box mt-3 sevenupbox">
                        <div className="casino-table-left-box">
                            <h4 className="d-md-none mb-2">Player</h4>
                            <div className="seven-up-down-box">
                                {Object.entries(totalPlayers.HighLowPlayer).map(([index, value], i) => (

                                    <div className={i === 0 ? `up-box ${value.status}` : `down-box ${value.status}`}>
                                        <div className="text-end">
                                            <div className="up-down-odds">{value.odds.back}</div>
                                            <span>{index}</span>
                                        </div>
                                    </div>
                                ))}

                                <div className="seven-box">
                                    <img src="/img/trape-seven.png"
                                         alt="Seven"/>
                                </div>
                            </div>
                        </div>

                        <div className="casino-table-box-divider"></div>
                        <div className="casino-table-right-box">
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">
                                            <img src="/img/card/11.jpg" alt="Card 11"/>
                                            <img src="/img/card/12.jpg" alt="Card 12"/>
                                            <img src="/img/card/13.jpg" alt="Card 13"/>
                                        </div>
                                        <div className="casino-"></div>
                                    </div>
                                    <div className={`casino-odds-box back ${totalPlayers.JQK.status}`}>
                                        <span className="casino-odds">{totalPlayers.JQK.odds.back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${totalPlayers.JQK.status}`}>
                                        <span className="casino-odds">{totalPlayers.JQK.odds.lay}</span>
                                    </div>
                                </div>
                            </div>
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

export default Trap;




                   
