import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    getExByTeamNameForCasino,
    resetBetFields, placeCasinoBet, updatePlayerStats,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Race2 = () => {
    const [roundId, setRoundId] = useState('')

    const defaultValues = {odds: {back: 0, lay: 0}, status: 'suspended-box', amounts: ''}

    const [totalPlayers, setTotalPlayers] = useState({
        "Player A": defaultValues,
        "Player B": defaultValues,
        "Player C": defaultValues,
        "Player D": defaultValues,

    })
    
    const [playerStatuses, setPlayerStatuses] = useState({
        "Player A": 'suspended-box',
        "Player B": 'suspended-box',
        "Player C": 'suspended-box',
        "Player D": 'suspended-box'
    });


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
                                                <li>Race to 2nd is a new kind of game and the brilliance of this game will test your nerve.</li>
                                                <li>In this unique game the player who has the 2nd highest ranking card will be the winner (and not the highest ranking card )</li>
                                                <li>Race to 2nd is played with a regular single deck of 52 cards.</li>
                                                <li>This game is played among 4 players  : 
                                                    <div>Player A,   Player B,   Player C  and Player D </div> </li>
                                                    <li> <div>All the 4 players will be dealt one card each.</div> </li>
                                                     <li><div>The objective of the game is to guess which player will have the 2nd highest ranking card and therefor win.</div>
                                                </li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">RANKINGS OF CARDS FROM HIGHEST TO LOWEST :</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>A,   K,   Q,   J,   10,   9,   8,   7,   6,   5,   4,   3,   2 </li>
                                                <li>Here Ace of spades is the highest ranking card </li>
                                                <li>And 2 of Diamonds is the lowest ranking card.</li>
                                                <li>If any two or more players have same hands with the same ranking cards but of different suits the ranking of the players will be decided based on below suits sequence.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Suit Sequence : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>
                                                    <div class="cards-box">
                                                        <span class="card-character black-card ml-1">}</span>
                                                        <span class="ml-3">SPADES </span>
                                                        <span class="ml-3">1st</span>
                                                        <span class="ml-3">( First )</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span class="card-character red-card ml-1">{</span>
                                                        <span class="ml-3">HEARTS </span>
                                                        <span class="ml-3">2nd</span>
                                                        <span class="ml-3">( Second )</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span class="card-character black-card ml-1">]</span>
                                                        <span class="ml-3">CLUBS </span>
                                                        <span class="ml-3">3rd</span>
                                                        <span class="ml-3">( Third )</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span class="card-character red-card ml-1">[</span>
                                                        <span class="ml-3">DIAMONDS </span>
                                                        <span class="ml-3">4th</span>
                                                        <span class="ml-3">( Fourth )</span>
                                                    </div>
                                                </li>
                                                <li>Example 1 :
                                                    <div>If all the players have following hands </div>
                                                    <div>Player A  -   5 of Hearts </div>
                                                    <div>Player B  -    Ace of Hearts </div>
                                                    <div>Player C  -    2 of Clubs </div>
                                                    <div>Player D  -    King of Clubs </div>
                                                    <div>Here all four Players have different hands the ranking of the cards will be as follows :</div>
                                                    <div>Highest Ranking card (1st) will be Ace of Hearts.</div>
                                                    <div>Second Highest Ranking card (2nd) will be King of Clubs.</div>
                                                    <div>Third Highest Ranking card  (3rd) will be 5 of Hearts.</div>
                                                    <div>Fourth Highest Ranking card  (4th) will be 2 of Clubs.</div>
                                                    <div>Here the second Highest Ranking card is King of Clubs So Player D will be the winner.</div>
                                                </li>
                                                <li>Example 2 :
                                                    <div>If all the players have following hands</div>
                                                    <div>Player A  - 3 of Spades </div>
                                                    <div>Player B  -  3 of Hearts </div>
                                                    <div>Player C  -   3 of Clubs </div>
                                                    <div>Player D  -   3 of Diamonds </div>
                                                    <div>As here all four players have same hands but of different suits the ranking of the cards will be as follows :</div>
                                                    <div>Highest Ranking card ( 1st ) will be  3 of Spades.</div>
                                                    <div>Second Highest  Ranking card (2nd )  will be 3 of Hearts.</div>
                                                    <div>Third Highest Ranking card (3rd) will be  3 of Clubs.</div>
                                                    <div>Fourth Highest Ranking card (4th) will be 3 of Diamonds.</div>
                                                    <div>Here, the second highest ranking card is 3 of Hearts so player B will be the winner.</div></li>
                                                    <li><div>You will have betting options of Back and Lay on every card.</div> </li>
                                                    <li><div>In this game there will be no Tie.</div> 
                                                </li>
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
        betType,
        setBetType,
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

                const prev = {...prevState}

                Object.entries(prev).map(([index, value], i) => {

                    const datafound = data.sub.find(item => item.nat === index)
                    prev[index] = {
                        ...prev[index],
                        odds: {back: datafound.b, lay: datafound.l},
                        status: datafound.gstatus === 'OPEN' ? '' : 'suspended-box'
                    }
                    
                    // Update playerStatuses
                    setPlayerStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [index]: datafound.gstatus === 'OPEN' ? '' : 'suspended-box'
                    }));
                    return prev;
                })

                return prev
            })


        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.filter(item => item !== '1').slice(0, 1),
                playerB: cardArray.filter(item => item !== '1').slice(1, 2),
                playerC: cardArray.filter(item => item !== '1').slice(2, 3),
                playerD: cardArray.filter(item => item !== '1').slice(3, 4),
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    const udpateAmounts = async () => {

        const results = [getExByTeamNameForCasino(sportList.id, roundId, 'Player A', match_id, 'ODDS'),
            getExByTeamNameForCasino(sportList.id, roundId, 'Player B', match_id, 'ODDS'),
            getExByTeamNameForCasino(sportList.id, roundId, 'Player C', match_id, 'ODDS'),
            getExByTeamNameForCasino(sportList.id, roundId, 'Player D', match_id, 'ODDS')]


        const allpromises = await Promise.all(results);

        setTotalPlayers((prevState) => {
            const prev = { ...prevState };

            // Loop through the players and update the amounts from allpromises
            Object.entries(prev).map(([index, value], i) => {
                    // Update the amount from the resolved promise (assuming each promise contains data for the respective player)
                        prev[index].amounts = allpromises[i]?.data || '';


            });

            return prev;
        });


    }

    useEffect(() => {

        if (data?.sub && sportList?.id) {
            udpateAmounts()
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

    // Helper function to find data in data.sub for Race2
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Race2, find the item by nat field
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
            updateAmounts: udpateAmounts,
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
                        {cards?.playerA && cards.playerA.length > 0 && (
                            <div>
                                <h5>Player A</h5>
                                {renderCards(cards.playerA, "Player A")}
                            </div>
                        )}
                        {cards?.playerB && cards.playerB.length > 0 && (
                            <div className="mt-1">
                                <h5>Player B</h5>
                                {renderCards(cards.playerB, "Player B")}
                            </div>
                        )}
                        {cards?.playerC && cards.playerC.length > 0 && (
                            <div className="mt-1">
                                <h5>Player C</h5>
                                {renderCards(cards.playerC, "Player C")}
                            </div>
                        )}
                        {cards?.playerD && cards.playerD.length > 0 && (
                            <div className="mt-1">
                                <h5>Player D</h5>
                                {renderCards(cards.playerD, "Player D")}
                            </div>
                        )}
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
        <CasinoLayout ruleDescription={desc} raceClass="queen" hideLoading={hideLoading} isBack={backOrLay}
                      teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).map(([index, value], i) => (
                            <div className="casino-odd-box-container" key={i}>
                                <div className="casino-nation-name">{index}</div>
                                <div className={`casino-odds-box back ${value.status}`}
                                     onClick={() => openPopup('back', index, value.odds.back)}><span
                                    className="casino-odds">{value.odds.back}</span></div>
                                <div className={`casino-odds-box lay ${value.status}`}
                                     onClick={() => openPopup('lay', index, value.odds.lay)}><span
                                    className="casino-odds">{value.odds.lay}</span></div>
                                <div className="casino-">
                                    {getExByColor(value.amounts)}
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
            </div>
            

        </CasinoLayout>
    );

};


export default Race2;
