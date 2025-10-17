import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamLayBackCasino, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";

import Notify from "../utils/Notify";


const Trio = () => {
    const [roundId, setRoundId] = useState('')

    const defaultStatusAmount = {status: "suspended-box", amounts: ""};
    const defaultValuesWithBackAndLay = {odds: {back: 0, lay: 0}, ...defaultStatusAmount}
    const defaultValuesWithBack = {odds: {back: 0}, ...defaultStatusAmount}
    const [totalPlayers, setTotalPlayers] = useState({
        "Session": {...defaultValuesWithBackAndLay, lbhav: 0, bbhav: 0, bet_type: "Session"},
        "3 Card Judgement (1 2 4)": {
            ...defaultValuesWithBackAndLay,
            subname: "3 Card Judgement(1 2 4)",
            bet_type: 'CARD3J124'
        },
        "3 Card Judgement (J Q K)": {
            ...defaultValuesWithBackAndLay,
            subname: "3 Card Judgement(J Q K)",
            bet_type: 'CARD3JQK'
        },
        "Two Red Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOREDONLY'},
        "Two Black Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOBLACKONLY'},
        "Two Odd Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOODDONLY'},
        "Two Even Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOEVENONLY'},
        "Pair": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Flush": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Straight": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Trio": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Straight Flush": {...defaultValuesWithBack, bet_type: 'FANCY'},

    })

    const desc = ` <div><style type="text/css">
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
                                            <h6 class="rules-highlight">Session :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a total of point value of all three cards .</li>
                                                <li>Point Value of Cards ( Suits doesn't matter )
                                                    <div class="pl-2 pr-2">Ace  = 1</div>
                                                    <div class="pl-2 pr-2">2 = 2</div>
                                                    <div class="pl-2 pr-2">3 = 3</div>
                                                    <div class="pl-2 pr-2">4 = 4</div>
                                                    <div class="pl-2 pr-2">5 = 5</div>
                                                    <div class="pl-2 pr-2">6 = 6</div>
                                                    <div class="pl-2 pr-2">7 = 7</div>
                                                    <div class="pl-2 pr-2">8 = 8</div>
                                                    <div class="pl-2 pr-2">9 = 9</div>
                                                    <div class="pl-2 pr-2">10 = 10</div>
                                                    <div class="pl-2 pr-2">Jack = 11</div>
                                                    <div class="pl-2 pr-2">Queen = 12</div>
                                                    <div class="pl-2 pr-2">King = 13</div>
                                                </li>
                                                <li>1+10+13 = 24 , Here session is 24.</li>
                                                <li>It is a bet for having session 21 Yes or No .</li>
                                                <li>Both back and lay rate of session 21 is available.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">3 card Judgement :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>In this bet you are offered set of three cards from which atleast one card must come in game .</li>
                                                <li>Both Back and Lay rate is available for 3 card judgement.</li>
                                                <li>Two sets of three cards are offered for " 3 card Judgement " .</li>
                                                <li>Set One : (1,2,4 )</li>
                                                <li>Set 2 : ( Jack , queen , King )</li>
                                                <li>Suits doesn't matter .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Two Red Only :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having two red cards only in the game (not more not less )</li>
                                                <li>(Here Heart and Diamond are named Red card).</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Two Black only :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having two black cards only in the game (not more not less )</li>
                                                <li>(Here Spade and Club are named Black card ).</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Two Odd only :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having two odd cards only in the game (not more not less ).</li>
                                                <li>1,3,5,7,9,Jack and King are named odd cards.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Two Even only :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having two even cards only in the game (not more not less ).</li>
                                                <li>2,4,6,8,10 and Queen are named even cards .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Pair :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having Two cards of same rank .</li>
                                                <li>( Trio is also valid for Pair ).</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Flush :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is bet for having all three cards of same suits .</li>
                                                <li>(If straight Flush come Flush is valid.)</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Straight :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is bet for having all three cards in the sequence .
                                                    <div class="pl-2 pr-2">Eg : 4,5,6</div>
                                                    <div class="pl-2 pr-2">Jack, Queen, King</div>
                                                </li>
                                                <li>(If Straight Flush come Straight is valid.)</li>
                                                <li>Note : King , Ace , 2 is not valid for straight .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Trio :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having all three cards of same rank .
                                                    <div class="pl-2 pr-2">Eg: 4 Heart , 4 Spade , 4 Diamond</div>
                                                    <div class="pl-2 pr-2">J Heart , J Club , J Diamond</div>
                                                </li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Straight Flush :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a bet for having all three cards in a sequence and also of same suits .
                                                    <div class="pl-2 pr-2">Eg : Jack (Heart), Queen (Heart ), King (Heart)</div>
                                                    <div class="pl-2 pr-2">4 (Club), 5(Club) ,6 (Club )</div>
                                                </li>
                                                <li>Note : King , Ace and 2 is not valid for Straight Flush .</li>
                                            </ul>
                                        </div></div>`


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

    const [hideLoading, setHideLoading] = useState(true)


    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});


    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);
    const oddsk = useRef(0);

    const updateAmounts = async (individual = false) => {

        let promises = [];
        if (!individual) {
            promises = Object.entries(totalPlayers).map(([index, value]) => {
                const ii = index === 'Trio' ? 'TRIO' : index
                return getExBySingleTeamLayBackCasino(sportList.id, roundId, ii, match_id, value.bet_type)


            })
            const promise_daa = await Promise.all(promises)

            setTotalPlayers((prevState) => {

                Object.entries(prevState).forEach(([index, value], i) => {

                    prevState[index].amounts = promise_daa[i].data === 0 ? '' : promise_daa[i].data
                })


                return prevState
            })

        } else {
            const index = Object.entries(totalPlayers).filter(([index, itm]) => itm.bet_type === individual)[0][0];

            const ii = index === 'Trio' ? 'TRIO' : index


            promises.push(getExBySingleTeamLayBackCasino(sportList.id, roundId, ii, match_id, individual))
            const promise_daa = await Promise.all(promises)
            setTotalPlayers((prevState) => {

                prevState[index].amounts = promise_daa[0].data === 0 ? '' : promise_daa[0].data
                return prevState
            })


        }





    }


    const updatePlayers = () => {
        setTotalPlayers((prevPlayer) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer))


            Object.entries(updatedPlayers).forEach(([index1, value1], i) => {


                const founddata = data.sub.find(item => item.nat === index1 || item.nat === value1?.subname)
                if (founddata) {

                    updatedPlayers[index1].odds.back = founddata.b
                    if (updatedPlayers[index1].odds.hasOwnProperty('lay')) {
                        updatedPlayers[index1].odds.lay = founddata.l
                        updatedPlayers[index1].odds.bbhav = founddata.bbhav
                        updatedPlayers[index1].odds.lbhav = founddata.lbhav
                    }
                    updatedPlayers[index1].status = founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                    
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [index1]: founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                    }));
                }


            })


            return updatedPlayers
        })


    }

    useEffect(() => {


        if (data?.sub) {
            updatePlayers()

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 3),

            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()
        }
    }, [exposure, sportLength, roundId]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, type, odd = 0) => {

        oddsk.current = odd
        setBetType(type)


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

    // Helper function to find data in data.sub for Trio
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Trio, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        
        if (backOrLay === 'back') {
            loss.current = stakeValue.current.value;

            // Special calculation for Session bet type back
            if (betType === 'Session') {
                profit.current = profitData.current = (oddsk.current * stakeValue.current.value / 100).toFixed(2);
                
            } else {
                // Use regular odds calculation for other bet types
                profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
                alert(profit.current)
            }

        } else {
            profit.current = profitData.current = stakeValue.current.value;

            // For Session bet type, loss is the stake value
            if (betType === 'Session') {
                loss.current = stakeValue.current.value;
            } else {
                // Use regular odds calculation for other bet types
                loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
            }
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
            totalPlayers: null,
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
            oddsk: oddsk.current,
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
        <CasinoLayout raceClass="trio" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay}
                      teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      getMinMaxLimits={getMinMaxLimits}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}>


            <div className="casino-detail">
                <div className="casino-table">
                    <PlayerTable players={Object.entries(totalPlayers).slice(0, 3)} playerName="Session"
                                 click={openPopup}/>
                    <PlayerTable players={Object.entries(totalPlayers).slice(3, 7)} click={openPopup}/>
                    <PlayerTable players={Object.entries(totalPlayers).slice(7, 12)}
                                 whichclassName="casino-table-box trioodds mt-3" click={openPopup}/>
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

const PlayerTable = ({
                         click,
                         players = {}, playerName = 'None', whichclassName = 'casino-table-box triocards mt-3'
                     }) => {
    const whichClass = playerName === 'Session' ? "casino-table-box" : whichclassName;
    return (
        <div className={whichClass}>
            {players.map(([index, value], i) => (
                <div className="casino-odd-box-container" key={i}>
                    <div className="casino-nation-name pointer">{index} {index === 'Session' && (
                        <i className="fas fa-info-circle"></i>)}
                    </div>
                    <div className={`casino-odds-box back ${value.status}`}
                         onClick={() => click('back', index, value.odds.back, value.bet_type, value.odds.bbhav || 0)}><span
                        className="casino-odds">{value.odds.back}</span>
                        {index === 'Session' && (<span className="casino-volume">80</span>)}
                    </div>
                    {value.odds.hasOwnProperty('lay') && (
                        <div className={`casino-odds-box lay ${value.status}`}value
                             onClick={() => click('lay', index, value.odds.lay, value.bet_type, value.odds.lbhav ||  0)}><span
                            className="casino-odds">{value.odds.lay}</span>
                            {index === 'Session' && (
                                <span className="casino-volume">100</span>
                            )}
                        </div>
                    )}
                    <div className="casino- text-center w-100">
                        {getExByColor(value.amounts)}
                    </div>
                </div>
            ))}


        </div>
    )
};

export default Trio;
