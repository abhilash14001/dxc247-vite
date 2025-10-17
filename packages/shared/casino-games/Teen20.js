import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import axiosFetch, {
    getExBySingleTeamNameCasino, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";


const Teen20 = () => {
    const [roundId, setRoundId] = useState('')
    
    const ruleDescription =`<div><style type="text/css">
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
.rules-section img {
  max-width: 100%;
}
    </style>

<div className="rules-section">
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>The game is played with a regular 52 cards single deck, between 2 players A and B.</li>
                                                <li>Each player will receive 3 cards.</li>
                                                <li><b>Rules of regular teenpatti winner</b></li>
                                            </ul>
                                            <div>
                                                <img src="https://sitethemedata.com/casino-new-rules-images/teen20b.jpg">
                                            </div>
                                        </div></div>
                                        <div><div className="rules-section">
                                            <h6 className="rules-highlight">Rules of 3 baccarat</h6>
                                            <p>There are 3 criteria for winning the 3 Baccarat .</p>
                                            <h7 className="rules-sub-highlight">First criteria:</h7>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>Game having trio will win,</li>
                                                <li>If both game has trio then higher trio will win.</li>
                                                <li>Ranking of trio from high to low.
                                                    <div className="pl-2 pr-2">1,1,1</div>
                                                    <div className="pl-2 pr-2">K,K,K</div>
                                                    <div className="pl-2 pr-2">Q,Q,Q</div>
                                                    <div className="pl-2 pr-2">J,J,J</div>
                                                    <div className="pl-2 pr-2">10,10,10</div>
                                                    <div className="pl-2 pr-2">9,9,9</div>
                                                    <div className="pl-2 pr-2">8,8,8</div>
                                                    <div className="pl-2 pr-2">7,7,7</div>
                                                    <div className="pl-2 pr-2">6,6,6</div>
                                                    <div className="pl-2 pr-2">5,5,5</div>
                                                    <div className="pl-2 pr-2">4,4,4</div>
                                                    <div className="pl-2 pr-2">3,3,3</div>
                                                    <div className="pl-2 pr-2">2,2,2</div>
                                                </li>
                                                <li>If none of the game have got trio then second criteria will apply.</li>
                                            </ul>
                                            <h7 className="rules-sub-highlight">Second criteria:</h7>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>Game having all the three face card will win.</li>
                                                <li>Here JACK, QUEEN AND KING are named face card.</li>
                                                <li>if both the game have all three face cards then game having highest face card will win.</li>
                                                <li>Ranking of face card from High to low :
                                                    <div className="pl-2 pr-2">Spade King</div>
                                                    <div className="pl-2 pr-2">Heart King</div>
                                                    <div className="pl-2 pr-2">Club King</div>
                                                    <div className="pl-2 pr-2">Diamond King</div>
                                                </li>
                                                <li>Same order will apply for Queen (Q) and Jack (J) also .</li>
                                                <li>If second criteria is also not applicable, then 3rd criteria will apply .</li>
                                            </ul>
                                            <h7 className="rules-sub-highlight">3rd criteria:</h7>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>Game having higher baccarat value will win .</li>
                                                <li>For deciding baccarat value we will add point value of all the three cards</li>
                                                <li>Point value of all the cards :
                                                    <div className="pl-2 pr-2">1 = 1</div>
                                                    <div className="pl-2 pr-2">2 = 2</div>
                                                    <div className="pl-2 pr-2">To</div>
                                                    <div className="pl-2 pr-2">9 = 9</div>
                                                    <div className="pl-2 pr-2">10, J ,Q, K has zero (0) point value .</div>
                                                </li>
                                            </ul>
                                            <p><b>Example 1st:</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>Last digit of total will be considered as baccarat value
                                                    <div className="pl-2 pr-2">2,5,8 =</div>
                                                    <div className="pl-2 pr-2">2+5+8 =15 here last digit of total is 5 , So baccarat value is 5.</div>
                                                </li>
                                            </ul>
                                            <p><b>Example 2nd :</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>1,3,K</li>
                                                <li>1+3+0 = 4 here total is in single digit so we will take this single digit 4 as baccarat value</li>
                                            </ul>
                                            <p><b>If baccarat value of both the game is equal then Following condition will apply :</b></p>
                                            <p><b>Condition 1 :</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>Game having more face card will win.</li>
                                                <li>Example : Game A has 3,4,k and B has 7,J,Q then game B will win as it has more face card then game A .</li>
                                            </ul>
                                            <p><b>Condition 2 :</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>If Number of face card of both the game are equal then higher value face card game will win.</li>
                                                <li>Example : Game A has 4,5,K (K Spade ) and Game B has 9,10,K ( K Heart ) here baccarat value of both the game is equal (9 ) and both the game have same number of face card so game A will win because It has got higher value face card then Game B .</li>
                                            </ul>
                                            <p><b>Condition 3 :</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>If baccarat value of both the game is equal and none of game has got face card then in this case Game having highest value point card will win .</li>
                                                <li>Value of Point Cards :
                                                    <div className="pl-2 pr-2">Ace = 1</div>
                                                    <div className="pl-2 pr-2">2 = 2</div>
                                                    <div className="pl-2 pr-2">3 = 3</div>
                                                    <div className="pl-2 pr-2">4 = 4</div>
                                                    <div className="pl-2 pr-2">5 = 5</div>
                                                    <div className="pl-2 pr-2">6 = 6</div>
                                                    <div className="pl-2 pr-2">7 = 7</div>
                                                    <div className="pl-2 pr-2">8 = 8</div>
                                                    <div className="pl-2 pr-2">9 = 9</div>
                                                    <div className="pl-2 pr-2">10 = 0 (Zero )</div>
                                                </li>
                                                <li>Example : GameA: 1,6,10 And GameB: 7,10,10</li>
                                                <li>here both the game have same baccarat value . But game B will win as it has higher value point card i.e. 7 .</li>
                                            </ul>
                                            <p><b>Condition 4 :</b></p>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>If baccarat value of both game is equal and none of game has got face card and high point card of both the game is of equal point value , then suits of both high card will be compared</li>
                                                <li>Example :
                                                    <div className="pl-2 pr-2">
                                                        Game A : 1(Heart) ,2(Heart) ,5(Heart)
                                                    </div>
                                                    <div className="pl-2 pr-2">
                                                        Game B : 10 (Heart) , 3 (Diamond ) , 5 (Spade )
                                                    </div>
                                                </li>
                                                <li>Here Baccarat value of both the game (8) is equal . and none of game has got face card and point value of both game's high card is equal so by comparing suits of both the high card ( A 5 of Heart , B 5 of spade ) game B is declared 3 Baccarat winner .</li>
                                                <li>Ranking of suits from High to low :
                                                    <div className="pl-2 pr-2">Spade</div>
                                                    <div className="pl-2 pr-2">Heart</div>
                                                    <div className="pl-2 pr-2">Club</div>
                                                    <div className="pl-2 pr-2">Diamond</div>
                                                </li>
                                            </ul>
                                        </div></div>
                                        <div><div className="rules-section">
                                            <h6 className="rules-highlight">Rules of Total :</h6>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>It is a comparison of total of all three cards of both the games.</li>
                                                <li>Point value of all the cards for the bet of total
                                                    <div className="pl-2 pr-2">Ace = 1</div>
                                                    <div className="pl-2 pr-2">2 = 2</div>
                                                    <div className="pl-2 pr-2">3 = 3</div>
                                                    <div className="pl-2 pr-2">4 = 4</div>
                                                    <div className="pl-2 pr-2">5 = 5</div>
                                                    <div className="pl-2 pr-2">6 = 6</div>
                                                    <div className="pl-2 pr-2">7 = 7</div>
                                                    <div className="pl-2 pr-2">8 = 8</div>
                                                    <div className="pl-2 pr-2">9 = 9</div>
                                                    <div className="pl-2 pr-2">10 = 10</div>
                                                    <div className="pl-2 pr-2">Jack = 11</div>
                                                    <div className="pl-2 pr-2">Queen = 12</div>
                                                    <div className="pl-2 pr-2">King = 13</div>
                                                </li>
                                                <li>suits doesn't matter</li>
                                                <li>If total of both the game is equal , it is a Tie .</li>
                                                <li>If total of both the game is equal then half of your bet amount will returned.</li>
                                            </ul>
                                        </div></div>
                                        `;


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
        setPopupDisplayForDesktop,
        betType

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({ "Player A": 'suspended-box', "Player B": 'suspended-box' });
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('WINNER')

        if (data?.sub) {
            updatePlayerStats(data.sub[0], setPlayerA_Back, "Player A");
            updatePlayerStats(data.sub[1], setPlayerB_Back, "Player B");

        }

        
    }, [data?.sub]);

    useEffect(() => {
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: [cardArray[0], cardArray[2], cardArray[4]], // 1st, 3rd, 5th index
                playerB: [cardArray[1], cardArray[3], cardArray[5]], // 2nd, 4th, 6th index
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.card]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            getExBySingleTeamNameCasino(sportList.id, data.mid, 'Player A', match_id, 'WINNER').then(res => setPlayerA(res.data))

            getExBySingleTeamNameCasino(sportList.id, data.mid, 'Player B', match_id, 'WINNER').then(res => setPlayerB(res.data))
        }
    }, [exposure, roundId]);

    const updatePlayerStats = (playerData, setPlayerBack, playerName) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-box";

        }
        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));

        if (playerData.b) {
            setPlayerBack(playerData.b);
        } else {
            setPlayerBack(0);
        }

    };
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

    // Helper function to find data in data.sub for Teen20
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen20, find the item by nat field
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
            match_id: 'teen20',
            roundIdSaved,
            totalPlayers: teamNames.current,
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
        <CasinoLayout  ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            {/*<div className="casino-detail">*/}
                <div className="table-responsive mb-1">
                    <table className="table table-bordered mb-0">
                        <thead>
                        <tr>
                            <th className="box-5 min-max"></th>
                            <th colSpan="2" className="box-5 text-center back">BACK</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="box-5">
                            <span className="d-block">
                                <b className="float-left">Player A</b>
                                <span
                                    className={`d-block float-right ${playerA >= 0 ? 'text-success' : 'text-danger'}`}>{playerA}</span>
                            </span>
                            </td>
                            <td className={`box-2 back text-center ${playerStatuses['Player A']}`}>
                                <span className="odds d-block"
                                      onClick={() => openPopup('back', "Player A", playerA_Back)}><b>{playerA_Back}</b></span>
                                <span className="odds d-block">&nbsp;</span>
                            </td>
                            <td className="box-3 back text-center suspended-box">
                                <span className="odds d-block"><b>Pair plus A</b></span>

                            </td>
                        </tr>
                        <tr>
                            <td className="box-5">
                            <span className="d-block">
                                <b className="float-left">Player B</b>
                                <span
                                    className={`d-block float-right ${playerB >= 0 ? 'text-success' : 'text-danger'}`}>{playerB}</span>

                            </span>
                            </td>
                            <td className={`box-2 back text-center ${playerStatuses['Player B']}`}>
                                <span className="odds d-block"
                                      onClick={() => openPopup('back', "Player B", playerB_Back)}><b>{playerB_Back}</b></span>
                                <span className="odds d-block">&nbsp;</span>
                            </td>
                            <td className="box-3 back text-center suspended-box">
                                <span className="odds d-block"><b>Pair plus B</b></span>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>


                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            {/*</div>*/}
            


        </CasinoLayout>
    );

};

export default Teen20;
