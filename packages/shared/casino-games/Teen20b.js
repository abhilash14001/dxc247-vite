import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teen20b = () => {
    const [roundId, setRoundId] = useState('')

    const defaultValues = {odds: 0, status: "suspended-box", amounts: ""}
    const playerKeys = ['A', 'B'];

    const [totalPlayers, setTotalPlayers] = useState({

        "Player A": {...defaultValues, type: "WINNER"},
        "3 Baccarat A": {...defaultValues, type: "KHAL"},
        "Total A": {...defaultValues, type: "TOTAL"},

        "Pair Plus A": {...defaultValues, type: "PAIR"},
        "Black A": {...defaultValues, type: "RED_BLACK_A"},

        "Red A": {...defaultValues, type: "RED_BLACK_A"},

        "Player B": {...defaultValues, type: "WINNER"},
        "3 Baccarat B": {...defaultValues, type: "KHAL"},
        "Total B": {...defaultValues, type: "TOTAL"},
        "Pair Plus B": {...defaultValues, type: "PAIR"},
        "Black B": {...defaultValues, type: "RED_BLACK_B"},

        "Red B": {...defaultValues, type: "RED_BLACK_B"},


    })

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const {match_id} = useParams();
    const ruleImage =  match_id == 'teen20c' ? null : 'https://sitethemedata.com/casino-new-rules-images/teen20b.jpg'

    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)
    const desc = match_id == 'teen20c' ? `<div><style type="text/css">
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

<div class="rules-section">
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>The game is played with a regular 52 cards single deck, between 2 players A and B.</li>
                                                <li>Each player will receive 3 cards.</li>
                                                <li><b>Rules of regular teenpatti winner</b></li>
                                            </ul>
                                            <div>
                                                <img src="https://sitethemedata.com/casino-new-rules-images/teen20b.jpg">
                                            </div>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Rules of 3 baccarat</h6>
                                            <p>There are 3 criteria for winning the 3 Baccarat .</p>
                                            <h7 class="rules-sub-highlight">First criteria:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Game having trio will win,</li>
                                                <li>If both game has trio then higher trio will win.</li>
                                                <li>Ranking of trio from high to low.
                                                    <div class="pl-2 pr-2">1,1,1</div>
                                                    <div class="pl-2 pr-2">K,K,K</div>
                                                    <div class="pl-2 pr-2">Q,Q,Q</div>
                                                    <div class="pl-2 pr-2">J,J,J</div>
                                                    <div class="pl-2 pr-2">10,10,10</div>
                                                    <div class="pl-2 pr-2">9,9,9</div>
                                                    <div class="pl-2 pr-2">8,8,8</div>
                                                    <div class="pl-2 pr-2">7,7,7</div>
                                                    <div class="pl-2 pr-2">6,6,6</div>
                                                    <div class="pl-2 pr-2">5,5,5</div>
                                                    <div class="pl-2 pr-2">4,4,4</div>
                                                    <div class="pl-2 pr-2">3,3,3</div>
                                                    <div class="pl-2 pr-2">2,2,2</div>
                                                </li>
                                                <li>If none of the game have got trio then second criteria will apply.</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Second criteria:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Game having all the three face card will win.</li>
                                                <li>Here JACK, QUEEN AND KING are named face card.</li>
                                                <li>if both the game have all three face cards then game having highest face card will win.</li>
                                                <li>Ranking of face card from High to low :
                                                    <div class="pl-2 pr-2">Spade King</div>
                                                    <div class="pl-2 pr-2">Heart King</div>
                                                    <div class="pl-2 pr-2">Club King</div>
                                                    <div class="pl-2 pr-2">Diamond King</div>
                                                </li>
                                                <li>Same order will apply for Queen (Q) and Jack (J) also .</li>
                                                <li>If second criteria is also not applicable, then 3rd criteria will apply .</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">3rd criteria:</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Game having higher baccarat value will win .</li>
                                                <li>For deciding baccarat value we will add point value of all the three cards</li>
                                                <li>Point value of all the cards :
                                                    <div class="pl-2 pr-2">1 = 1</div>
                                                    <div class="pl-2 pr-2">2 = 2</div>
                                                    <div class="pl-2 pr-2">To</div>
                                                    <div class="pl-2 pr-2">9 = 9</div>
                                                    <div class="pl-2 pr-2">10, J ,Q, K has zero (0) point value .</div>
                                                </li>
                                            </ul>
                                            <p><b>Example 1st:</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Last digit of total will be considered as baccarat value
                                                    <div class="pl-2 pr-2">2,5,8 =</div>
                                                    <div class="pl-2 pr-2">2+5+8 =15 here last digit of total is 5 , So baccarat value is 5.</div>
                                                </li>
                                            </ul>
                                            <p><b>Example 2nd :</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>1,3,K</li>
                                                <li>1+3+0 = 4 here total is in single digit so we will take this single digit 4 as baccarat value</li>
                                            </ul>
                                            <p><b>If baccarat value of both the game is equal then Following condition will apply :</b></p>
                                            <p><b>Condition 1 :</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Game having more face card will win.</li>
                                                <li>Example : Game A has 3,4,k and B has 7,J,Q then game B will win as it has more face card then game A .</li>
                                            </ul>
                                            <p><b>Condition 2 :</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>If Number of face card of both the game are equal then higher value face card game will win.</li>
                                                <li>Example : Game A has 4,5,K (K Spade ) and Game B has 9,10,K ( K Heart ) here baccarat value of both the game is equal (9 ) and both the game have same number of face card so game A will win because It has got higher value face card then Game B .</li>
                                            </ul>
                                            <p><b>Condition 3 :</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>If baccarat value of both the game is equal and none of game has got face card then in this case Game having highest value point card will win .</li>
                                                <li>Value of Point Cards :
                                                    <div class="pl-2 pr-2">Ace = 1</div>
                                                    <div class="pl-2 pr-2">2 = 2</div>
                                                    <div class="pl-2 pr-2">3 = 3</div>
                                                    <div class="pl-2 pr-2">4 = 4</div>
                                                    <div class="pl-2 pr-2">5 = 5</div>
                                                    <div class="pl-2 pr-2">6 = 6</div>
                                                    <div class="pl-2 pr-2">7 = 7</div>
                                                    <div class="pl-2 pr-2">8 = 8</div>
                                                    <div class="pl-2 pr-2">9 = 9</div>
                                                    <div class="pl-2 pr-2">10 = 0 (Zero )</div>
                                                </li>
                                                <li>Example : GameA: 1,6,10 And GameB: 7,10,10</li>
                                                <li>here both the game have same baccarat value . But game B will win as it has higher value point card i.e. 7 .</li>
                                            </ul>
                                            <p><b>Condition 4 :</b></p>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>If baccarat value of both game is equal and none of game has got face card and high point card of both the game is of equal point value , then suits of both high card will be compared</li>
                                                <li>Example :
                                                    <div class="pl-2 pr-2">
                                                        Game A : 1(Heart) ,2(Heart) ,5(Heart)
                                                    </div>
                                                    <div class="pl-2 pr-2">
                                                        Game B : 10 (Heart) , 3 (Diamond ) , 5 (Spade )
                                                    </div>
                                                </li>
                                                <li>Here Baccarat value of both the game (8) is equal . and none of game has got face card and point value of both game's high card is equal so by comparing suits of both the high card ( A 5 of Heart , B 5 of spade ) game B is declared 3 Baccarat winner .</li>
                                                <li>Ranking of suits from High to low :
                                                    <div class="pl-2 pr-2">Spade</div>
                                                    <div class="pl-2 pr-2">Heart</div>
                                                    <div class="pl-2 pr-2">Club</div>
                                                    <div class="pl-2 pr-2">Diamond</div>
                                                </li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Rules of Total :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is a comparison of total of all three cards of both the games.</li>
                                                <li>Point value of all the cards for the bet of total
                                                    <div class="pl-2 pr-2">Ace = 1</div>
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
                                                <li>suits doesn't matter</li>
                                                <li>If total of both the game is equal , it is a Tie .</li>
                                                <li>If total of both the game is equal then half of your bet amount will returned.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Rules of Pair Plus :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>This bet provides multiple option to win a price .</li>
                                                <li>Option 1 : Pair</li>
                                                <li>If you got pair you will get equal value return of your betting amount .</li>
                                                <li>Option 2 : Flush</li>
                                                <li>If you have all three cards of same suits you will get 4 times return of your betting amount .</li>
                                                <li>Option 3 : Straight</li>
                                                <li>If you have straight ( three cards in sequence eg : 4,5,6 eg: J,Q,K ) (but king ,Ace ,2 is not a straight ) you will get six times return of your betting amount .</li>
                                                <li>Option 4 : Trio</li>
                                                <li>If you have got all the cards of same rank ( eg: 4,4,4 J,J,J ) you will get 30 times return of your betting amount .</li>
                                                <li>Option 5 : Straight Flush</li>
                                                <li>If you have straight of all three cards of same suits ( Three cards in sequence eg: 4,5,6 ) ( but King ,Ace ,2 is not straight ) you will get 40 times return of your betting amount .</li>
                                                <li>Note : If you have trio then you will receive price of trio only , In this case you will not receive price of pair .</li>
                                                <li>If you have straight flush you will receive price of straight flush only , In this case you will not receive price of straigh and flush .</li>
                                                <li>It means you will receive only one price whichever is higher .</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Rules of Color :</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>This is a bet for having more cards of red or Black (Heart and Diamond are named RED , Spade and Club are named BLACK ).</li>
                                            </ul>
                                        </div></div>` :  `<div><style type="text/css">
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

<div class="rules-section">
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>The game is played with a regular 52 cards single deck, between 2 players A and B.</li>
                                                <li>Each player will receive 3 cards.</li>
                                                <li><b>Rules of regular teenpatti winner</b></li>
                                            </ul>
                                            
                                        </div></div>`


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


                const founddata = data.sub.find(item => item.nat === index1)
                if (founddata) {

                    updatedPlayers[index1].odds = founddata.b
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

    const updateAmounts = async () => {
        const amountData = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')

        const teamAmounts = {}

        if (amountData.data && Array.isArray(amountData.data)) {
            amountData.data.forEach(value => {

                teamAmounts[value.team_name] = value.total_amount;

            })
        }


        setTotalPlayers((prevPlayer) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer))

            Object.entries(updatedPlayers).forEach(([index1, value1], i) => {


                if (teamAmounts[index1] !== undefined) {

                    updatedPlayers[index1].amounts = teamAmounts[index1]

                } 


            })


            return updatedPlayers
        })


    }


    useEffect(() => {


     

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            // Separate even and odd cards
            const evenCards = cardArray.filter((_, index) => index % 2 === 0);
            const oddCards = cardArray.filter((_, index) => index % 2 !== 0);
            
            setCards({
                playerA: evenCards,
                playerB: oddCards,  // Player B gets odd cards
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.card]);


    useEffect(() => {
        if (data?.sub) {

            updatePlayers()


        }

    }, [data?.sub])
    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()

        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
        setBetType(bet)


        if (parseFloat(oddvalue) >= 0) {
            roundIdSaved.current = roundId
            setbackOrLay(isBakOrLay)
            setPopupDisplayForDesktop(true);
            teamname.current = teamnam
            setOdds(oddvalue)
        } else {
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger')

        }


    }

    // Helper function to find data in data.sub for Teen20b
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen20b, find the item by nat field
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
            totalPlayers: totalPlayers['Player B'],
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

        <CasinoLayout ruleImage={ruleImage} raceClass="teenpatti20" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay}
                      teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">

                        <PlayerTable players={Object.entries(totalPlayers).slice(0, 6)} playerKeys="A"
                                     openPopup={openPopup}/>
                        <PlayerTable players={Object.entries(totalPlayers).slice(6, 12)} playerKeys="B"
                                     table="casino-table-right-box" openPopup={openPopup}/>
                    </div>
                    <div className="teenpatti20-other-oods d-md-flex">

                        <PlayerTable players={Object.entries(totalPlayers).slice(0, 6)} playerKeys="A"
                                     openPopup={openPopup} cards={true}/>
                        <PlayerTable players={Object.entries(totalPlayers).slice(6, 12)} playerKeys="B"
                                     table="casino-table-right-box" openPopup={openPopup} cards={true}/>
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

const PlayerTable = ({table = 'casino-table-left-box', players, playerKeys, openPopup, cards = false}) => (

    <>
        {cards === false && (

            <div className={table}>
                <div className="casino-table-header">
                    <div className="casino-nation-detail">{`Player ${playerKeys}`}</div>
                </div>
                <div className="casino-table-body">
                    <div className="casino-table-row">
                        {players.slice(0, 4).map(([index, value1], i3) => (
                            <div className="casino-odds-box" key={i3}>{index}</div>
                        ))}

                    </div>
                    <div className="casino-table-row">
                        {players.slice(0, 4).map(([index1, value2], io) => (
                            <div className={`casino-odds-box back ${value2.status}`} key={io}
                                 onClick={() => openPopup('back', index1, value2.odds, value2.type)}>
                                <span className="casino-odds">{value2.odds}</span>
                                {getExByColor(value2.amounts)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {cards === true && (
            <div className={table}>
                {players.slice(4, 6).map(([index3, value3], i5) => (
                        <div className={`casino-odds-box back ${value3.status}`} key={i5}
                             onClick={() => openPopup('back', index3, value3.odds, value3.type)}>
                            <div>
                                {index3.includes("Black") ? (
                                    <>
                                        <img src={import.meta.env.VITE_CARD_PATH + "spade.png"} alt="spade"/>
                                        <img src={import.meta.env.VITE_CARD_PATH + "club.png"} alt="club"/>
                                    </>
                                ) : (
                                    <>
                                        <img src={import.meta.env.VITE_CARD_PATH + "heart.png"} alt="spade"/>
                                        <img src={import.meta.env.VITE_CARD_PATH + "diamond.png"} alt="club"/>
                                    </>
                                )}
                            </div>
                            <div>
                                <span className="casino-odds">{value3.odds}</span>
                                {getExByColor(value3.amounts)}
                            </div>
                        </div>
                    )
                )}

            </div>
        )}

    </>
)

export default Teen20b;
