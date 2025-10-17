import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
     getExByColor, getExBySingleTeamNameCasino,
     resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";


const Teenmuf = () => {
    const [roundId, setRoundId] = useState('')

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
        .rules-section img
        {
            height: 30px;
            margin-right: 5px;
        }
    </style>
<div class="rules-section">
                                            <h6 class="rules-highlight">Main Bet:</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li><b>It is played with regular 52 card deck</b> between two teams .A &amp; B.</li>
                                                <li><b>Lowest of the 2 games will win.</b></li>
                                                <li>In regular teenpatti 
                                                    <div class="cards-box">
                                                        <span class="card-character black-card ml-1">2]</span>
                                                        <span class="card-character black-card ml-1">3}</span>
                                                        <span class="card-character red-card ml-1">5{</span>
                                                    </div>
                                                    of different color(suits) is the lowest game, But in this game it is the best game.
                                                </li>
                                                <li>In regular teenpatti 
                                                    <div class="cards-box">
                                                        <span class="card-character black-card ml-1">Q}</span>
                                                        <span class="card-character black-card ml-1">K}</span>
                                                        <span class="card-character black-card ml-1">A}</span>
                                                    </div>
                                                    of same color(suits) is the highest game, But it is the worst game.
                                                </li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Fancy:</h6>
                                            <h7 class="rules-sub-highlight">TOP9</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Here, 2 conditions apply:</li>
                                                <li>Condition 1<div>Game must not have,</div></li>
                                            </ul>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Pair</li>
                                                <li>Color</li>
                                                <li>Sequence</li>
                                                <li>Trio</li>
                                                <li>Pure sequence</li>
                                            </ul>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Condition 2</li>
                                            </ul>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>If your game has the highest card of <b>9</b>, you will receive triple(x3) amount of your betting value.</li>
                                                <li>If your game has the highest card of <b>8</b>, you will receive quadruple(x4) amount of your betting value.</li>
                                                <li>If your game has the highest card of <b>7</b>, you will will receive (x5) amount of your betting value.</li>
                                                <li>If your game has the highest card of <b>6</b>, you will receive (x8) amount of your betting value.</li>
                                                <li>If your game has the highest card of <b>5</b>, you will receive (x30) amount of your betting value.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">M(muflis) bacarrat.:</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Baccarat is where you take the last digit of the total of the 3 cards of the game.</li>
                                                <li>Value of cards are:</li>
                                            </ul>
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
                                                <li>10 , jack , queen, king , all have zero points value( suit or color of the card doesn’t matter in point value)</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Example 1:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>if game is
                                                    <div class="pl-2 pr-2">2 ,5 ,8</div>
                                                    <div class="pl-2 pr-2">2 + 5 + 8 = 15</div>
                                                </li>
                                                <li>Here last digit is 5</li>
                                                <li>So bacarrat value is 5</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Example 2:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Game is
                                                    <div class="pl-2 pr-2">1, 4, K</div>
                                                    <div class="pl-2 pr-2">1 + 4 + 0 = 5</div>
                                                </li>
                                                <li>If answer is in one digit , then that one digit is considered as baccarat value.</li>
                                                <li>M baccarat is comparision of baccarat value of both the game.</li>
                                                <li>But here lower value baccarat will win.</li>
                                                <li>If baccarat value is tie of both the game then,</li>
                                                <li>game having lowest card will win.</li>
                                                <li>ace is highest card.</li>
                                                <li>&amp; 2 is lowest card.</li>
                                                <li>If lowest card of both game is equal then color will be compared.</li>
                                                <li>Diamond color is lowest.</li>
                                                <li>Then club then heart then spade.</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Example:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>
                                                    <div>if bacarrat value is tie &amp; lowest card of game A is</div>
                                                    <div class="cards-box pl-2 pr-2">
                                                        <span class="card-character red-card ml-1">2{</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>&amp; lowest card of game B is</div>
                                                    <div class="cards-box pl-2 pr-2">
                                                        <span class="card-character red-card ml-1">2[</span>
                                                    </div>
                                                </li>
                                                <li>then game B will win.</li>
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
        setBetType, betType, setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)


    const defaultValues = {odds: 0, status: "suspended-box", amounts: ""}


    const playerArray = [{"Winner": defaultValues}, {"Top 9": defaultValues}, {"M Baccarat": defaultValues},]
    const [totalPlayers, setTotalPlayers] = useState({

        "Player A": playerArray, "Player B": playerArray,

    })

    const teamNames = useRef(["Player A", "Player B"])
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

            const updateData = () => {
                setTotalPlayers((prevState) => {
                    const updatedState = JSON.parse(JSON.stringify(prevState)); // Create a deep copy
                    Object.entries(updatedState).forEach(([index1, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach((vv, index) => {
                                const getSide = index1.split(" ")[1]
                                const keys = Object.keys(vv)[0]
                                const nation = keys === 'Winner' ? 'Player ' + getSide : keys + " " + getSide
                                const foundata = data.sub.find(item => item.nat === nation)
                                if (foundata) {
                                    updatedState[index1][index][keys] = {
                                        ...updatedState[index1][index][keys],
                                        odds: foundata.b,
                                        status: foundata.gstatus === 'OPEN' ? '' : "suspended-box"
                                    }
                                    
                                    // Update playerStatuses
                                    setPlayerStatuses(prev => ({
                                        ...prev,
                                        [nation]: foundata.gstatus === 'OPEN' ? '' : "suspended-box"
                                    }));
                                }
                            })
                        }
                    })
                    return updatedState
                })
            }
            updateData()
        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.filter((_, index) => index % 2 === 0),
                playerB: cardArray.filter((_, index) => index % 2 === 1),
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;

    const updateAmounts = async () => {
        const results = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')


        setTotalPlayers((prevState) => {
            const updatedState = JSON.parse(JSON.stringify(prevState));
            const teamAmounts = {};

            results?.data?.forEach((item) => {
                const teamName = item.team_name; // Get the team_name from the result
                teamAmounts[teamName] = item.total_amount || 0; // Store the total amount by team name
            });

            Object.entries(updatedState).forEach(([index1, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((vv, index) => {
                        // Check for 'Player A' or 'Player B'
                        const getSide = index1.split(" ")[1]; // Get "A" or "B"
                        let key = Object.keys(vv)[0];

                        if (key === 'MBaccarat') {
                            // If the key is 'MBaccarat', use 'M Baccarat'
                            key = 'M Baccarat';
                        } else if (key === 'Winner') {
                            // If the key is 'Winner', use 'Player'
                            key = 'Player';
                        }

                        // If the teamName matches the key + side, update the amounts
                        const teamKey = key + " " + getSide;
                        if (teamAmounts[teamKey] !== undefined) {
                            updatedState[index1][index][Object.keys(vv)[0]] = {
                                ...updatedState[index1][index][Object.keys(vv)[0]],
                                amounts: teamAmounts[teamKey]
                            };
                        }
                        else{
                            updatedState[index1][index][Object.keys(vv)[0]] = {
                                ...updatedState[index1][index][Object.keys(vv)[0]],
                                amounts:''
                            };
                        }
                    });
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

    // Helper function to find data in data.sub for Teenmuf
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teenmuf, find the item by nat field
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

    const renderCards = (cards, player) => (<div className="flip-card-container">
            {cards?.map((card, index) => {
                const imgSrc = card ? `/img/casino/cards/${card}.png` : '/img/casino/cards/1.png';
                return (<div className="flip-card" key={index}>
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                        </div>
                    </div>);
            })}
        </div>);

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
            totalPlayers: totalPlayers['Player A'][0]['Winner'],
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
        return (
            <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div>

                            {renderCards(cards.playerA, "Player A")}
                        </div>
                        <div className="mt-1">

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

        <CasinoLayout raceClass="teenpattimuflis" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>


            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).map(([index1, value], i) => (
                            <div className={i === 0 ? "casino-table-left-box" : "casino-table-right-box"} key={i}>
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail">{index1}</div>
                                </div>
                                <div className="casino-table-body">
                                    <div className="casino-table-row">

                                        <div className="casino-odds-box">Winner</div>
                                        <div className="casino-odds-box">Top 9</div>
                                        <div className="casino-odds-box">M Baccarat {i === 0 ? 'A' : 'B'}</div>

                                    </div>
                                    <div className="casino-table-row">
                                        {value.map((value1, index) => {
                                            const keys = Object.keys(value1)[0]

                                            const dup = i === 0 ? " A" : " B"
                                            const keyIs = keys === 'Winner' ? 'Player' + dup : keys + dup
                                            return (<div className={`casino-odds-box back ${value1[keys].status}`}
                                                         key={index}
                                                         onClick={() => openPopup('back', keyIs, value1[keys].odds, keys.replace(" ", "").toUpperCase())}>
                                                    <span className="casino-odds">{value1[keys].odds}</span>
                                                    <span className="casino-">
                                                    {getExByColor(value1[keys].amounts)}
                                                    </span>
                                                </div>)
                                        })}

                                    </div>
                                </div>
                            </div>))}
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
            

        </CasinoLayout>);

};


export default Teenmuf;
