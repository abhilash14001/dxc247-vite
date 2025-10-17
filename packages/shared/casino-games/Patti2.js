import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Patti2 = () => {
    const [roundId, setRoundId] = useState('')
    const desc =`<div><style type="text/css">
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
        .rules-section img
        {
            height: 30px;
            margin-right: 5px;
        }
    </style>
<div class="rules-section">
                                            <h6 class="rules-highlight">Color Plus:</h6>
                                            <div>
                                                <p>It contains seven circumstances to bet on simultaneously, however you can only win prize money on the item which has the higher rate.</p>
                                                <p>The seven outcomes on which you can bet are listed below:</p>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>
                                                    <div>3 card sequence</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character red-card ml-1">2{</span>
                                                        <span class="card-character black-card ml-1">3]</span>
                                                        <span class="card-character red-card ml-1">4[</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>3 of a Kind</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character red-card ml-1">3{</span>
                                                        <span class="card-character red-card ml-1">3[</span>
                                                        <span class="card-character black-card ml-1">3}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>3 card pure sequence</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character red-card ml-1">2{</span>
                                                        <span class="card-character red-card ml-1">3{</span>
                                                        <span class="card-character red-card ml-1">4{</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>4 card colour</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character black-card ml-1">2]</span>
                                                        <span class="card-character black-card ml-1">6]</span>
                                                        <span class="card-character black-card ml-1">7]</span>
                                                        <span class="card-character black-card ml-1">9]</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>4 card sequence</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character black-card ml-1">2}</span>
                                                        <span class="card-character red-card ml-1">3[</span>
                                                        <span class="card-character black-card ml-1">4]</span>
                                                        <span class="card-character red-card ml-1">5[</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>4 card pure sequence</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character black-card ml-1">2}</span>
                                                        <span class="card-character black-card ml-1">3}</span>
                                                        <span class="card-character black-card ml-1">4}</span>
                                                        <span class="card-character black-card ml-1">5}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>4 of a kind</div>
                                                    <div class="cards-box">
                                                        <span>E.g</span>
                                                        <span class="card-character red-card ml-1">3{</span>
                                                        <span class="card-character black-card ml-1">3]</span>
                                                        <span class="card-character red-card ml-1">3[</span>
                                                        <span class="card-character black-card ml-1">3}</span>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div class="mt-2">
                                                <div>if your card is</div>
                                                <div class="cards-box">
                                                    <span>E.g</span>
                                                    <span class="card-character red-card ml-1">6[</span>
                                                    <span class="card-character red-card ml-1">7[</span>
                                                    <span class="card-character red-card ml-1">8[</span>
                                                    <span class="card-character red-card ml-1">9[</span>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <p>Here you will win prize in case there is a 4 card pure sequence only…! Hence they wil not receive the prize of:</p>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>3 card sequence</li>
                                                <li>4 card sequence</li>
                                                <li>4 card color</li>
                                                <li>3 card pure sequence</li>
                                            </ul>
                                            <div class="mt-2">
                                                <p>Next example.</p>
                                                <p>If the cards are:</p>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>King of Spades</li>
                                                <li>King of Clubs</li>
                                                <li>King of Diamonds</li>
                                                <li>King of Hearts</li>
                                            </ul>
                                            <div class="mt-2">
                                                <p>In this instance you will only receive the prize of 4 of a kind, therefore you will not win prize of 3 of a kind.</p>
                                                <p>You will only be able to win one prize, the one which is the most beneficial to them.</p>
                                            </div>
                                        </div></div>
                                        <div><div class="rules-section">
                                            <h6 class="rules-highlight">Main:</h6>
                                            <p>In case of consecutive cards, the third card is to be considered in ascending order only. For example,</p>
                                            <p>if the first two cards are king &amp; ace then the third card is 2,  so it becomes: k, A &amp; 2 (which is not sequence).</p>
                                            <p>If the first two cards are 2 &amp; 3, then third card is 4, so it becomes 2,3,4 (it will not be 1,2,3).</p>
                                            <p>The sequence in order from 1st to last is listed below:</p>
                                            <div class="row row5 pl-2 pr-2">
                                                <div class="col-6">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <td>Queen &amp; King</td>
                                                                <td class="text-right">1st</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Ace &amp; 2</td>
                                                                <td class="text-right">2nd</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Jack &amp; Queen</td>
                                                                <td class="text-right">3rd</td>
                                                            </tr>
                                                            <tr>
                                                                <td>10 &amp; Jack</td>
                                                                <td class="text-right">4th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>9 &amp; 10</td>
                                                                <td class="text-right">5th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>8 &amp; 9</td>
                                                                <td class="text-right">6th</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="col-6">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <td>7 &amp; 8</td>
                                                                <td class="text-right">7th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>6 &amp; 7</td>
                                                                <td class="text-right">8th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>5 &amp; 6</td>
                                                                <td class="text-right">9th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>4 &amp; 5</td>
                                                                <td class="text-right">10th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>3 &amp; 4</td>
                                                                <td class="text-right">11th</td>
                                                            </tr>
                                                            <tr>
                                                                <td>2 &amp; 3</td>
                                                                <td class="text-right">12th</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <p>If it is alternative cards eg. 6 &amp; 8. Or 2 &amp; 4 Or Q &amp; A</p>
                                                <p>This type of alternative game will not be considered as a sequence..!</p>
                                                <p>If it comes 4 &amp; 4 this will be considered as a trio of 4</p>
                                                <p>Another example is Ace &amp; Ace, which will be considered as trio of Ace.</p>
                                            </div>
                                            <div class="mt-2">
                                                <p>Best combination of  games in order of 1st to last:</p>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Pure sequence: 1st  best combination</li>
                                                <li>Trio (3 of a kind): 2nd best combination</li>
                                                <li>Sequence (straight): 3rd best combination</li>
                                                <li>colour (suits): 4th best combination</li>
                                            </ul>
                                            <div>
                                                <p>After that, all the games will be valued of higher card.</p>
                                            </div>
                                        </div></div>
                                        <div><div class="rules-section">
                                            <h6 class="rules-highlight">Mini Baccarat:</h6>
                                            <p>It is a comparison between the last digit of Total of both the sides Value of cards for baccarat is:</p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Ace = one point</li>
                                                <li>2 = 2 point</li>
                                                <li>3 = 3 point</li>
                                                <li>4 = 4 point</li>
                                                <li>5 = 5 point</li>
                                                <li>6 = 6 point</li>
                                                <li>7 = 7 point</li>
                                                <li>8 = 8 point</li>
                                                <li>9 = 9 point</li>
                                                <li>10 = 0 point</li>
                                                <li>Jack = 0 point</li>
                                                <li>Queen = 0 point</li>
                                                <li>King = 0 point</li>
                                            </ul>
                                            <div class="mt-2">
                                                <p>Total of two card can be ranged between 0 to 18</p>
                                                <p>If total is in single digit ,then the same will be considered as baccarat value</p>
                                                <p>If the total is of double digit, then the last digit wil be considered as baccarat value Higher value baccarat will win.</p>
                                                <p>If baccarat value of both the sides are equal, then both side’s will lose their bets..</p>
                                            </div>
                                        </div></div>
                                        
                                        <div><div class="rules-section">
                                            <h6 class="rules-highlight">Total:</h6>
                                            <p>Session is total of 2 cards value</p>
                                            <p>value of each cards</p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Ace = 1 point</li>
                                                <li>2 = 2 point</li>
                                                <li>3 = 3 point</li>
                                                <li>4 = 4 point</li>
                                                <li>5 = 5 point</li>
                                                <li>6 = 6 point</li>
                                                <li>7 = 7 point</li>
                                                <li>8 = 8 point</li>
                                                <li>9 = 9 point</li>
                                                <li>10 = 10 point</li>
                                                <li>Jack = 11 point</li>
                                                <li>Queen = 12 point</li>
                                                <li>King = 13 point</li>
                                            </ul>
                                        </div></div>`


    const oddsk = useRef(0)
    const defaultValues = {odds: {back: 0, lay: 0}, status: '', amounts: '', bet_type : "ODDS"};
    const miniBaccaratDefault = {odds: {back: 0}, status: '', amounts: '', bet_type : "BACCARAT"};
    const totalDefault = {odds: {lay: 0, back: 0, bhav: 0, lbhav: 0}, status: '', amounts: ''};

    const [totalPlayers, setTotalPlayers] = useState({
        "Player A": defaultValues,
        "Mini Baccarat A": miniBaccaratDefault,
        "Total A": {...totalDefault, bet_type : "TOTAL_A"},
        "Player B": defaultValues,
        "Mini Baccarat B": miniBaccaratDefault,
        "Total B": {...totalDefault, bet_type : "TOTAL_B"},
        "Color Plus": {...miniBaccaratDefault, bet_type : 'COLOR_PLUS'}
    });


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
    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({"Player A": '', "Player B": ''});
    
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);
    const updateAmounts = async (individualBetType = false) => {
        //
        let results = []

        if (!individualBetType) {

            results = [await getExBySingleTeamNameCasino(sportList.id, roundId, 'Mini Baccarat A', match_id, 'BACCARAT'),
                await getExBySingleTeamNameCasino(sportList.id, roundId, 'Mini Baccarat B', match_id, 'BACCARAT'),
                await getExBySingleTeamNameCasino(sportList.id, roundId, 'Total A', match_id, 'TOTAL_A'),
                await getExBySingleTeamNameCasino(sportList.id, roundId, 'Total B', match_id, 'TOTAL_B'),
                await getExBySingleTeamNameCasino(sportList.id, roundId, 'Color Plus', match_id, 'COLOR_PLUS'),
                await getExByTeamNameForCasino(sportList.id, roundId, 'Player A', match_id, 'ODDS'),
                await getExByTeamNameForCasino(sportList.id, roundId, 'Player B', match_id, 'ODDS')
            ]
        }
        else{
            results = [await getExBySingleTeamNameCasino(sportList.id, roundId, teamname.current, match_id, betType)]
        }


        setTotalPlayers((prevState) => {
            const updatedState = {...prevState};
            const teamAmounts = {};

            results.forEach((items) => {

                if (Array.isArray(items.data)) {
                    items.data.forEach((item) => {
                        const teamName = item.team_name; // Get the team_name from the result
                        teamAmounts[teamName] = item.total_amount || 0; // Store the total amount by team name
                    })
                } else {
                    const t = JSON.parse(items.config.data).player
                    teamAmounts[t] = items.data
                }
            })


            Object.entries(updatedState).forEach(([index1, value]) => {

                // If the teamName matches the key + side, update the amounts

                if (teamAmounts[index1] !== undefined) {
                    updatedState[index1].amounts = teamAmounts[index1]

                } else if(!individualBetType) {
                    updatedState[index1].amounts = ''
                }


            });
            return updatedState; // Return the new state
        });

    };

    useEffect(() => {


        if (data?.sub) {

    

            setTotalPlayers((prevState) => {

                const updatedPlayers = JSON.parse(JSON.stringify(prevState))
                Object.entries(updatedPlayers).forEach(([index, value]) => {

                    const founddata = data.sub.find(item => item.nat === index)
                    if (founddata) {
                        updatedPlayers[index].status = founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                        
                        // Update playerStatuses
                        setPlayerStatuses(prev => ({
                            ...prev,
                            [index]: founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                        }));

                        if (updatedPlayers[index].odds.hasOwnProperty('bhav')) {
                            updatedPlayers[index].odds.bhav = founddata.bbhav
                        }

                        if (updatedPlayers[index].odds.hasOwnProperty('back')) {
                            updatedPlayers[index].odds.back = founddata.b
                        }

                        if (updatedPlayers[index].odds.hasOwnProperty('lay')) {
                            updatedPlayers[index].odds.lay = founddata.l
                        }

                        if (updatedPlayers[index].odds.hasOwnProperty('lbhav')) {
                            updatedPlayers[index].odds.lbhav = founddata.lbhav

                        }
                    }

                })

                return updatedPlayers;

            })

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: [cardArray[0], cardArray[2]],
                playerB: [cardArray[1], cardArray[3]],
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
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, bet, odd = 0) => {
        
        setBetType(bet)
        oddsk.current = odd


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

    // Helper function to find data in data.sub for Patti2
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Patti2, find the item by nat field
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
            totalPlayers: teamname.current === 'Color Plus' ? totalPlayers['Color Plus'] : totalPlayers['Player A'],
            playerStatuses: playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: () => updateAmounts(true),
            Notify
        };

        const success = await placeCasinoBet(betData, {
            oddsk: oddsk.current,
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
                            <h5>Player A</h5>
                            {renderCards(cards.playerA, "Player A")}
                        </div>
                        <div className="mt-1">
                            <h5>Player B</h5>
                            {renderCards(cards.playerB, "Player B")}
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

        <CasinoLayout raceClass="teenpatti2cards" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">

                        <div className="casino-table-left-box">
                            <div className="casino-table-body">
                                <div className="row">
                                    {Object.entries(totalPlayers).slice(0, 3).map(([key, values], i) => (

                                        <div
                                            key={i}
                                            className={`casino-table-row ${!values.odds.hasOwnProperty('lay') ? 'mini-baccarat' : ''}`}
                                        >
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{key}</div>
                                                {getExByColor(values.amounts)}
                                            </div>

                                            {Object.entries(values.odds).slice(0, 2).map(([index1, value1], i1) => (

                                                <div key={i1}
                                                     className={`casino-odds-box ${index1} ${values.status}`}
                                                     onClick={() => openPopup(index1, key, values.odds[index1], values.bet_type, values.odds.hasOwnProperty('bhav') && index1 === 'back' ? values?.odds.bhav : values?.odds.lbhav || 0)}  // Replace with your actual click handler
                                                >



                                                    <span className={
                                                        (index1 === 'lay' && values.odds.hasOwnProperty('lbhav')) ||
                                                        (index1 === 'back' && values.odds.hasOwnProperty('bhav'))
                                                            ? 'casino-volume'
                                                            : 'casino-odds'
                                                    }>{values.odds[index1]}</span>
                                                    {values.odds.hasOwnProperty('lbhav') && index1 === 'lay' && (
                                                        <span className="casino-odds">{values.odds.lbhav}</span>
                                                    )}
                                                    {values.odds.hasOwnProperty('bhav') && index1 === 'back' && (
                                                        <span className="casino-odds">{values.odds.bhav}</span>
                                                    )}
                                                </div>


                                            ))}

                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>


                        <div className="casino-table-right-box">
                            <div className="casino-table-body">
                                <div className="row">
                                    {Object.entries(totalPlayers).slice(3, 6).map(([key, values], i) => (

                                        <div
                                            key={i}
                                            className={`casino-table-row ${!values.odds.hasOwnProperty('lay') ? 'mini-baccarat' : ''}`}
                                        >
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{key}</div>
                                                {getExByColor(values.amounts)}
                                            </div>

                                            {Object.entries(values.odds).slice(0, 2).map(([index1, value1], i1) => (

                                                <div key={i1}
                                                     className={`casino-odds-box ${index1} ${values.status}`}
                                                     onClick={() => openPopup(index1, key, values.odds[index1], values.bet_type, values.odds.hasOwnProperty('bhav') && index1 === 'back' ? values?.odds.bhav : values?.odds.lbhav || 0)}  // Replace with your actual click handler
                                                >


                                                    <span className={
                                                        (index1 === 'lay' && values.odds.hasOwnProperty('lbhav')) ||
                                                        (index1 === 'back' && values.odds.hasOwnProperty('bhav'))
                                                            ? 'casino-volume'
                                                            : 'casino-odds'
                                                    }>
                                                        {values.odds[index1]}</span>
                                                    {values.odds.hasOwnProperty('lbhav') && index1 === 'lay' && (
                                                        <span className="casino-odds">{values.odds.lbhav}</span>
                                                    )}
                                                    {values.odds.hasOwnProperty('bhav') && index1 === 'back' && (
                                                        <span className="casino-odds">{values.odds.bhav}</span>
                                                    )}
                                                </div>


                                            ))}

                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="casino-table-full-box color-plus my-2">
                        <div onClick={() => openPopup('back', 'Color Plus', 2, 'COLOR_PLUS')} className={`casino-odds-box back ${totalPlayers['Color Plus'].status}`}><span
                            className="casino-odds">Color Plus</span>
                            {getExByColor(totalPlayers['Color Plus'].amounts)}
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


export default Patti2;
