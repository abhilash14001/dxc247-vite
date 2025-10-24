import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardGenerate,
    getExByColor, getExBySingleTeamLayBackCasino, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Notenum = () => {
    const [roundId, setRoundId] = useState('')

    const defaultStatusAmount = { status: "suspended-box", amounts: "" };
    const defaultValuesWithBackAndLay = { odds: { back: 0, lay: 0 }, ...defaultStatusAmount }
    const defaultValuesWithBack = { odds: { back: 0 }, ...defaultStatusAmount }
    const [totalPlayers, setTotalPlayers] = useState({
    "Odd Card": {
            ...defaultValuesWithBackAndLay,
            images: [
                "/img/casino/cards/single/A.jpg",
                "/img/casino/cards/single/3.jpg",
                "/img/casino/cards/single/5.jpg",
                "/img/casino/cards/single/7.jpg",
                "/img/casino/cards/single/9.jpg",
            ]

            , bet_type: "ODDEVEN",
            name: "Odd Card 1"
        },
        "Even Card": {
            ...defaultValuesWithBackAndLay,
            images: [
                "/img/casino/cards/single/2.jpg",
                "/img/casino/cards/single/4.jpg",
                "/img/casino/cards/single/6.jpg",
                "/img/casino/cards/single/8.jpg",
                "/img/casino/cards/single/10.jpg",
            ],
            subname: "3 Card Judgement(1 2 4)",
            bet_type: 'ODDEVEN',
            name: "Odd Card 1"
        },
        "Black Card": {
            ...defaultValuesWithBackAndLay,
            subname: "3 Card Judgement(J Q K)",
            images: ['/img/casino/cards/spade.png', '/img/casino/cards/club.png'],
            bet_type: 'REDBLACK',
            name: "Black Card 1"

        },
        "Red Card": {
            ...defaultValuesWithBackAndLay,
            images: ['/img/casino/cards/heart.png', '/img/casino/cards/diamond.png'],
            bet_type: 'REDBLACK',
            name: "Red Card 1"

        },
        "Low Card": {
            ...defaultValuesWithBackAndLay,
            images: [
                "/img/casino/cards/single/A.jpg",
                "/img/casino/cards/single/2.jpg",
                "/img/casino/cards/single/3.jpg",
                "/img/casino/cards/single/4.jpg",
                "/img/casino/cards/single/5.jpg",
            ],
            name: "Low Card 1",
            bet_type: 'LOWHIGH'
        },




        "High Card": {
            ...defaultValuesWithBackAndLay,
            images: [
                "/img/casino/cards/single/6.jpg",
                "/img/casino/cards/single/7.jpg",
                "/img/casino/cards/single/8.jpg",
                "/img/casino/cards/single/9.jpg",
                "/img/casino/cards/single/10.jpg",
            ],
            name: "High Card 1",
            bet_type: 'LOWHIGH'
        },
        "Baccarat 1": { ...defaultValuesWithBackAndLay, bet_type: 'TWOEVENONLY' },
        "Baccarat 2": { ...defaultValuesWithBack, bet_type: 'FANCY' },
        "Cards": {
            ...defaultValuesWithBack,
            "c": cardGenerate()
        }
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
</style>
<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>This game is played with 80 cards containing two decks of fourty cards each.</li>
                                                <li>Each deck contains cards from Ace to 10 of all four suits (It means There is no Jack, No Queen and No King in this game ).</li>
                                                <li>This game is for Fancy bet lovers.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Odd and Even Cards :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>To bet on odd card or even card , Betting odds are available on every cards.</li>
                                                <li>Both back and Lay price is available for both, odd and even.</li>
                                                <li>(Here 2,4,6,8 and 10 are named Even Card.)</li>
                                                <li>(Here 1,3,5,7, and 9 are named Odd Card.)</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Red and Black Cards :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>To bet on Red card or Black Card bettings odds are available on every cards .</li>
                                                <li>(Here Heart and Diamond are named Red Card )</li>
                                                <li>(Spade and Club are named Black Card )</li>
                                                <li>Both Back and Lay price is available for both, Red card and Black Card.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Low and High cards :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>To bet on Low or High card bettings odds are available on every cards .</li>
                                                <li>(Here Ace ,2,3,4, and 5 are named low Card )</li>
                                                <li>( Here 6,7,8,9 and 10 are named High card )</li>
                                                <li>Both back and lay price is available for both, Low card and High Card .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Baccarat :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In this game six cards will open.</li>
                                                <li>For this bet this six cards are divided in two groups i.e. Baccarat 1 and Baccarat 2.</li>
                                                <li>Baccarat 1 is 1st, 2nd and 3rd cards to be open.</li>
                                                <li>Baccarat 2 is 4th ,5th and 6th cards to be open.</li>
                                                <li>This is a bet for comparison of Baccarat value of both the group i.e. Baccarat 1 and Baccarat 2.</li>
                                                <li>The group having higher baccarat value will win.</li>
                                                <li>To calculate baccarat value we will add point value of all three cards of that group and We will take last digit of that total as Baccarat value .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Point Value of cards :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Ace = 1</li>
                                                <li>2 = 2</li>
                                                <li>3 = 3</li>
                                                <li>4 = 4</li>
                                                <li>5 = 5</li>
                                                <li>6 = 6</li>
                                                <li>7 = 7</li>
                                                <li>8 = 8</li>
                                                <li>9 = 9</li>
                                                <li>10 = 0</li>
                                            </ul>
                                            <p><b>Example:</b></p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Suppose three cards are 2,5,8</li>
                                                <li>2+5+8 = 15 , Here last digit is 5 so baccarat value is 5 .</li>
                                                <li>1,2,4</li>
                                                <li>1+2+4 = 7 , In this case total is in single digit so we will take that single digit as baccarat value i.e. 7</li>
                                                <li>Note : In case If baccarat value of both the group is equal , In that case half of the betting amount will be returned.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">FIX Point Card :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>It is a bet for selecting any fix point card ( Suits are irrelevant ).</li>
                                            </ul>
                                        </div></div>`

    const getLevel = (string) => {
        return string.split(" ")[2]
    }


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const { match_id } = useParams();
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

    const updatePlayers = () => {
        setTotalPlayers((prevPlayer) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer))


            Object.entries(updatedPlayers).forEach(([index1, value1], i) => {


                const founddata = data.sub.find(item => item.nat.includes(index1))


                if (founddata && index1 !== 'Cards') {
                    if (updatedPlayers[index1].hasOwnProperty('name')) {
                        updatedPlayers[index1].name = founddata.nat
                    }
                    updatedPlayers[index1].odds.back = founddata.b
                    if (updatedPlayers[index1].odds.hasOwnProperty('lay')) {
                        updatedPlayers[index1].odds.lay = founddata.l
                    }
                    updatedPlayers[index1].status = founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                    const name = updatedPlayers[index1].name
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                         [name]: founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                    }));
                }
                if (index1 === 'Cards') {

                    const founddata1 = data.sub[8];

                    if (founddata1) {
                        updatedPlayers[index1].odds.back = founddata1.odds[9].b

                        updatedPlayers[index1].status = founddata1.gstatus === 'OPEN' ? "" : 'suspended-box'
                    }
                    else {
                        updatedPlayers[index1].status = 'suspended-box';
                    }


                }

            })


            return updatedPlayers
        })


    }


    const updateAmounts = async (individual = false) => {

        let promises = [];
        if (!individual) {
            promises = Object.entries(totalPlayers).map(([index, value]) => {
                const bets = value?.name ? value.bet_type + getLevel(value.name) : value.bet_type

                return getExBySingleTeamNameCasino(sportList.id, roundId, value?.name ?? index, match_id.toUpperCase(), bets)


            })

            const promise_daa = await Promise.all(promises)
            setTotalPlayers((prevState) => {

                Object.entries(prevState).forEach(([index, value], i) => {

                    prevState[index].amounts = promise_daa[i].data === 0 ? '' : promise_daa[i].data
                })


                return prevState
            })

        } else {

            const index = Object.entries(totalPlayers).find(([index, itm]) => {
                const bets = itm?.name ? itm.bet_type + getLevel(itm.name) : itm.bet_type

                return bets === individual
            })?.[0];


            promises.push(getExBySingleTeamNameCasino(sportList.id, roundId, totalPlayers[index]?.name ?? index, match_id.toUpperCase(), individual))

            const promises1 = await Promise.all(promises)

            setTotalPlayers((prevState) => {

                const updateState = JSON.parse(JSON.stringify((prevState)))



                updateState[index].amounts = promises1[0].data


                return updateState
            })


        }


    }


    
    useEffect(() => {


        if (data?.sub) {


            updatePlayers()
        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray[0] !== '1' ? cardArray.slice(0, 6) : [],

            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.sub]);

    const exposure = exposureCheck();
    


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts();
        }
        // eslint-disable-next-line
    }, [totalPlayers['Even Card'].name, exposure, sportList?.id]);


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

    // Helper function to find data in data.sub for Notenum
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Notenum, find the item by nat field
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

    const renderCards = (cards, player) => (
        cards?.map((card, index) => {
            const imgSrc = card ? `/img/casino/cards/${card}.png` : '/img/casino/cards/1.png';
            return (
                <div className="flip-card-container" key={index}>

                    <div className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
                            </div>
                        </div>
                    </div>

                </div>
            );
        }))

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
            totalPlayers:null,
            playerStatuses: playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: () => updateAmounts(betType),
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
                updateAmounts(betType);
            }
        });

        return success;
    }
    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size)); // Take a slice of the array of the given size
        }
        return chunks;
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
        <CasinoLayout raceClass="note-number" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay}
            teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>


            <div className="note-number">
                <div className="casino-detail">
                    <div className="casino-table">
                        <div className="casino-table-box">
                            {chunkArray(Object.entries(totalPlayers).slice(0, 6), 2).map((value1, index) => {

                                return (
                                    <div className="casino-odd-box-container-box">
                                        {value1.map((value, i) => {
                                            index = value[0]
                                            value = value[1]

                                            const bets = value?.name ? value.bet_type + getLevel(value.name) : value.bet_type;
                                            return (
                                                <div className="casino-odd-box-container" key={i}>
                                                    <div className="casino-nation-name">
                                                        <span
                                                            className="me-2">{index !== 'Black Card' && index !== 'Red Card' ? value?.name : ""}</span>
                                                        {value.images.map((value1, index1) => (
                                                            <img src={value1} key={index1} />
                                                        ))}

                                                    </div>
                                                    <div className={`casino-odds-box back ${value.status}`}
                                                        onClick={() => openPopup('back', value?.name ?? index, value.odds.back, bets)}><span
                                                            className="casino-odds">{value.odds.back}</span></div>
                                                    <div className={`casino-odds-box lay ${value.status}`}
                                                        onClick={() => openPopup('lay', value?.name ?? index, value.odds.lay, bets)}><span
                                                            className="casino-odds">{value.odds.lay}</span></div>
                                                    <div className="casino-nation-book text-center w-100">
                                                        {getExByColor(-Math.abs(value.amounts))}

                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="casino-table-box mt-3">
                            <div className="casino-table-left-box">
                                {Object.entries(totalPlayers).slice(6, 8).map(([index3, value3], i2) => (
                                    <div className="casino-odd-box-container" key={i2}>
                                        <div className="casino-nation-name"><b>{index3}</b><span
                                            className="">{i2 === 0 ? "(1st, 2nd, 3rd card)" : "(4th, 5th, 6th card)"}</span>
                                        </div>
                                        <div className={`casino-odds-box back ${value3.status}`}>
                                            <span className="casino-odds">{value3.odds.back}</span>
                                            <div className="casino-nation-book text-center"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="casino-table-right-box">
                                {totalPlayers.Cards.c.slice(0, 10).map((value, index) => {

                                    return (
                                        <div className="card-odd-box" key={index}>
                                            <div className="casino-odds">{totalPlayers.Cards.odds.back}</div>
                                            <div className={totalPlayers.Cards.status}>

                                                <img src={value[1]} />

                                            </div>
                                            <div
                                                className="casino-nation-book">{getExByColor(-Math.abs(totalPlayers.Cards.amounts))}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>


                    </div>

                    <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                    <div className="casino-last-result-title">
                        <span>Last Result</span>
                    </div>
                    <div className="casino-last-results">
                        <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                    </div>
                </div>
            </div>


        </CasinoLayout>
    );

};


export default Notenum;

