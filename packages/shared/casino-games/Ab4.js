import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import axiosFetch, {
    cardMap, changeCardIndex, getExByColor,
    resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";

import Notify from "../utils/Notify";
import {CasinoContext} from "../contexts/CasinoContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AndarBaharVideoCards from "../components/casino/AndarBaharVideoCards";

const Ab4 = () => {
    let astatus = '', bstatus;
    const [roundId, setRoundId] = useState('')

    const [showCardCount, setShowCardCount] = useState(true)
    const {getAndarBaharCalculation} = useContext(CasinoContext)
    const [cardCount, setCardCount] = useState('')
    const [cardCountName, setCardCountName] = useState('Bahar')

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
<div className="rules-section">
                                            <ul className="pl-4 pr-4 list-style">
                                                <li>*Andar Bahar is an Indian origin game.</li>
                                                <li>*The game is played with 3 decks, totaling 156 cards (52 * 3 = 156)</li>
                                                <li>*This game is played between two sides: Andar and Bahar.</li>
                                                <li>*At the start of the game, the first card will be drawn on the Bahar side, but odds will be available for the Andar side.</li>
                                                <li>*When the card is drawn on the Andar side, odds will be available for the Bahar side, and so on.</li>
                                                <li>*The odds will be available on every card to place your bets up to the 144th card. After opening the 149th card, all remaining bets for the Andar side will be canceled(pushed) automatically.</li>
                                                <li>*The game will be considered over after the 150th card is drawn. The pending Bahar side bets will be canceled (pushed).</li>
                                                <li>*When you place a bet on the Andar side and the next card opens on the Bahar side with the same value, a 20% refund on the bet amount will be given to the client (valid for both Andar and Bahar sides).</li>
                                                <li>Example: If you place a bet of 100 points on the number 8 on the Andar side and the next card with the number 8 opens on the Bahar side, your bet loss will be only 80 points.</li>
                                                <li>*If the first card is not opened after the betted card, a winning payout of 100% of the bet amount will be given.</li>
                                            </ul>
                                        </div></div>`;
    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)


    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})

    const defaultCards = Array.from({length: 13}, (_, array) => {
        array = 0;
        return "/img/card/" + array + ".jpg";

    })

    const andarBaharCards = defaultCards

    const [enableOnclick, setEnableOnclick] = useState(false)

    const [playerStatuses, setPlayerStatuses] = useState({});

    const [totalPlayers, setTotalPlayers] = useState([
        {
            Andar: {
                cards: andarBaharCards, status: '', amounts: Object.fromEntries(Array.from({length: 13}, (_, index) => {
                    return ["Andar " + cardMap(index), ''];
                })),
                card_count: Object.fromEntries(Array.from({length: 13}, (_, index) => {
                    return ["Andar " + cardMap(index), 0];
                }))

            }
        },
        {
            Bahar: {
                cards: andarBaharCards, status: '', amounts: Object.fromEntries(Array.from({length: 13}, (_, index) => {
                    return ["Bahar " + cardMap(index), ''];
                })),
                card_count: Object.fromEntries(Array.from({length: 13}, (_, index) => {
                    return ["Bahar " + cardMap(index), 0];
                }))

            }
        }

    ])


    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)


    const [data, setData] = useState([]);

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {


        if (data?.sub) {
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

            remark.current = data.remark || 'Welcome';
            processData(data)

            let arr = data.card.split(',');
            let ar_all = arr.filter((value, key_array) => key_array % 2 !== 0 && value !== '1');
            let ar_ball = arr.filter((value, key_array) => key_array % 2 === 0 && value !== '1');
            let c = ar_all.length + ar_ball.length + 1;
            setCardCount(c)

            setCardCountName(c % 2 === 0 ? 'Bahar' : 'Andar');

        }


    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;
    const processData = (d_data) => {

        let card_change = false;
        const defaultCardsChange = Array.from({length: 13}, (_, array) => {
            array += 1;
            return "/img/card/" + array + ".jpg";

        })


        const cardSet1 = d_data?.card
        const cardsArray = cardSet1.split(','); // Explode the string into an array

        const allAreOnes = cardsArray.every(value => value === '1' || value === 1); // Check if all values are '1'


        if (allAreOnes) {

            card_change = false;
            if (enableOnclick === false)
                setEnableOnclick(true)


        } else {
            card_change = true;

            if (enableOnclick === true) {

                setEnableOnclick(false)

                setTotalPlayers((prevState) => {

                    const changeState = [...prevState];

                    changeState.forEach((value, index) => {
                        const akeys = Object.keys(value)[0]
                        changeState[index][akeys] = {
                            ...changeState[index][akeys],
                            status: ''

                        }

                    })


                    return changeState;
                })
            }
        }

        const img_ar = card_change === true ? defaultCards.slice() : defaultCardsChange.slice(), post_ar = {},
            post_br = {}, card_ar = {}, card_br = {};
        const img_br = card_change === true ? defaultCards.slice() : defaultCardsChange.slice()


        const setCardImagesAndCardCount = (img_obj, post_obj, keyPrefix, cardSet, offset = 0) => {

            const cardAndar = cardSet.slice(0, 13);
            const cardBahar = cardSet.slice(13, 26);

            cardAndar.forEach((value, key) => {

                post_obj[value.nat] = value.l

                if (value.l > 0) {
                    img_obj[key] = "/img/card/" + changeCardIndex(value.nat.split("Andar ")[1]) + ".jpg"

                }


            })

            cardBahar.forEach((value, key) => {

                post_obj[value.nat] = value.l
                if (value.l > 0) {
                    img_obj[key] = "/img/card/" + changeCardIndex(value.nat.split("Bahar ")[1]) + ".jpg"
                }


            })


            if (data?.lt <= 3 && cardCountName === 'Bahar') {
                astatus = 'suspended-box'
                bstatus = ''
            } else if (data?.lt <= 3 && cardCountName === 'Andar') {
                astatus = ''
                bstatus = ''
            }

            if (data?.lt <= 3 && (astatus === 'suspended-box' && bstatus === '')) {
                astatus = 'suspended-box'
                bstatus = 'suspended-box'
            }


        }

        if (d_data?.child) {
            [...Array(13)].forEach((_, i) => {
                img_ar[i] = img_br[i] = import.meta.env.VITE_CARD_PATH + '1.png';
            });

            if (d_data?.child) setCardImagesAndCardCount(img_ar, card_ar, 'Andar', d_data.child);
            if (d_data?.child) setCardImagesAndCardCount(img_br, card_br, 'Bahar', d_data.child, 20);
        }


        setTotalPlayers((prevState) => {
            const updatedPlayers = [...prevState];
            updatedPlayers[0]['Andar'].cards = img_ar;
            updatedPlayers[1]['Bahar'].cards = img_br;
            updatedPlayers[0]['Andar'].status = astatus;
            updatedPlayers[1]['Bahar'].status = bstatus;
            updatedPlayers[0]['Andar'].card_count = card_ar;
            updatedPlayers[1]['Bahar'].card_count = card_br;
            return updatedPlayers;
        });

    };


// Example usage of asset function to simulate PHP asset path


    useEffect(() => {

        if (data?.sub && sportList?.id) {

            getAndarBaharCalculation(sportList.id, roundId, 'ab3', setTotalPlayers);

        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
        setBetType(bet)


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

    // Helper function to find data in data.sub for Ab3
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Ab3, find the item by nat field
        // teamName could be like "Andar A", "Bahar 2", etc.
        return data.sub.find(item => item.nat.toUpperCase() === teamName.toUpperCase());
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
            betType,
            stakeValue,
            match_id: 'ab3',
            roundIdSaved,
            totalPlayers: betType === 'ANDAR' ? totalPlayers[0]['Andar'] : totalPlayers[1]['Bahar'],
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

            betBeforeNotification: () => {
                return {
                    message: "Bet has Not Placed",
                    status: false
                }
            },
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
                getAndarBaharCalculation(sportList.id, roundId, 'ab3', setTotalPlayers);
                
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            
                <div className="video-overlay">
                    <div id="game-cards" style={{width: '255px'}}>
                        {showCardCount && (
                            <div className="row">
                                <div className="col d-flex">
                                    <div className="text-white">
                                        Next Card Count :
                                    </div>
                                    <div className="text-warning fw-bolder mx-2">
                                        {cardCount} / {cardCountName}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            {data?.card && (

                                <AndarBaharVideoCards styles={{width: '100px'}} cards={data?.card}
                                                      player="Andar"/>
                            )}
                            {data?.card && (
                                <AndarBaharVideoCards styles={{width: '100px'}}
                                                      cards={data?.card}
                                                      player="Bahar"/>
                            )}
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
        <CasinoLayout raceClass="" ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay}
                      teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>


            <div className="casino-page-container ab ab3">
                <div className="casino-detail">
                    <div className="casino-table">
                        <div className="casino-table-box">


                            {data?.card && totalPlayers.map((value, key) => {
                                const title = Object.keys(value)[0];
                                const status = value[title].status
                                const amounts = value[title].amounts
                                const cardcount = value[title].card_count
                                return (
                                    <div className={`${title.toLowerCase()}-box ${status !== undefined ? status : ''}`} key={key}>
                                        <div className="ab-title">{title.toUpperCase()}</div>
                                        <div className="ab-cards">


                                            {Object.entries(value[title]['cards']).map(([key, value]) => {



                                                return (
                                                    <div key={key} className="card-odd-box">
                                                        <div className="casino-odds text-center"
                                                             onClick={() => openPopup('back', title + " " + cardMap(parseInt(key)) + "/" + cardCount, 2, title.toUpperCase())}>
                                                            {cardcount[title + " " + cardMap(parseInt(key))]}
                                                            <div>
                                                                <img src={value} alt={title}/>
                                                            </div>

                                                            {getExByColor(amounts[title + " " + cardMap(parseInt(key))])}

                                                        </div>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>

                                )
                            })}
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

            </div>

        </CasinoLayout>
    );

};


export default Ab4;
